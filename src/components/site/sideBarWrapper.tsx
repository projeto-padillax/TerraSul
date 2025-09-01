import { getAllActivesPaginasConteudo } from "@/lib/actions/contentPages";
import Sidebar from "./sidebar"; // seu componente client

export default async function SidebarWrapper() {
  const items = await getAllActivesPaginasConteudo();

  return <Sidebar dynamicItems={items} />;
}
