import { prisma } from "@/lib/neon/db";

export async function POST() {
  try {
    const basePesquisa = {
      fields: ["Categoria"],
    };

    const baseParams = {
      key: process.env.VISTA_KEY!,
    };

    const makeUrl = (finalidade: string) => {
      const pesquisa = {
        ...basePesquisa,
        filter: { Finalidade: finalidade },
      };

      const params = new URLSearchParams({
        ...baseParams,
        pesquisa: JSON.stringify(pesquisa),
      });

      return `https://terrasul-rest.vistahost.com.br/imoveis/listarConteudo?${params}`;
    };

    // Requisições paralelas
    const [residencialResponse, comercialResponse] = await Promise.all([
      fetch(makeUrl("RESIDENCIAL"), {
        method: "GET",
        headers: { Accept: "application/json" },
      }),
      fetch(makeUrl("COMERCIAL"), {
        method: "GET",
        headers: { Accept: "application/json" },
      }),
    ]);

    if (!residencialResponse.ok || !comercialResponse.ok) {
      throw new Error("Falha ao obter categorias");
    }

    const residencialData = await residencialResponse.json();
    const comercialData = await comercialResponse.json();

    // Trata as categorias (divide se vierem juntas com vírgula, remove vazios, remove duplicatas)
    const parseCategorias = (entrada: string[] = []) =>
      [...new Set(
        entrada
          .flatMap((cat) =>
            cat
              .split(",")
              .map((c) => c.trim())
              .filter((c) => c !== "")
          )
      )];

    const categoriasResidencial = parseCategorias(residencialData?.Categoria);
    const categoriasComercial = parseCategorias(comercialData?.Categoria);

    return new Response(
      JSON.stringify({
        message: "Categorias armazenadas com sucesso no Neon",
        totalResidencial: categoriasResidencial.length,
        totalComercial: categoriasComercial.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro no POST:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await prisma.$disconnect(); // Desconecta o Prisma Client no final da requisição
  }
}