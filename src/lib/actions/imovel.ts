import { Imovel } from "@prisma/client";
import { prisma } from "../neon/db";

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

export async function getAllImoveisForSitemap(): Promise<ImovelSitemap[]> {
  try {
    const imoveis = await prisma.imovel.findMany({
      select: {
        Categoria: true,
        Cidade: true,
        Codigo: true,
        Suites: true,
        Vagas: true,
        Bairro: true,
        AreaUtil: true,
        AreaTotal: true,
        Dormitorios: true
      },
    });

    return imoveis; // já é um array
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    return [];
  }
}