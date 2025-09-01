import { notFound } from "next/navigation";
import { findEspecial } from "@/lib/actions/especiais";
import { getCorretoresAtivosParaSelect } from "@/lib/actions/corretores";
import EspecialForm from "@/components/admin/especialForm";

interface EditEspecialPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditEspecialPage({
  params,
}: EditEspecialPageProps) {
  const especialId = (await params).id;

  const especial = await findEspecial(especialId);

  if (!especial) return notFound();

  const corretores = await getCorretoresAtivosParaSelect();

  return <EspecialForm especial={especial} corretores={corretores} />;
}
