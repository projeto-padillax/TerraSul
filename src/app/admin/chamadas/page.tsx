import { getAllChamadas } from "@/lib/actions/chamada"
import ChamadasListClient from "@/components/admin/chamadas";

export default async function ChamadasListPage() {
  const chamadas = await getAllChamadas();

  return <ChamadasListClient initialChamadas={chamadas} />
}