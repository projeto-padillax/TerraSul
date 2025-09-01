import { Destaque } from "@/lib/types/destaque";
import { prisma } from "@/lib/neon/db";

export async function getDestaques() {
  const [lancamentos, venda, aluguel] = await Promise.all([
    // Query for "Lançamentos"
    prisma.imovel.findMany({
      where: {
        DestaqueWeb: "Sim",
        Lancamento: "Sim",
      },
      take: 4,
    }),
    // Query for "Venda"
    prisma.imovel.findMany({
      where: {
        DestaqueWeb: "Sim",
        Lancamento: "Nao",
        Status: "VENDA",
      },
      take: 4,
    }),
    // Query for "Aluguel"
    prisma.imovel.findMany({
      where: {
        DestaqueWeb: "Sim",
        Lancamento: "Nao",
        Status: "ALUGUEL",
      },
      take: 4,
    }),
  ]);

  return {
    lancamentos: lancamentos as Destaque[],
    venda: venda as Destaque[],
    aluguel: aluguel as Destaque[],
  };
}