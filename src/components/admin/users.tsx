"use client";

import { useAdminListHandlers } from "@/hooks/adminHandlers";
import { activateUsers, deactivateUsers, deleteUsers } from "@/lib/actions/users";
import { User as UserORM } from "@prisma/client";
import { useState } from "react";
import { AdminHeader } from "./adminHeader";
import { ActionButtons } from "./actionButtons";
import { UserTable } from "./usersTable";
import Link from "next/link";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";

interface Props {
    initialUsers: UserORM[];
}

export default function UsersListClient({ initialUsers }: Props) {
    const [users, setUsers] = useState(initialUsers);

    const {
        selectedIds,
        handleSelectAll,
        handleSelectOne,
        handleDelete,
        handleActivate,
        handleDeactivate,
    } = useAdminListHandlers({
        items: users,
        setItems: setUsers,
        itemNameSingular: "user",
        routeBase: "//admin/usuarios",
        actions: {
            activate: activateUsers,
            deactivate: deactivateUsers,
            delete: deleteUsers,
        },
    });

    return (
        <div>
            <main className="py-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    {/* Header Section */}
                    <AdminHeader
                        title="Users"
                        subtitle="Gerencie os registros no Painel de Controle."
                        totalLabel="Total de Users"
                        total={users.length}
                        ativosLabel="Users Ativos"
                        ativos={
                            users.filter((user: UserORM) => user.status === true)
                                .length
                        }
                        selecionados={selectedIds.length}
                    />

                    <ActionButtons
                        addButtonText="Novo User"
                        addButtonHref="/admin/usuarios/novo"
                        onAtivar={handleActivate}
                        onDesativar={handleDeactivate}
                        onExcluir={() => handleDelete()}
                    />

                    <UserTable
                        type="usuario"
                        data={users}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelect={handleSelectOne}
                        renderActions={(item) => (
                            <Link href={`/admin/usuarios/${item.id}/edit`}>
                                <Button variant="outline" size="sm" className="bg-transparent cursor-pointer hover:opacity-90">
                                    <Edit className="h-4 w-4 mr-1" />
                                    Editar
                                </Button>
                            </Link>
                        )}
                    />
                </div>
            </main>
        </div>
    );
}
