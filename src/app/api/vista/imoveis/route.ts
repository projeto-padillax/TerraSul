/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { prisma } from "@/lib/neon/db";
import { NextRequest, NextResponse } from "next/server";
import pLimit from "p-limit";

interface VistaPagination {
  pagina: number;
  quantidade: number;
}

interface VistaResearchPayload {
  fields: (string | Record<string, string[] | string>)[];
  paginacao?: VistaPagination;
}

interface VistaBaseParams {
  key: string;
  showtotal?: string;
}

interface VistaApiResponse {
  total?: string;
  paginas?: string;
  pagina?: string;
  quantidade?: string;
  [propertyCode: string]: any;
}

interface VistaPropertyDetailPhoto {
  Destaque?: boolean;
  Codigo?: string;
  Foto?: string;
  FotoPequena?: string;
}

interface VistaPropertyDetailVideo {
  Destaque?: boolean;
  Video?: string;
}

interface VistaPropertyDetails {
  Foto?: Record<string, VistaPropertyDetailPhoto>;
  Video?: Record<string, VistaPropertyDetailVideo>;
  [key: string]: any;
}

// --- Constantes ---
const VISTA_BASE_URL = process.env.VISTA_REST_BASE_URL;
const PROPERTIES_PER_PAGE = 50;

// Campos para a listagem (listar)
const base: string[] = [
  "Codigo",
  "ValorIptu",
  "ValorCondominio",
  "Categoria",
  "AreaTerreno",
  "Bairro",
  "GMapsLatitude",
  "GMapsLongitude",
  "Cidade",
  "ValorVenda",
  "ValorLocacao",
  "Dormitorios",
  "Suites",
  "Vagas",
  "AreaTotal",
  "AreaUtil",
  "Caracteristicas",
  "InfraEstrutura",
  "Descricao",
  "DataHoraAtualizacao",
  "Lancamento",
  "Status",
  "Empreendimento",
  "Endereco",
  "Numero",
  "Complemento",
  "UF",
  "CEP",
  "DestaqueWeb",
  "FotoDestaque",
  "Latitude",
  "Longitude",
  "FotoDestaqueEmpreendimento",
  "VideoDestaque",
  "AreaUtil",
  "EstudaDacao",
  "Exclusivo",
  "Desconto"
];

const LISTING_RESEARCH_FIELDS = [
  ...base,
  {
    Corretor: [
      "Nome",
      "CodigoAgencia",
      "Agencia",
      "CodigoEquipe",
      "Foto",
      "AtuacaoLocacao",
      "AtuacaoVenda",
      "CRECI",
      "Email",
      "Celular",
    ],
  },
];

// Campos para os detalhes (detalhes) - inclui a estrutura de fotos
const DETAIL_RESEARCH_FIELDS: (string | Record<string, string[]>)[] = [
  ...LISTING_RESEARCH_FIELDS, // Inclui todos os campos da listagem
  { Foto: ["Foto", "FotoPequena", "Destaque"] }, // ✨ ADICIONADO: Para buscar detalhes da foto
  { Video: ["ExibirNoSite", "Descricao", "Destaque", "Tipo", "Video"] }, // ✨ ADICIONADO: Para buscar detalhes do video
];

const BASE_PARAMS_LISTING: VistaBaseParams = {
  key: process.env.VISTA_KEY!,
  showtotal: "1",
};

const BASE_PARAMS_DETAILS: VistaBaseParams = {
  key: process.env.VISTA_KEY!,
};

/**
 * Constrói a URL para buscar as listagens de imóveis.
 * @param {number} page O número da página a ser buscada.
 * @returns {string} A URL completa para a API de listagem.
 */
const buildListingsUrl = (page: number): string => {
  const researchPayload: VistaResearchPayload = {
    fields: LISTING_RESEARCH_FIELDS,
    paginacao: {
      pagina: page,
      quantidade: PROPERTIES_PER_PAGE,
    },
  };

  const params = new URLSearchParams({
    ...BASE_PARAMS_LISTING,
    pesquisa: JSON.stringify(researchPayload),
  });

  return `${VISTA_BASE_URL}/listar?${params}`;
};

/**
 * Constrói a URL para buscar os detalhes de um imóvel, incluindo fotos.
 * ✨ CORRIGIDO: Esta função agora usa a lógica do seu makeUrlCadastraDetalhes
 * @param {string} propertyCode O código único do imóvel.
 * @returns {string} A URL completa para a API de detalhes do imóvel.
 */
const buildDetailsUrl = (propertyCode: string): string => {
  const researchPayload: VistaResearchPayload = {
    fields: DETAIL_RESEARCH_FIELDS, // ✨ Usa os campos de detalhe que incluem a estrutura 'Foto'
  };

  const params = new URLSearchParams({
    ...BASE_PARAMS_DETAILS,
    pesquisa: JSON.stringify(researchPayload),
    imovel: propertyCode, // ✨ O código do imóvel é passado como parâmetro 'imovel'
  });

  return `${VISTA_BASE_URL}/detalhes?${params}`;
};

/**
 * Extrai os dados dos imóveis da resposta da API, excluindo metadados.
 * @param {VistaApiResponse} apiData Os dados brutos recebidos da API.
 * @returns {Record<string, any>} Um objeto contendo apenas os dados dos imóveis, indexados pelo seu código.
 */
const extractProperties = (apiData: VistaApiResponse): Record<string, any> => {
  const properties: Record<string, any> = {};
  for (const key in apiData) {
    if (
      Object.prototype.hasOwnProperty.call(apiData, key) &&
      !["total", "paginas", "pagina", "quantidade"].includes(key)
    ) {
      properties[key] = apiData[key];
    }
  }
  return properties;
};

/**
 * Busca dados de uma URL fornecida.
 * @param {string} url A URL para buscar.
 * @returns {Promise<T>} Os dados da resposta em formato JSON.
 * @throws {Error} Se a requisição de rede falhar ou a resposta não for OK.
 */
async function fetchData<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(
      `Falha ao buscar dados de ${url}. Status: ${response.status}`
    );
  }
  return response.json() as Promise<T>;
}

interface VistaPropertyData {
  Codigo?: string;
  Cidade?: string;
  ValorVenda?: string;
  ValorLocacao?: string;
  Dormitorios?: string;
  Suites?: string;
  Vagas?: string;
  AreaTotal?: string;
  AreaUtil?: string;
  AreaTerreno?: string;
  DataHoraAtualizacao?: string;
  Lancamento?: string;
  InfraEstrutura?: Record<string, any>;
  Caracteristicas?: Record<string, any>;
  Foto?: Record<string, VistaPropertyDetailPhoto>;
  Video?: Record<string, VistaPropertyDetailVideo>;
  CodigoImobiliaria?: string; // ✨ Add CodigoImobiliaria to the interface to be safe
  Corretor_Codigo?: string;
  Corretor?: Record<string, any>;
  Exclusivo?: string; 
  EstudaDacao?: string;
  Desconto?: string;
  [key: string]: any; // Permite outros campos dinâmicos da API Vista
}

// ... (restante do código até processAndUpsertProperty)

/**
 * Processa um único imóvel, busca seus detalhes e o insere/atualiza no banco de dados.
 * @param {string} code O código do imóvel.
 * @param {VistaPropertyData} propertyData Os dados iniciais do imóvel.
 */

const processAndUpsertProperty = async (
  code: string,
  propertyData: VistaPropertyData
): Promise<void> => {
  try {
    const {
      Corretor_Codigo,
      Corretor,
      Caracteristicas,
      InfraEstrutura,
      Foto,
      DataHoraAtualizacao,
      Cidade,
      CodigoImobiliaria,
      ...restOfProperty
    } = propertyData || {};

    const validDataHoraAtualizacao: string =
      DataHoraAtualizacao && !isNaN(Date.parse(DataHoraAtualizacao))
        ? new Date(DataHoraAtualizacao).toISOString()
        : new Date().toISOString();

    const details: VistaPropertyDetails = await fetchData<VistaPropertyDetails>(
      buildDetailsUrl(code)
    ).catch((err) => {
      console.warn(
        `Não foi possível buscar detalhes para o imóvel ${code}: ${err.message}`
      );
      return {};
    });

    // Fotos
    const photosToCreate = Object.values(details.Foto || {}).map(
      (photo: VistaPropertyDetailPhoto) => ({
        destaque:
          photo.Destaque !== undefined && photo.Destaque !== null
            ? String(photo.Destaque)
            : null,
        codigo: photo.Codigo ?? null,
        url: photo.Foto ?? null,
        urlPequena: photo.FotoPequena ?? null,
      })
    );

    // Videos
    const VideosToCreate = Object.values(details.Video || {}).map(
      (video: VistaPropertyDetailVideo) => ({
        destaque:
          video.Destaque !== undefined && video.Destaque !== null
            ? String(video.Destaque)
            : null,
        video: video.Video ?? null
      })
    );

    // Características
    const characteristicsToCreate = Object.entries(Caracteristicas || {}).map(
      ([key, value]: [string, any]) => ({
        nome: key,
        valor: String(value),
      })
    );

    // Infraestrutura
    const infraToCreate = Object.entries(InfraEstrutura || {}).map(
      ([key, value]) => ({
        nome: key,
        valor: String(value),
      })
    );

    // Helpers
    const parseToInt = (value: string | null | undefined): number | null => {
      if (value === null || value === undefined || value.trim() === "") {
        return null;
      }
      const parsed = parseInt(value, 10);
      return isNaN(parsed) ? null : parsed;
    };

    const parseToFloat = (value: string | null | undefined): number | null => {
      if (!value || value.trim() === "") return 0;
      const parsed = parseFloat(value);
      return isNaN(parsed) ? null : parsed;
    };

    const valorVendaInt = parseToInt(restOfProperty.ValorVenda);
    const valorLocacaoInt = parseToInt(restOfProperty.ValorLocacao);
    const areaTotalFloat = parseToFloat(restOfProperty.AreaTotal);
    const areaUtilFloat = parseToFloat(restOfProperty.AreaUtil);
    const areaTerrenoFloat = parseToFloat(restOfProperty.AreaTerreno);

    // Prepara corretor
    let corretorId: string | null = null;
    if (Corretor) {
      const corretorValues = Object.values(Corretor);
      if (corretorValues.length > 0) {
        const corretorData: any = corretorValues[0];
        const corretor = await prisma.corretorExterno.upsert({
          where: { CRECI: corretorData.CRECI },
          update: {
            name: corretorData.Nome,
            email: corretorData.Email,
            telefone: corretorData.Celular,
            nomeAgencia: corretorData.Agencia,
            codigo: corretorData.Codigo,
            codigoAgencia: corretorData.CodigoAgencia,
            codigoEquipe: corretorData.CodigoEquipe,
            foto: corretorData.Foto,
            atuacaoLocacao: corretorData.AtuacaoLocacao,
            atuacaoVenda: corretorData.AtuacaoVenda,
          },
          create: {
            id: corretorData.Codigo,
            name: corretorData.Nome,
            email: corretorData.Email,
            telefone: corretorData.Celular,
            nomeAgencia: corretorData.Agencia,
            codigo: corretorData.Codigo,
            codigoAgencia: corretorData.CodigoAgencia,
            codigoEquipe: corretorData.CodigoEquipe,
            foto: corretorData.Foto,
            atuacaoLocacao: corretorData.AtuacaoLocacao,
            atuacaoVenda: corretorData.AtuacaoVenda,
            CRECI: corretorData.CRECI,
          },
        });
        corretorId = corretor.id;
      }

      // Upsert imóvel
      await prisma.imovel.upsert({
        where: { id: code },
        update: {
          ...restOfProperty,
          Cidade,
          ValorVenda: valorVendaInt,
          ValorLocacao: valorLocacaoInt,
          AreaTotal: areaTotalFloat,
          AreaUtil: areaUtilFloat,
          AreaTerreno: areaTerrenoFloat,
          DataHoraAtualizacao: validDataHoraAtualizacao,
          corretorId,
          fotos:
            photosToCreate.length > 0
              ? { deleteMany: {}, create: photosToCreate }
              : undefined,
          videos:
            VideosToCreate.length > 0
              ? { deleteMany: {}, create: VideosToCreate }
              : undefined,
          caracteristicas:
            characteristicsToCreate.length > 0
              ? { deleteMany: {}, create: characteristicsToCreate }
              : undefined,
          infraestrutura:
            infraToCreate.length > 0
              ? { deleteMany: {}, create: infraToCreate }
              : undefined,
        },
        create: {
          id: code,
          ...restOfProperty,
          Cidade,
          ValorVenda: valorVendaInt,
          ValorLocacao: valorLocacaoInt,
          AreaTotal: areaTotalFloat,
          AreaUtil: areaUtilFloat,
          AreaTerreno: areaTerrenoFloat,
          DataHoraAtualizacao: validDataHoraAtualizacao,
          corretorId,
          fotos: { create: photosToCreate },
          videos: {create : VideosToCreate},
          caracteristicas: { create: characteristicsToCreate },
          infraestrutura: { create: infraToCreate },
        },
      });
    }

    console.log(`Imóvel ${code} processado e upserted com sucesso.`);
  } catch (error: any) {
    console.error(`Erro ao processar imóvel ${code}:`, error.message);
  }
};

export async function POST() {
  try {
    // 1. Busca a primeira página para determinar o total de páginas
    const firstPageUrl: string = buildListingsUrl(1);
    console.log(firstPageUrl);
    const firstPageData: VistaApiResponse = await fetchData<VistaApiResponse>(
      firstPageUrl
    );
    const totalPages: number = Number(firstPageData.paginas) || 1;
    let allProperties: Record<string, any> = extractProperties(firstPageData);

    // 2. Busca concorrentemente os dados das páginas restantes
    const pagePromises: Promise<Record<string, any>>[] = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        fetchData<VistaApiResponse>(buildListingsUrl(page))
          .then((data) => extractProperties(data))
          .catch((err) => {
            console.warn(`Falha ao buscar página ${page}: ${err.message}`);
            return {};
          })
      );
    }

    // Aguarda todas as buscas de página serem concluídas e consolida os imóveis
    const results: Record<string, any>[] = await Promise.all(pagePromises);
    results.forEach((pageProperties) => {
      allProperties = { ...allProperties, ...pageProperties };
    });

    // ✨ AQUI ESTÁ A MUDANÇA PRINCIPAL PARA O CONTROLE DE CONCORRÊNCIA
    const CONCURRENCY_LIMIT = 5; // ✨ Ajuste este valor conforme a capacidade do seu DB
    const limit = pLimit(CONCURRENCY_LIMIT);

    console.log(
      `Iniciando processamento de ${
        Object.keys(allProperties).length
      } imóveis com limite de concorrência de ${CONCURRENCY_LIMIT}.`
    );

    const propertyProcessingPromises: PromiseSettledResult<void>[] =
      await Promise.allSettled(
        Object.entries(allProperties).map(
          ([code, property]) =>
            limit(() => processAndUpsertProperty(code, property)) // ✨ Usa 'limit' para envolver a função
        )
      );

    propertyProcessingPromises.forEach((result, index) => {
      const propertyCode = Object.keys(allProperties)[index];
      if (result.status === "rejected") {
        console.error(
          `A promessa para o imóvel ${propertyCode} foi rejeitada durante o processamento:`,
          result.reason
        );
      } else {
        // Você pode remover este console.log se quiser, já que processAndUpsertProperty já loga sucesso.
        // console.log(`Imóvel ${propertyCode} processado com sucesso.`);
      }
    });

    return NextResponse.json({
      message:
        "Sincronização de imóveis e detalhes concluída. Verifique os logs do servidor para o status de cada imóvel.",
      totalPropertiesAttempted: Object.keys(allProperties).length,
      successful: propertyProcessingPromises.filter(
        (p) => p.status === "fulfilled"
      ).length,
      failed: propertyProcessingPromises.filter((p) => p.status === "rejected")
        .length,
    });
  } catch (error: any) {
    console.error(
      "Erro crítico durante o processo de sincronização de imóveis:",
      error.message
    );
    return NextResponse.json(
      { error: "Erro interno do servidor durante a sincronização de imóveis" },
      { status: 500 }
    );
  } finally {
    // É importante desconectar o Prisma apenas quando todas as operações estão realmente concluídas.
    // O `Promise.allSettled` garante que todas as promessas foram resolvidas (sucesso ou falha).
    await prisma.$disconnect();
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const codigo = searchParams.get("codigo") || null;

    // --- Busca por código específico ---
    if (codigo) {
      const imovel = await prisma.imovel.findUnique({
        where: { id: codigo },
        include: {
          fotos: {
            select: {
              id: true,
              destaque: true,
              codigo: true,
              url: true,
              urlPequena: true,
            },
            orderBy: { id: "asc" },
          },
          caracteristicas: {
            select: { nome: true, valor: true },
          },
          infraestrutura: {
            select: { nome: true, valor: true },
          },
          corretor: true, // ✅ Inclui o corretor
          
        },
      });

      if (imovel) {
        return NextResponse.json({
          currentPage: 1,
          pageSize: 1,
          totalPages: 1,
          totalItems: 1,
          imoveis: [imovel],
        });
      } else {
        return NextResponse.json(
          {
            currentPage: 1,
            pageSize: 0,
            totalPages: 0,
            totalItems: 0,
            imoveis: [],
          },
          { status: 404 }
        );
      }
    }

    // --- Params gerais ---
    const action = searchParams.get("action") ?? "comprar";
    const tipos = searchParams.get("tipos")?.split(",").filter(Boolean) || [];
    const bairros =
      searchParams.get("bairro")?.split(",").filter(Boolean) || [];
    const cidade = searchParams.get("cidade") ?? "porto alegre";
    const valorMin = Number(searchParams.get("valorMin")) || null;
    const valorMax = Number(searchParams.get("valorMax")) || null;
    const quartos = searchParams.get("quartos") || null;
    const suites = searchParams.get("suites") || null;
    const vagas = searchParams.get("vagas") || null;
    const caracteristicas =
      searchParams.get("caracteristicas")?.split(",").filter(Boolean) || [];
    const lancamentosFilterValue = parseSimNao(searchParams.get("lancamentos"));
    const empreendimento = searchParams.get("empreendimento") || null;

    // --- Áreas ---
    const areaMin = Number(searchParams.get("areaMinima")) || null;
    const areaMax = Number(searchParams.get("areaMaxima")) || null;

    const sort = searchParams.get("sort") || "ImovelRecente";

    // --- Paginação ---
    const pageSize = Number(searchParams.get("pageSize")) || 12;
    const page = Number(searchParams.get("page")) || 1;
    const skip = (page - 1) * pageSize;

    // --- Campos dinâmicos ---
    const isAluguel = action.toLowerCase() === "alugar";
    const valorField = isAluguel ? "ValorLocacao" : "ValorVenda";

    // --- Filtros base ---
    const whereClause: any = {
      Status: isAluguel ? "ALUGUEL" : "VENDA",
    };
    if (empreendimento)
      whereClause.Empreendimento = {
        contains: empreendimento,
        mode: "insensitive",
      };
    if (cidade) whereClause.Cidade = { equals: cidade, mode: "insensitive" };
    if (
      bairros.length > 0 &&
      !(bairros.length === 1 && bairros[0].toLowerCase() === "all")
    ) {
      whereClause.Bairro = { in: bairros, mode: "insensitive" };
    }
    if (tipos.length > 0)
      whereClause.Categoria = { in: tipos, mode: "insensitive" };
    if (quartos) whereClause.Dormitorios = { gte: String(quartos) };
    if (suites) whereClause.Suites = { gte: String(suites) };
    if (vagas) whereClause.Vagas = { gte: String(vagas) };
    if (lancamentosFilterValue !== null)
      whereClause.Lancamento = {
        equals: lancamentosFilterValue,
        mode: "insensitive",
      };

    // --- Valor com margem de 5% ---
    if (valorMin !== null || valorMax !== null) {
      const min = valorMin ? valorMin * 0.95 : undefined;
      const max = valorMax ? valorMax * 1.05 : undefined;

      whereClause[valorField] = {
        ...(min !== undefined ? { gte: min } : {}),
        ...(max !== undefined ? { lte: max } : {}),
      };
    }

    // --- Área com margem de 5% ---
    // --- Área com margem de 5% ---
    if (areaMin !== null || areaMax !== null) {
      const min = areaMin ? areaMin * 0.95 : undefined;
      const max = areaMax ? areaMax * 1.05 : undefined;

      whereClause.OR = [
        {
          // Prioriza AreaTotal
          AreaUtil: {
            ...(min !== undefined ? { gte: min } : {}),
            ...(max !== undefined ? { lte: max } : {}),
          },
        }
      ];
    }

    // --- Características ---
    if (caracteristicas.length > 0) {
      whereClause.caracteristicas = {
        some: {
          AND: caracteristicas.map((carac) => ({
            nome: { equals: carac, mode: "insensitive" },
            valor: { equals: "sim", mode: "insensitive" },
          })),
        },
      };
    }

    whereClause.AND = [
      {
        OR: [
          { [valorField]: { gt: 0 } },
          { [valorField]: null },
          { [valorField]: 0 },
        ],
      },
    ];

    let sortByClause: any = {};
    switch (sort) {
      case "MaiorValor":
        sortByClause = [
          { [valorField]: { sort: "desc", nulls: "last" } },
          { DataHoraAtualizacao: "desc" },
        ];
        break;

      case "MenorValor":
        sortByClause = [
          { [valorField]: { sort: "asc", nulls: "last" } },
          { DataHoraAtualizacao: "desc" },
        ];
        break;

      case "ImovelRecente":
        sortByClause = [{ DataHoraAtualizacao: "desc" }];
        break;

      default:
        sortByClause = [
          { [valorField]: { sort: "asc", nulls: "last" } },
          { DataHoraAtualizacao: "desc" },
        ];
        break;
    }

    // --- Query ---
    const [imoveis, totalCount] = await prisma.$transaction([
      prisma.imovel.findMany({
        where: whereClause,
        orderBy: sortByClause,
        take: pageSize,
        skip: skip,
        include: {
          fotos: {
            select: {
              id: true,
              destaque: true,
              codigo: true,
              url: true,
              urlPequena: true,
            },
            orderBy: { id: "asc" },
          },
          caracteristicas: {
            select: { nome: true, valor: true },
          },
          infraestrutura: {
            select: { nome: true, valor: true },
          },
          corretor: true,
        },
      }),
      prisma.imovel.count({ where: whereClause }),
    ]);

    const totalPages = Math.ceil(totalCount / pageSize);

    return NextResponse.json({
      currentPage: page,
      pageSize: pageSize,
      totalPages: totalPages,
      totalItems: totalCount,
      imoveis: imoveis,
    });
  } catch (error: any) {
    console.error("Erro ao buscar imóveis:", error.message);
    return NextResponse.json(
      { error: "Erro interno no servidor ao buscar imóveis" },
      { status: 500 }
    );
  }
}

function parseSimNao(value: string | null): "Sim" | "Nao" | null {
  if (!value) return null;
  const normalized = value.toLowerCase().trim();
  if (["sim", "s", "true"].includes(normalized)) return "Sim";
  if (["nao", "n", "false"].includes(normalized)) return "Nao";
  return null;
}

export async function PUT() {
  try {
    // 1. Fetch first page to determine total pages
    const firstPageUrl: string = buildListingsUrl(1);
    const firstPageData: VistaApiResponse = await fetchData<VistaApiResponse>(
      firstPageUrl
    );
    const totalPages: number = Number(firstPageData.paginas) || 1;

    let allProperties: Record<string, any> = extractProperties(firstPageData);

    // 2. Fetch remaining pages concurrently
    const pagePromises: Promise<Record<string, any>>[] = [];
    for (let page = 2; page <= totalPages; page++) {
      pagePromises.push(
        fetchData<VistaApiResponse>(buildListingsUrl(page))
          .then((data) => extractProperties(data))
          .catch((err) => {
            console.warn(`Falha ao buscar página ${page}: ${err.message}`);
            return {};
          })
      );
    }

    const results: Record<string, any>[] = await Promise.all(pagePromises);
    results.forEach((pageProperties) => {
      allProperties = { ...allProperties, ...pageProperties };
    });

    const apiIds = Object.keys(allProperties).map((id) => String(id));

    // 3. Get all existing IDs from database
    const existingImoveis = await prisma.imovel.findMany({
      select: { id: true, DataHoraAtualizacao: true },
    });

    // 4. Concurrency limit
    const limit = pLimit(5);

    // 5. Add or update properties from API
    const upsertPromises = apiIds.map((code) =>
      limit(async () => {
        const property = allProperties[code];
        const existing = existingImoveis.find(
          (i) => String(i.id) === String(code)
        );

        const apiDate = property.DataHoraAtualizacao
          ? new Date(property.DataHoraAtualizacao).getTime()
          : 0;
        const dbDate = existing?.DataHoraAtualizacao
          ? new Date(existing.DataHoraAtualizacao).getTime()
          : 0;

        if (!existing || apiDate > dbDate) {
          await processAndUpsertProperty(code, property);
        }
      })
    );

    // 6. Delete properties not in API
    const deletePromises = existingImoveis
      .filter((i) => !apiIds.includes(String(i.id)))
      .map((i) => limit(() => prisma.imovel.delete({ where: { id: i.id } })));

    // 7. Wait for all operations
    const [upsertResults, deleteResults] = await Promise.all([
      Promise.allSettled(upsertPromises),
      Promise.allSettled(deletePromises),
    ]);

    return NextResponse.json({
      message: "Sincronização concluída.",
      addedOrUpdated: upsertResults.filter((r) => r.status === "fulfilled")
        .length,
      deleted: deleteResults.filter((r) => r.status === "fulfilled").length,
      failedUpserts: upsertResults.filter((r) => r.status === "rejected")
        .length,  
      failedDeletes: deleteResults.filter((r) => r.status === "rejected")
        .length,
    });
  } catch (error: any) {
    console.error("Erro ao sincronizar imóveis:", error.message);
    return NextResponse.json(
      { error: "Erro interno ao sincronizar imóveis" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function DELETE() {
  try {
    // 1. Deletar todas as Características
    // Isso deve ser feito antes de deletar os Imóveis se não houver onDelete: Cascade
    const deleteCaracteristicasResult = await prisma.caracteristica.deleteMany(
      {}
    );
    console.log(
      `Deletadas ${deleteCaracteristicasResult.count} características.`
    );

    // 2. Deletar todas as Fotos
    // Isso também deve ser feito antes de deletar os Imóveis se não houver onDelete: Cascade
    const deleteFotosResult = await prisma.foto.deleteMany({});
    console.log(`Deletadas ${deleteFotosResult.count} fotos.`);

    // 3. Deletar todos os Imóveis
    // Agora que as relações (filhos) foram deletadas, os Imóveis (pais) podem ser deletados
    const deleteImoveisResult = await prisma.imovel.deleteMany({});
    console.log(`Deletados ${deleteImoveisResult.count} imóveis.`);

    return NextResponse.json({
      message:
        "Todos os dados (características, fotos e imóveis) foram deletados com sucesso.",
      totalCaracteristicasDeleted: deleteCaracteristicasResult.count,
      totalFotosDeleted: deleteFotosResult.count,
      totalImoveisDeleted: deleteImoveisResult.count,
    });
  } catch (error: any) {
    console.error("Erro ao deletar todos os dados:", error);
    return NextResponse.json(
      {
        error: "Erro interno do servidor ao deletar todos os dados.",
        details: error.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect(); // Desconecta o Prisma Client após a operação
  }
}
