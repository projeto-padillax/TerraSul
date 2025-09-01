import LinksListClient from "@/components/admin/links";
import { getAllMaisAcessados } from "@/lib/actions/maisAcessado";

export default async function BannersListPage() {
  const links = await getAllMaisAcessados();

  return <LinksListClient initialLinks={links} />
}
