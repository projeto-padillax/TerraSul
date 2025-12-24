export const dynamic = "force-dynamic";
export const revalidate = 0;

import { getAllSecoes } from "@/lib/actions/secoes";
import type { MetadataRoute } from "next";
import { Imovel } from "@prisma/client";
import { getAllImoveisForSitemap } from "@/lib/actions/imovel";

function toSlug(text: string): string {
  return (
    text
      .normalize("NFD") // separa acentos das letras
      .replace(/[\u0300-\u036f]/g, "") // remove os acentos
      .toLowerCase() // converte pra minúsculas
      // .replace(/(?!\d\.\d)\./g, "") // remove outros pontos que não fazem parte de números
      // remove tudo que não for letra, número, espaço, ponto ou hífen
      .replace(/[^a-z0-9.\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-") // troca espaços por hífen
      .replace(/-+/g, "-") // evita múltiplos hífens
      .replace(" ", "-")
  ); // evita múltiplos hífens
  // .toLowerCase();
}

type ImovelSitemap = Pick<
  Imovel,
  | "Codigo"
  | "Categoria"
  | "AreaUtil"
  | "AreaTotal"
  | "Dormitorios"
  | "Suites"
  | "Bairro"
  | "Cidade"
  | "Vagas"
>;

function gerarTitulos(imovel: ImovelSitemap) {
  const capitalizar = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  let categoria = imovel.Categoria ? imovel.Categoria : "Imóvel";

  categoria = categoria.replaceAll(" ", "_");
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

  const bairro = imovel.Bairro ? `${capitalizar(imovel.Bairro)}` : "";
  const cidade = imovel.Cidade ? `em ${capitalizar(imovel.Cidade)}` : "";

  const detalhes = [area && `com ${area}`, quartos, suites]
    .filter(Boolean)
    .join("-");

  const localizacao = [bairro, cidade].filter(Boolean).join(" ");

  if (!detalhes) {
    return [categoria, localizacao].filter(Boolean).join(" ");
  }

  return [categoria, detalhes, localizacao].filter(Boolean).join(" ");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const secoes = await getAllSecoes();
  const imoveis = await getAllImoveisForSitemap();

  const secoesRoutes = secoes.map((secao) => ({
    url: secao.url,
    lastModified: new Date(),
    changeFrequency: "yearly" as const,
    priority: 1,
  }));

  // Mapear os imóveis para as rotas dinâmicas.
  const imoveisRoutes = imoveis.map((imovel: ImovelSitemap) => {
    const url = `${process.env.NEXT_PUBLIC_BASE_URL}/imovel/${toSlug(
      gerarTitulos(imovel),
    )}/${imovel.Codigo}`;

    return {
      url,
      changeFrequency: "daily" as const,
      priority: 0.8,
    };
  });

  const residenciaisTypes = [
    "apartamento",
    "casa",
    "Casa em Condomínio",
    "cobertura",
    "comercial",
    "Sitio/Chácara",
    "terreno",
    "imoveis",
  ];

  const baseParams: Record<string, string> = {
    action: "comprar",
    page: "1",
  };

  const buildQuery = (params: Record<string, string>) =>
    new URLSearchParams(params).toString().replace(/&/g, "&amp;");

  const cidades = ["porto-alegre", "eldorado-do-sul", "viamao"];

  const searchImoveisRoutes = cidades.flatMap((cidade) =>
    residenciaisTypes.map((tipo) => {
      const url = `${process.env.NEXT_PUBLIC_BASE_URL}/busca/comprar/${toSlug(
        tipo,
      )}/${cidade}?${buildQuery(baseParams)}`;

      return {
        url,
        changeFrequency: "daily" as const,
        priority: 0.8,
      };
    }),
  );

  return [...secoesRoutes, ...imoveisRoutes, ...searchImoveisRoutes];
}
