import { getAllCorretores } from "@/lib/actions/corretores";
import CorretoresListClient from "@/components/admin/corretores";

export default async function CorretorListPage() {
  const corretores = await getAllCorretores();

  return <CorretoresListClient initialCorretores={corretores} />
}
