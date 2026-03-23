import Link from "next/link";
import { ImovelCard } from "./imovelcard";
import { Destaque } from "@/lib/types/destaque";
import { Imovel } from "@prisma/client";
import { prisma } from "@/lib/neon/db";

type ApiSemelhantes = {
  base?: {
    codigo: string;
    modalidade?: "aluguel" | "venda";
    priceField?: "ValorLocacao" | "ValorVenda";
    basePrice?: number;
  };
  semelhantes: Destaque[];
};

function toSlug(text: string): string {
  return (
    text
      // .normalize("NFD") // separa acentos das letras
      .trim() // remove espaços extras do começo/fim
      .replace(/\s+/g, "-") // troca espaços por -
      .replace(/-+/g, "-")
  ); // evita múltiplos hífens
  // .toLowerCase();
}

function gerarTitulo(imovel: Imovel) {
  const capitalizar = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const categoria = imovel.Categoria ? capitalizar(imovel.Categoria) : "Imóvel";

  const area =
    imovel.AreaUtil || imovel.AreaTotal
      ? `${imovel.AreaUtil || imovel.AreaTotal}m²`
      : "";

  const quartos =
    imovel.Dormitorios && imovel.Dormitorios !== "0"
      ? `${imovel.Dormitorios} quarto${imovel.Dormitorios === "1" ? "" : "s"}`
      : "";

  const suites =
    imovel.Suites && imovel.Suites !== "0"
      ? `${imovel.Suites} suíte${imovel.Suites === "1" ? "" : "s"}`
      : "";

  const vagas =
    imovel.Vagas && imovel.Vagas !== "0"
      ? `${imovel.Vagas} vaga${imovel.Vagas === "1" ? "" : "s"}`
      : "";

  const bairro = imovel.Bairro ? `no bairro ${capitalizar(imovel.Bairro)}` : "";
  const cidade = imovel.Cidade ? `em ${capitalizar(imovel.Cidade)}` : "";

  const detalhes = [area && `com ${area}`, quartos, suites, vagas]
    .filter(Boolean)
    .join(", ");

  const localizacao = [bairro, cidade].filter(Boolean).join(" ");

  if (!detalhes) {
    return [categoria, localizacao].filter(Boolean).join(" ");
  }

  return [categoria, detalhes, localizacao].filter(Boolean).join(", ");
}

export default async function SemelhantesSection({
  codigo,
}: {
  codigo: string;
}) {
  const base = await prisma.imovel.findUnique({
    where: { id: codigo },
    select: { id: true, Codigo: true, Cidade: true, Categoria: true, Status: true, ValorVenda: true, ValorLocacao: true },
  });

  if (!base) return null;

  const modalidade = (base.ValorVenda && base.ValorVenda > 0) ? "venda" as const
    : (base.ValorLocacao && base.ValorLocacao > 0) ? "aluguel" as const
    : base.Status === "ALUGUEL" ? "aluguel" as const : "venda" as const;

  const priceField = modalidade === "aluguel" ? "ValorLocacao" : "ValorVenda";
  const basePrice = base[priceField];

  if (!basePrice || basePrice <= 0) return null;

  const itens = await prisma.imovel.findMany({
    where: {
      AND: [
        { Codigo: { not: base.Codigo } },
        base.Cidade ? { Cidade: base.Cidade } : {},
        base.Categoria ? { Categoria: base.Categoria } : {},
        { Status: modalidade === "aluguel" ? { in: ["ALUGUEL", "VENDA E ALUGUEL"] } : { in: ["VENDA", "VENDA E ALUGUEL"] } },
        { [priceField]: { gte: Math.floor(basePrice * 0.85), lte: Math.ceil(basePrice * 1.15) } },
      ],
    },
    take: 4,
    orderBy: { [priceField]: "asc" },
    select: {
      id: true, Codigo: true, Cidade: true, Categoria: true, Status: true,
      ValorVenda: true, ValorLocacao: true, Bairro: true, Dormitorios: true,
      Suites: true, Vagas: true, AreaUtil: true, AreaTotal: true,
      FotoDestaque: true, Lancamento: true, Endereco: true,
      fotos: { select: { id: true, destaque: true, codigo: true, url: true, urlPequena: true }, orderBy: { id: "asc" }, take: 5 },
    },
  }) as unknown as Destaque[];

  if (!itens.length) return null;

  const activeTab = modalidade === "aluguel" ? "Alugar" : "Comprar";

  return (
    <section className="mt-10">
      <h2 className="text-[#4d4d4d] text-xl font-bold mb-7">
        Imóveis semelhantes
      </h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {itens.map((imovel) => (
          <Link
            key={imovel.Codigo}
            href={`/imovel/${toSlug(gerarTitulo(imovel))}/${imovel.Codigo}`}
            className="block"
          >
            <ImovelCard imovel={imovel} activeTab={activeTab} />
          </Link>
        ))}
      </div>
    </section>
  );
}
