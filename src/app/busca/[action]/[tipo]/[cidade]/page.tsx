// app/busca/page.tsx (sem a pasta "[...parametros]")

import ImoveisPage from "@/components/site/imoveisPage";
import Header from "@/components/site/header";
import ClientLayout from "@/components/client-layout";
import Footer from "@/components/site/footer";
import { Filtros } from "@/utils/parseFilter";
import { capitalize } from "@/lib/utils";

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
    mobiliado?: string;
    codigo?: string;
    page?: string;
    sort?: string;
  }>;
}

const buildUrl = (filtros: Filtros) => {
  let titulo = "";

  // Tipos de imóvel - mostrar apenas o primeiro tipo
  let tipoTexto = "Imóveis";

 const primeiroTipo = filtros.tipo?.[0]?.split(",")?.map(t => t.trim())?.[0];
  if (primeiroTipo) {
    tipoTexto = capitalize(primeiroTipo);
  }

  // Tipo de ação
  const acaoTexto = filtros.action === "comprar" ? "à venda" : "para alugar";

  // Bairro (somente o primeiro se houver)
  let bairroTexto = "";
  if (filtros.bairro && filtros.bairro.length > 0) {
    const bairrosArray = filtros.bairro[0].split(",").map(b => b.trim()).filter(Boolean);
    if (bairrosArray.length >= 1) {
      bairroTexto = bairrosArray[0];
    }
  }

  // Cidade
  const cidadeTexto = filtros.cidade || "";

  // Título principal simplificado
  if (bairroTexto && cidadeTexto) {
    titulo = `${tipoTexto} ${acaoTexto} - ${bairroTexto} - ${cidadeTexto}`;
  } else if (cidadeTexto) {
    titulo = `${tipoTexto} ${acaoTexto} - ${cidadeTexto}`;
  } else {
    titulo = `${tipoTexto} ${acaoTexto}`;
  }

  // Informações adicionais (opcional)
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

  if (filtros.mobiliado === "sim") {
    titulo += `, mobiliado`;
  }

  if (filtros.codigo) {
    titulo += ` com código ${filtros.codigo}`;
  }

  if (filtros.valorMin || filtros.valorMax) {
    if (filtros.valorMin && filtros.valorMax) {
      titulo += `, entre R$ ${Number(filtros.valorMin).toLocaleString()} e R$ ${Number(filtros.valorMax).toLocaleString()}`;
    } else if (filtros.valorMin) {
      titulo += `, a partir de R$ ${Number(filtros.valorMin).toLocaleString()}`;
    } else if (filtros.valorMax) {
      titulo += `, até R$ ${Number(filtros.valorMax).toLocaleString()}`;
    }
  }

  return titulo;
};

// Função do Next.js para gerar metadata dinamicamente
export async function generateMetadata({ searchParams }: Props) {
  const awaitedSearchParams = await searchParams;

  const filtros: Filtros = {
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
    mobiliado: awaitedSearchParams.mobiliado || "",
    codigo: awaitedSearchParams.codigo || "",
    page: awaitedSearchParams.page || "1",
    sort: awaitedSearchParams.sort || "",
  };

  const titulo = buildUrl(filtros);

  return {
    title: titulo + " | TerraSul",
    description: `Lista de ${titulo}. Descubra milhares de ofertas com preços imperdíveis. Confira já!`,
  };
}

export default async function Imoveis({ searchParams }: Props) {
  // Use await para garantir que os searchParams estejam prontos
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
    mobiliado: awaitedSearchParams.mobiliado || "",
    codigo: awaitedSearchParams.codigo || "",
    page: awaitedSearchParams.page || "1",
    sort: awaitedSearchParams.sort || "",
  };

  return (
    <ClientLayout>
      <Header />
      <ImoveisPage filtros={initialFiltros}/>
      <Footer />
    </ClientLayout>
  );
}
