// app/busca/page.tsx

import ImoveisPage from "@/components/site/imoveisPage";
import Header from "@/components/site/header";
import ClientLayout from "@/components/client-layout";
import Footer from "@/components/site/footer";
import { Filtros } from "@/utils/parseFilter";
import ScrollHandler from "@/components/site/scrollHandler";
import { capitalizePt, formatIntPtBR } from "@/utils/format";
import type { Metadata } from "next";

// --- helpers de título/canonical/keywords (sem alterar CSS/markup) ---
const buildUrl = (filtros: Filtros) => {
  let titulo = "";

  let tipoTexto = "Imoveis";
  const primeiroTipo = filtros.tipo?.[0]?.split(",")?.map(t => t.trim())?.[0];
  if (primeiroTipo) {
    tipoTexto = capitalizePt(primeiroTipo);
  }

  const acaoTexto = filtros.action === "comprar" ? "à venda" : "para alugar";

  let bairroTexto = "";
  if (filtros.bairro && filtros.bairro.length > 0) {
    const bairrosArray = filtros.bairro[0].split(",").map(b => b.trim()).filter(Boolean);
    if (bairrosArray.length >= 1) {
      bairroTexto = bairrosArray[0];
    }
  }

  const cidadeTexto = filtros.cidade || "";

  if (bairroTexto && cidadeTexto) {
    titulo = `${tipoTexto} ${acaoTexto} - ${bairroTexto} - ${cidadeTexto}`;
  } else if (cidadeTexto) {
    titulo = `${tipoTexto} ${acaoTexto} - ${cidadeTexto}`;
  } else {
    titulo = `${tipoTexto} ${acaoTexto}`;
  }

  if (filtros.quartos) {
    titulo += `, com ${filtros.quartos}+ quarto${filtros.quartos !== "1" ? "s" : ""}`;
  }
  if (filtros.suites) {
    titulo += `, com ${filtros.suites}+ suíte${filtros.suites !== "1" ? "s" : ""}`;
  }
  if (filtros.vagas) {
    titulo += `, com ${filtros.vagas}+ vaga${filtros.vagas !== "1" ? "s" : ""}`;
  }
  if (filtros.areaMinima) {
    titulo += `, com área mínima de ${filtros.areaMinima}m²`;
  }
  if ((filtros.caracteristicas || []).length > 0) {
    titulo += `, com ${filtros.caracteristicas!.join(", ")}`;
  }
  if (filtros.lancamentos === "s") {
    titulo += `, lançamento`;
  }
  if (filtros.codigo) {
    titulo += ` com código ${filtros.codigo}`;
  }
  if (filtros.valorMin || filtros.valorMax) {
    if (filtros.valorMin && filtros.valorMax) {
      titulo += `, entre R$ ${formatIntPtBR(Number(filtros.valorMin))} e R$ ${formatIntPtBR(Number(filtros.valorMax))}`;
    } else if (filtros.valorMin) {
      titulo += `, a partir de R$ ${formatIntPtBR(Number(filtros.valorMin))}`;
    } else if (filtros.valorMax) {
      titulo += `, até R$ ${formatIntPtBR(Number(filtros.valorMax))}`;
    }
  }

  return titulo.trim();
};

const canonicalFrom = (f: Filtros) => {
  // Ordena/normaliza para evitar canônicas diferentes com mesma intenção.
  const params = new URLSearchParams();
  if (f.action) params.set("action", f.action);
  if (f.tipo?.length) params.set("tipos", f.tipo.join("_"));
  if (f.cidade) params.set("cidade", f.cidade);
  if (f.bairro?.length) params.set("bairro", f.bairro.join("_"));
  if (f.valorMin) params.set("valorMin", f.valorMin);
  if (f.valorMax) params.set("valorMax", f.valorMax);
  if (f.quartos) params.set("quartos", f.quartos);
  if (f.areaMinima) params.set("areaMinima", f.areaMinima);
  if (f.suites) params.set("suites", f.suites);
  if (f.vagas) params.set("vagas", f.vagas);
  if (f.caracteristicas?.length) params.set("caracteristicas", f.caracteristicas.join("_"));
  if (f.lancamentos) params.set("lancamentos", f.lancamentos);
  if (f.codigo) params.set("codigo", f.codigo);
  if (f.sort) params.set("sort", f.sort);
  if (f.empreendimento) params.set("empreendimento", f.empreendimento);
  // Inclui paginação na canonical para evitar conteúdos “idênticos” com URLs diferentes.
  if (f.page) params.set("page", f.page);

  const qs = params.toString();
  return qs ? `/busca?${qs}` : `/busca`;
};

const buildKeywords = (f: Filtros) => {
  const base = [
    "imóveis", "imobiliária", "comprar imóvel", "alugar imóvel", "apartamento", "casa", "lançamento",
  ];
  const extras = [
    f.cidade, ...(f.bairro || []),
    ...(f.tipo || []).flatMap(t => t.split(",").map(s => s.trim())),
  ].filter(Boolean) as string[];

  // dedup/limpa
  const set = new Set<string>([...base, ...extras].map(k => k.toLowerCase()));
  return Array.from(set);
};

// --- types ---
interface Props {
  searchParams: Promise<{
    action?: string;
    tipos?: string;
    cidade?: string;
    bairro?: string;
    valorMin?: string;
    valorMax?: string;
    quartos?: string;
    areaMinima?: string;
    suites?: string;
    vagas?: string;
    caracteristicas?: string;
    lancamentos?: string;
    codigo?: string;
    page?: string;
    sort?: string;
    empreendimento?: string;
  }>;
}

// helpers
const canonicalFromRaw = (q: Record<string, string | undefined>) => {
  const params = new URLSearchParams();
  const keys = [
    "action","tipos","cidade","bairro","valorMin","valorMax",
    "quartos","areaMinima","suites","vagas","caracteristicas",
    "lancamentos","codigo","sort","empreendimento","page",
  ];

  for (const k of keys) {
    const v = q[k];
    if (!v) continue;
    if (k === "page" && v === "1") continue; // não canonicar page=1
    params.set(k, v);
  }

  const qs = params.toString();
  return qs ? `/busca?${qs}` : `/busca`;
};

// metadata
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const q = await searchParams;

  // monta filtros como antes (para title/description)
  const filtros: Filtros = {
    action: q.action ?? "comprar",
    tipo: q.tipos ? q.tipos.split("_") : [],
    cidade: q.cidade || "porto alegre",
    bairro: q.bairro?.split("_") || [],
    valorMin: q.valorMin || "",
    valorMax: q.valorMax || "",
    quartos: q.quartos || "",
    areaMinima: q.areaMinima || "",
    suites: q.suites || "",
    vagas: q.vagas || "",
    caracteristicas: q.caracteristicas ? q.caracteristicas.split("_") : [],
    lancamentos: q.lancamentos || "",
    codigo: q.codigo || "",
    page: q.page || "1",
    sort: q.sort || "",
    empreendimento: q.empreendimento || "",
  };

  const tituloBase = buildUrl(filtros);
  const title = `${tituloBase} | TerraSul`;
  const description = `Lista de ${tituloBase}. Explore ofertas atualizadas com filtros por preço, quartos, vagas e localização.`;
  const canonical = canonicalFromRaw(q); // << usa a query bruta, sem defaults

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { type: "website", url: canonical, title, description },
    twitter: { card: "summary", title, description },
    robots: { index: true, follow: true },
  };
}

export default async function Imoveis({ searchParams }: Props) {
  const awaitedSearchParams = await searchParams;

  const initialFiltros: Filtros = {
    action: awaitedSearchParams.action ?? "comprar",
    tipo: awaitedSearchParams.tipos ? awaitedSearchParams.tipos.split("_") : [],
    cidade: awaitedSearchParams.cidade || "porto alegre",
    bairro: awaitedSearchParams.bairro?.split("_") || [],
    valorMin: awaitedSearchParams.valorMin || "",
    valorMax: awaitedSearchParams.valorMax || "",
    quartos: awaitedSearchParams.quartos || "",
    areaMinima: awaitedSearchParams.areaMinima || "",
    suites: awaitedSearchParams.suites || "",
    vagas: awaitedSearchParams.vagas || "",
    caracteristicas: awaitedSearchParams.caracteristicas
      ? awaitedSearchParams.caracteristicas.split("_")
      : [],
    lancamentos: awaitedSearchParams.lancamentos || "",
    codigo: awaitedSearchParams.codigo || "",
    page: awaitedSearchParams.page || "1",
    sort: awaitedSearchParams.sort || "",
    empreendimento: awaitedSearchParams.empreendimento || ""
  };

  const tituloH1 = buildUrl(initialFiltros);

  return (
    <ClientLayout>
      <Header />
      <main>
        {/* Mantém layout. H1 sr-only para acessibilidade/SEO sem alterar UI */}
        <h1 className="sr-only">{tituloH1}</h1>
        <ImoveisPage filtros={initialFiltros} />
      </main>
      <ScrollHandler />
      <Footer />
    </ClientLayout>
  );
}
