import { notFound } from "next/navigation";
import { findCorretor } from "@/lib/actions/corretores";
import CorretorForm from "@/components/admin/corretorForm";

export default async function EditCorretorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const corretor = await findCorretor(id);

  if (!corretor) return notFound();

  return (
    <CorretorForm corretor={corretor} />
  );
}