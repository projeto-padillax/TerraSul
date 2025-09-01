import FormulariosListClient from "@/components/admin/formulariosList";
import { getAllFormularios } from "@/lib/actions/formularios";

export default async function LeadsListPage() {
  const leads = await getAllFormularios();

  return <FormulariosListClient initialFormularios={leads} />
}