import EspeciaisListClient from "@/components/admin/especiais";
import { getAllEspeciais } from "@/lib/actions/especiais";

export default async function EspeciaisListPage() {
  const especiais = await getAllEspeciais();

  return <EspeciaisListClient initialEspeciais={especiais} />
}