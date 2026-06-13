// src/utils/format.ts
export const formatIntPtBR = (n: number) =>
  Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const formatBRL0 = (n: number) => `R$ ${formatIntPtBR(n)}`;

// Formata números com ponto como separador de milhar (pt-BR), preservando decimais.
// Ex.: 1234 -> "1.234", 1234.5 -> "1.234,5"
export const formatNumberPtBR = (n: number) =>
  new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 }).format(n);

export const lower = (s: string) => s.toLowerCase(); // sem locale
export const capitalizePt = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;

// Normaliza categoria: remove acento e caixa (ex.: "Sítio" -> "sitio")
const normalizeCategoria = (categoria?: string | null) =>
  (categoria ?? "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();

// Detecta imóveis do tipo "sítio" (ex.: "Sítio", "Sitio/Rural")
export const isSitio = (categoria?: string | null) =>
  normalizeCategoria(categoria).includes("sitio");

// Detecta "casa em condomínio" (ex.: "Casa em Condomínio", "Casa de Condomínio")
export const isCasaCondominio = (categoria?: string | null) => {
  const c = normalizeCategoria(categoria);
  return c.includes("casa") && c.includes("condominio");
};

// Tipos cujo terreno deve vir de AreaTotal (não de AreaTerreno)
export const usaAreaTotalComoTerreno = (categoria?: string | null) =>
  isSitio(categoria) || isCasaCondominio(categoria);
