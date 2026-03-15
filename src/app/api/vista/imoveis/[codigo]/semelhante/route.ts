import { prisma } from "@/lib/neon/db";
import { NextResponse } from "next/server";
// Type definitions to match your Prisma schema and Firestore data
// You can keep a more specific type if 'Imovel' doesn't contain all fields
// but for now, it's mapped to the Prisma Imovel model.
type Imovel = {
  id: string; // Prisma uses 'id' as the primary key from your schema
  Codigo?: string | null;
  Cidade?: string | null;
  Categoria?: string | null;
  Status?: string | null; // Match Prisma's string type for Status
  ValorVenda?: number | null; // Now number in Prisma
  ValorLocacao?: number | null; // Now number in Prisma
  // Add other fields you might need from Imovel model
};

const STATUS_COMPATIVEIS = {
  venda: ["VENDA", "VENDA E ALUGUEL"] as const,
  aluguel: ["ALUGUEL", "VENDA E ALUGUEL"] as const,
};

// No longer needed as ValorVenda/ValorLocacao are numbers from Prisma
// function toNumberSafe(v?: string): number | null {
//   if (!v) return null;
//   const n = Number(v);
//   return Number.isFinite(n) ? n : null;
// }

function decideModalidade(base: Imovel, explicit?: "venda" | "aluguel"): "venda" | "aluguel" {
  if (explicit) return explicit;
  const venda = base.ValorVenda; // Now directly a number or null
  const loc = base.ValorLocacao; // Now directly a number or null

  if (venda && venda > 0) return "venda";
  if (loc && loc > 0) return "aluguel";
  // Fallback to Status if prices are not available or zero
  if (base.Status === "ALUGUEL") return "aluguel";
  return "venda";
}

export async function GET(req: Request, { params }: { params: Promise<{ codigo: string }> }) {
  try {
    const url = new URL(req.url);
    const explicitModalidade = url.searchParams.get("modalidade") as "venda" | "aluguel" | null;

    const { codigo } = await params;

    // 1. Fetch the base property using Prisma
    const baseImovel = await prisma.imovel.findUnique({
      where: {
        id: codigo,
      },
      select: { // Select only the fields needed for comparison
        id: true, // Important for excluding itself later
        Codigo: true,
        Cidade: true,
        Categoria: true,
        Status: true,
        ValorVenda: true,
        ValorLocacao: true,
        EstudaDacao: true,
        Endereco: true,
      },
    });

    if (!baseImovel) {
      return NextResponse.json({ error: "Imóvel base não encontrado" }, { status: 404 });
    }

    const base: Imovel = baseImovel as Imovel; // Cast to your Imovel type for consistency with decideModalidade

    const modalidade = decideModalidade(base, explicitModalidade ?? undefined);
    const priceField = modalidade === "aluguel" ? "ValorLocacao" : "ValorVenda";
    const basePrice = base[priceField]; // Access directly, it's already a number or null

    if (basePrice === null || basePrice === undefined || basePrice <= 0) {
      return NextResponse.json(
        { error: `Imóvel base sem ${priceField} válido para comparação` },
        { status: 400 }
      );
    }

    const minPrice = Math.floor(basePrice * 0.85); // Use Math.floor/ceil for integer prices
    const maxPrice = Math.ceil(basePrice * 1.15);

    const cidade = base.Cidade;
    const categoria = base.Categoria
    // const categoria = base.Categoria;

    // Ensure types for Prisma where clause are correct
    const statusCompat = STATUS_COMPATIVEIS[modalidade] as readonly ("VENDA" | "ALUGUEL" | "VENDA E ALUGUEL")[];

    // 2. Build the Prisma query for similar properties — sort by price proximity in DB
    const similarImoveis = await prisma.imovel.findMany({
      where: {
        AND: [
          { Codigo: { not: base.Codigo } },
          cidade ? { Cidade: cidade } : {},
          categoria ? { Categoria: categoria } : {},
          { Status: { in: statusCompat as string[] } },
          {
            [priceField]: {
              gte: minPrice,
              lte: maxPrice,
            },
          },
        ],
      },
      take: 4,
      orderBy: {
        [priceField]: 'asc',
      },
      select: {
        id: true,
        Codigo: true,
        Cidade: true,
        Categoria: true,
        Status: true,
        ValorVenda: true,
        ValorLocacao: true,
        Bairro: true,
        Dormitorios: true,
        Suites: true,
        Vagas: true,
        AreaUtil: true,
        AreaTotal: true,
        FotoDestaque: true,
        Lancamento: true,
        Endereco: true,
        fotos: {
          select: {
            id: true,
            destaque: true,
            codigo: true,
            url: true,
            urlPequena: true,
          },
          orderBy: { id: 'asc' },
          take: 5,
        },
      },
    });

    const top4 = similarImoveis;

    return NextResponse.json({
      base: { codigo: base.Codigo, modalidade, priceField, basePrice },
      semelhantes: top4,
    }, {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=600",
      },
    });
  } catch (err) {
    if (err instanceof Error) console.error("Erro ao buscar imóveis semelhantes:", err.message);
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 });
  }
}