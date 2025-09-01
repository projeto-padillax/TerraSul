import { Imovel } from "@prisma/client";
import { prisma } from "../neon/db";

type ImovelSitemap = Pick<Imovel, "Categoria" | "Cidade" | "Finalidade" | "DataHoraAtualizacao">;

export async function getAllImoveisForSitemap(): Promise<ImovelSitemap[]> {
  try {
    const imoveis = await prisma.imovel.findMany({
      select: {
        Categoria: true,
        Cidade: true,
        Finalidade: true,
        DataHoraAtualizacao: true,
      },
    });

    return imoveis; // já é um array
  } catch (error) {
    console.error("Erro ao buscar imóveis:", error);
    return [];
  }
}