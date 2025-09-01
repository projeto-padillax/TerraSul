import { getAllSecoes } from '@/lib/actions/secoes'
import type { MetadataRoute } from 'next'
import { Imovel } from '@prisma/client'
import { getAllImoveisForSitemap } from '@/lib/actions/imovel'

function gerarSlug(str: string) {
  return encodeURIComponent(
    str
      .normalize("NFD")             // separa acentos
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
  );
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const secoes = await getAllSecoes()
  const imoveis = await getAllImoveisForSitemap()

  const secoesRoutes = secoes.map((secao) => ({
    url: secao.url,
    lastModified: new Date(),
    changeFrequency: 'yearly' as const,
    priority: 1,
  }))

  type ImovelSitemap = Pick<Imovel, "Categoria" | "Cidade" | "Finalidade" | "DataHoraAtualizacao">;

  // Mapear os imóveis para as rotas dinâmicas.
  const imoveisRoutes = imoveis.map((imovel: ImovelSitemap) => {
    // Definir a ação de compra ou aluguel.
    const action = imovel.Finalidade === 'Locação' ? 'alugar' : 'comprar'

    const categoriaSlug = imovel.Categoria ? gerarSlug(imovel.Categoria).toLowerCase() : "";
    const cidadeSlug = imovel.Cidade ? gerarSlug(imovel.Cidade) : "";

    // Função auxiliar para gerar query string XML-safe
    const buildQuery = (params: Record<string, string>) =>
      new URLSearchParams(params).toString().replace(/&/g, "&amp;");

    // Parâmetros básicos
    const baseParams: Record<string, string> = {
      action,
      page: "1",
    };

    const url = categoriaSlug
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/busca/${action}/${categoriaSlug}/${cidadeSlug}?${buildQuery(baseParams)}`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/busca/${action}/imoveis/${cidadeSlug}?${buildQuery(baseParams)}`;

    return {
      url,
      lastModified: imovel.DataHoraAtualizacao ?? new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }
  })

  return [...secoesRoutes, ...imoveisRoutes]
}