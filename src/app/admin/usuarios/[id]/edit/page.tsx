import { notFound } from "next/navigation";
import { findUser } from "@/lib/actions/users";
import UserForm from "@/components/admin/userForm";

export default async function EditUserPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const user = await findUser(id);

  if (!user) return notFound();

  return (
    <UserForm user={user} />
  );
}