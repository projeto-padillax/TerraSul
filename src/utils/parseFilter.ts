// utils/parseFiltros.ts
export interface Filtros {
  action?: string;
  tipo?: string[];
  cidade?: string;
  bairro?: string[];
  valorMin?: string;
  valorMax?: string;
  quartos?: string;
  areaMinima?: string;
  suites?: string;
  vagas?: string;
  caracteristicas?: string[];
  lancamentos?: string;
  mobiliado?: string;
  page?: string;
  codigo?: string;
  sort?: string;
}

export function parseFiltros(filtros: string[]): Filtros {
  const parsed: Filtros = {};
  parsed.action = filtros[0];
  for (const filtro of filtros) {
    if (filtro.startsWith("tipos-")) parsed.tipo = filtro.slice(6).split("_").map((t) => decodeURIComponent(t));
    else if (filtro.startsWith("cidade-")) {
      const parseFiltro = parseFiltroURL(filtro);
      const [cidade, bairros] = parseFiltro.split(":");
      parsed.cidade = cidade;
      parsed.bairro = bairros?.split("_") || [];
    } else if (filtro.startsWith("valorMin-"))
      parsed.valorMin = filtro.slice(9);
    else if (filtro.startsWith("valorMax-")) parsed.valorMax = filtro.slice(9);
    else if (filtro.startsWith("quartos-")) parsed.quartos = filtro.slice(8);
    else if (filtro.startsWith("areaMinima-"))
      parsed.areaMinima = filtro.slice(11);
    else if (filtro.startsWith("suites-")) parsed.suites = filtro.slice(7);
    else if (filtro.startsWith("vagas-")) parsed.vagas = filtro.slice(6);
    else if (filtro.startsWith("caracteristicas-"))
      parsed.caracteristicas = filtro.slice(16).split("_");
    else if (filtro.startsWith("lançamentos-"))
      parsed.lancamentos = filtro.slice(12);
    else if (filtro.startsWith("mobiliado-"))
      parsed.mobiliado = filtro.slice(10);
    else if (filtro.startsWith("codigo-"))
      parsed.codigo = filtro.slice(7);
    else if (filtro.startsWith("order-"))
      parsed.sort = filtro.slice(6);
    else parsed.page = filtro;
  }

  return parsed;
}

export function parseFiltroURL(param: string) {
  const decoded = decodeURIComponent(param);
  const cidadesNome = decoded.replace("cidade-", "");
  const partes = cidadesNome.split("_");

  const mapa = new Map<string, string[]>();

  for (const parte of partes) {
    const [cidade, bairro] = parte.split(":");
    if (!cidade || !bairro) continue;

    const cidadeKey = cidade.toLowerCase();
    const bairroFormatado = bairro.toLowerCase();

    if (!mapa.has(cidadeKey)) {
      mapa.set(cidadeKey, []);
    }
    mapa.get(cidadeKey)?.push(bairroFormatado);
  }

  const resultado = Array.from(mapa.entries())
    .map(([cidade, bairros]) => `${cidade}:${bairros.join("_")}`)
    .join("_");

  return resultado;
}
