import { prisma } from "@/lib/neon/db";

export async function POST() {
  try {
    const basePesquisa = {
      fields: ["Cidade"],
    };

    const baseParams = {
      key: process.env.VISTA_KEY!,
    };

    const makeUrl = () => {
      const params = new URLSearchParams({
        ...baseParams,
        pesquisa: JSON.stringify(basePesquisa),
      });
      return `https://terrasul-rest.vistahost.com.br/imoveis/listarConteudo?${params}`;
    };

    const firstResponse = await fetch(makeUrl(), {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    if (!firstResponse.ok) throw new Error("Falha ao obter cidades");

    const firstData = await firstResponse.json();
    const cidades: string[] = firstData?.Cidade ?? [];

    if (!Array.isArray(cidades) || cidades.length === 0) {
      throw new Error("Nenhuma cidade encontrada");
    }

    for (const cidadeNome of cidades) {
      if (cidadeNome.length == 0) continue;

      console.log(cidadeNome);
      const pesquisa = {
        fields: ["Cidade", "Bairro"],
        filter: { Cidade: cidadeNome },
      };

      const params = new URLSearchParams({
        ...baseParams,
        pesquisa: JSON.stringify(pesquisa),
      });

      const url = `https://terrasul-rest.vistahost.com.br/imoveis/listarConteudo?${params}`;

      const response = await fetch(url, {
        method: "GET",
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        console.warn(`Falha ao buscar bairros da cidade: ${cidadeNome}`);
        continue;
      }

      const data = await response.json();
      console.log(data)
      const bairros: string[] = (data?.Bairro ?? []).flatMap((b: string) =>
        b
          .split(",")
          .map((nome) => nome.trim())
          .filter((nome) => nome !== "")
      );

      // Upsert city
      const cidade = await prisma.cidade.upsert({
        where: { nome: cidadeNome },
        update: {},
        create: { nome: cidadeNome },
      });

      // Clear existing bairros for the city to avoid duplicates
      await prisma.bairro.deleteMany({
        where: { cidadeId: cidade.id },
      });

      // Insert new bairros
      await prisma.bairro.createMany({
        data: [...new Set(bairros)].map((b) => ({
          nome: b,
          cidadeId: cidade.id,
        })),
        skipDuplicates: true,
      });
    }

    return new Response(
      JSON.stringify({
        message: "Cidades e bairros armazenados com sucesso",
        totalCidades: cidades.length,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Erro no POST:", error);
    return new Response(JSON.stringify({ error: "Erro interno no servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET() {
  try {
    const cidadesComBairros = await prisma.cidade.findMany({
      include: { bairros: true },
    });
    console.log("teste123")
    const cidades = cidadesComBairros.map((c) => ({
      cidade: c.nome.toLowerCase(),
      bairros: c.bairros.map((b) => b.nome),
    }));

    return new Response(JSON.stringify({ cidades }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao buscar cidades:", error);
    return new Response(JSON.stringify({ error: "Erro ao buscar cidades" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
