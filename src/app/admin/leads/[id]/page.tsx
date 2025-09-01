import { notFound } from "next/navigation";
import { findFormulario, FormularioPlain } from "@/lib/actions/formularios";
import FormularioView from "@/components/admin/formularioView";

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lead = await findFormulario(id);

  if (!lead) return notFound();

  const leadPlain: FormularioPlain = {
    ...lead,
    dataEnvio: lead.dataEnvio.toISOString(),
    DataVisita: lead.DataVisita ? lead.DataVisita.toISOString() : null,
    valorDesejado: lead.valorDesejado ? Number(lead.valorDesejado) : null,
  };

  return <FormularioView lead={leadPlain} />;
}
