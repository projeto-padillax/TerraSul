import { prisma } from "@/lib/neon/db";
import { Imovel } from "@prisma/client";
import { notFound, redirect } from "next/navigation";

function toSlug(text: string): string {
  return text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
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

export default async function ImovelRedirectPage({
  params,
}: {
  params: Promise<{ codigo: string }>;
}) {
  const { codigo } = await params;
  const codigoUppercase = codigo.toUpperCase();

  const imovel = await prisma.imovel.findUnique({
    where: { id: codigoUppercase },
  });

  if (!imovel) notFound();

  const slug = toSlug(gerarTitulo(imovel));
  redirect(`/imovel/${slug}/${imovel.Codigo}`);
}
