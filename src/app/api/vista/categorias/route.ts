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

      return `https://gruposou-rest.vistahost.com.br/imoveis/listarConteudo?${params}`;
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

    // Limpa a tabela antes de inserir novos dados para evitar duplicatas em cada execução
    await prisma.finalidade.deleteMany({});

    // Salva no Neon usando Prisma
    const finalidadesParaSalvar = [
      ...categoriasResidencial.map((nome) => ({ nome, tipo: "residencial" })),
      ...categoriasComercial.map((nome) => ({ nome, tipo: "comercial" })),
    ];

    await prisma.finalidade.createMany({
      data: finalidadesParaSalvar,
      skipDuplicates: true, // Garante que não haverá duplicatas se, por algum motivo, a mesma categoria for gerada novamente
    });

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

export async function GET() {
  try {
    // Consulta todas as finalidades no Neon usando Prisma
    const finalidades = await prisma.finalidade.findMany({
      select: {
        nome: true,
        tipo: true,
      },
    });

    // Filtra e organiza por tipo
    const residencial = finalidades
      .filter((f) => f.tipo === "residencial")
      .map((f) => f.nome);
    const comercial = finalidades
      .filter((f) => f.tipo === "comercial")
      .map((f) => f.nome);

    if (!residencial.length && !comercial.length) {
      return new Response(
        JSON.stringify({ error: "Categorias não encontradas" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        residencial: residencial,
        comercial: comercial,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
    return new Response(
      JSON.stringify({ error: "Erro interno no servidor" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  } finally {
    await prisma.$disconnect(); // Desconecta o Prisma Client no final da requisição
  }
}