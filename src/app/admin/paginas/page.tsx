import PaginaConteudo from "@/components/admin/paginaConteudo";
import { getAllPaginasConteudo } from "@/lib/actions/contentPages";

export default async function BannersListPage() {
  const paginas = await getAllPaginasConteudo();

  return <PaginaConteudo initialContentPages={paginas} />
}
