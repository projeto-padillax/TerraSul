import { VistaImovel } from "@/app/types/vista";
import { prisma } from "@/lib/neon/db";
import { NextResponse } from "next/server";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params; // Destructure codigo directly from params

    const imovel = await prisma.imovel.findUnique({
      where: {
        id: codigo, // Query by the 'Codigo' field in your Prisma schema
      },
      include: {
        fotos: {
          select: {
            id: true,
            destaque: true,
            codigo: true,
            url: true,
            urlPequena: true,
          },
          orderBy: {
            id: "asc",
          },
        },
        videos: {
          select: {
            id: true,
            destaque: true,
            video: true,
          },
        },
        caracteristicas: {
          select: {
            nome: true,
            valor: true,
          },
        },
        infraestrutura: {
          select: {
            nome: true,
            valor: true,
          },
        },
        corretor: {
          select: {
            id: true,
            name: true,
            email: true,
            telefone: true,
            nomeAgencia: true,
            codigo: true,
            codigoAgencia: true,
            codigoEquipe: true,
            foto: true,
            atuacaoLocacao: true,
            atuacaoVenda: true,
            CRECI: true,
          },
        },
      },
    });

    // if (!imovel) {
    //   imovel = await prisma.imovel.findFirst({
    //     where: {
    //       Empreendimento: {
    //         equals: codigo,
    //         mode: "insensitive",
    //       },
    //     },
    //     include: {
    //       fotos: {
    //         select: {
    //           id: true,
    //           destaque: true,
    //           codigo: true,
    //           url: true,
    //           urlPequena: true,
    //         },
    //         orderBy: {
    //           id: "asc",
    //         },
    //       },
    //       caracteristicas: {
    //         select: {
    //           nome: true,
    //           valor: true,
    //         },
    //       },
    //     },
    //   });
    // }

    if (!imovel) {
      return NextResponse.json(
        { error: "Imóvel não encontrado" },
        { status: 404 }
      );
    }

    return NextResponse.json(imovel); // Return the found property
  } catch (error) {
    // Add type annotation for error
    if (error instanceof Error) {
      console.error("Erro ao buscar imóvel:", error.message); // Log error message
    }
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Disconnect Prisma client after the request
  }
}

async function fetchFromVista(codigo: string): Promise<VistaImovel | null> {
  const key = process.env.VISTA_KEY;
  if (!key) throw new Error("VISTA_KEY não configurada no .env");

  const base = "https://terrasul-rest.vistahost.com.br/imoveis/detalhes";
  const url =
    `${base}?key=${encodeURIComponent(key)}` +
    `&imovel=${encodeURIComponent(codigo)}` +
    `&pesquisa={"fields":["Codigo","ValorIptu", "ValorCondominio", "Categoria",
                          "AreaTerreno", "Bairro", "GMapsLatitude", "GMapsLongitude", "Cidade",
                          "ValorVenda", "ValorLocacao", "Dormitorios", "Suites", "Vagas", "AreaTotal",
                          "Caracteristicas", "InfraEstrutura", "Descricao", "DataHoraAtualizacao", "Lancamento",
                          "Status", "Empreendimento", "Endereco", "AreaUtil", "Exclusivo", "EstudaDacao",
                          "Numero", "Complemento", "UF", "CEP", "DestaqueWeb", "FotoDestaque", "Latitude", "Longitude", "FotoDestaqueEmpreendimento", "VideoDestaque",{ Video: ["ExibirNoSite","Descricao","Destaque","Tipo","Video"]},{"Foto":["Foto","FotoPequena","Destaque"]}]}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: {
      Accept: "application/json",
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`Vista HTTP ${res.status} - ${text}`);
  }

  const data = await res.json().catch(() => null);
  if (!data) return null;
  if (Array.isArray(data) && data.length === 0) return null;

  return data;
}

export async function PUT(
  _: Request,
  { params }: { params: Promise<{ codigo: string }> }
) {
  try {
    const { codigo } = await params;

    const vistaImovel = await fetchFromVista(codigo);
    const imovelExistente = await prisma.imovel.findUnique({
      where: { Codigo: codigo },
    });

    if (!vistaImovel) {
      if (imovelExistente) {
        await prisma.foto.deleteMany({
          where: { imovelId: imovelExistente.id },
        });
        await prisma.caracteristica.deleteMany({
          where: { imovelId: imovelExistente.id },
        });
        await prisma.imovel.delete({ where: { id: imovelExistente.id } });
      }

      return NextResponse.json(
        {
          ok: false,
          message: "Imóvel não encontrado no Vista. Removido do banco.",
        },
        { status: 404 }
      );
    }

    const data = mapVistaToDb(vistaImovel);

    let imovel: typeof imovelExistente;

    const { fotos, videos, caracteristicas, ...dadosImovel } = data;

    if (imovelExistente) {
      await prisma.foto.deleteMany({ where: { imovelId: imovelExistente.id } });
      await prisma.caracteristica.deleteMany({
        where: { imovelId: imovelExistente.id },
      });

      imovel = await prisma.imovel.update({
        where: { id: imovelExistente.id },
        data: dadosImovel,
      });
    } else {
      imovel = await prisma.imovel.create({
        data: {
          id: codigo,
          ...dadosImovel,
        },
      });
    }

    if (fotos?.length) {
      await prisma.foto.createMany({
        data: fotos.map((f) => ({ ...f, imovelId: imovel.id })),
      });
    }

    if (videos?.length) {
      await prisma.video.createMany({
        data: videos.map((f) => ({ ...f, imovelId: imovel.id })),
      });
    }

    if (caracteristicas?.length) {
      await prisma.caracteristica.createMany({
        data: caracteristicas.map((c) => ({ ...c, imovelId: imovel.id })),
      });
    }

    return NextResponse.json({ ok: true, imovel });
  } catch (err) {
    console.error("PUT /api/vista/imoveis/[codigo] error:", err);
    return NextResponse.json({ status: 500 });
  }
}

function mapVistaToDb(v: VistaImovel) {
  return {
    Codigo: v.Codigo,
    Categoria: v.Categoria,
    Bairro: v.Bairro,
    Cidade: v.Cidade,
    ValorVenda: v.ValorVenda ? Number(v.ValorVenda) : 0,
    ValorLocacao: v.ValorLocacao ? Number(v.ValorLocacao) : 0,
    Dormitorios: v.Dormitorios,
    Suites: v.Suites,
    Vagas: v.Vagas,
    AreaTotal: v.AreaTotal ? parseFloat(v.AreaTotal) : 0,
    AreaUtil: v.AreaUtil ? parseFloat(v.AreaUtil) : 0,
    DataHoraAtualizacao: new Date(),

    ValorIptu: v.ValorIptu,
    ValorCondominio: v.ValorCondominio,
    GMapsLatitude: v.GMapsLatitude,
    GMapsLongitude: v.GMapsLongitude,
    Lancamento: v.Lancamento,
    Status: v.Status,
    Empreendimento: v.Empreendimento,
    Endereco: v.Endereco,
    Numero: v.Numero,
    Complemento: v.Complemento,
    UF: v.UF,
    CEP: v.CEP,
    DestaqueWeb: v.DestaqueWeb,
    FotoDestaque: v.FotoDestaque,
    Latitude: v.Latitude,
    Longitude: v.Longitude,
    FotoDestaqueEmpreendimento: v.FotoDestaqueEmpreendimento,
    VideoDestaque: v.VideoDestaque,
    EstudaDacao: v.EstudaDacao,
    Exclusivo: v.Exclusivo,

    fotos: Object.values(v.Foto ?? {}).map((f) => ({
      codigo: f.Codigo,
      url: f.Foto,
      urlPequena: f.FotoPequena,
      destaque: f.Destaque,
    })),

    videos: Object.values(v.Video ?? {}).map((f) => ({
      video: f.Video,
      destaque: f.Destaque,
    })),

    caracteristicas: Object.entries(v.Caracteristicas ?? {}).map(
      ([nome, valor]) => ({
        nome,
        valor,
      })
    ),
  };
}
