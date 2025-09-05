import Link from "next/link";
import { ImovelCard } from "./imovelcard";
import { Destaque } from "@/lib/types/destaque";
import { Imovel } from "@prisma/client";

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
    imovel.AreaTerreno || imovel.AreaTotal
      ? `${imovel.AreaTerreno || imovel.AreaTotal}m²`
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
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vista/imoveis/${codigo}/semelhante`,
    { cache: "no-store" }
  );

  if (!res.ok) return null;

  const data: ApiSemelhantes = await res.json();
  const itens = (data.semelhantes ?? []).slice(0, 4);

  if (!itens.length) return null;

  const activeTab = data.base?.modalidade === "aluguel" ? "Alugar" : "Comprar";

  return (
    <section className="mt-10">
      <h2 className="text-[#4d4d4d] text-xl font-bold mb-7">
        Imóveis semelhantes
      </h2>
      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
        {itens.map((imovel) => (
          <Link
            key={imovel.Codigo}
            href={`/imovel/${encodeURIComponent(toSlug(gerarTitulo(imovel)))}/${
              imovel.Codigo
            }`}
            className="block"
          >
            <ImovelCard imovel={imovel} activeTab={activeTab} />
          </Link>
        ))}
      </div>
    </section>
  );
}
