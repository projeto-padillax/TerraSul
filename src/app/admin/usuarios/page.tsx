import UsersListClient from "@/components/admin/users";
import { getAllUsers } from "@/lib/actions/users";

export default async function UserListPage() {
  const users = await getAllUsers();

  return <UsersListClient initialUsers={users} />
}