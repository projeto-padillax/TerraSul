"use client";

import { useAdminListHandlers } from "@/hooks/adminHandlers";
import { activateCorretores, deactivateCorretores, deleteCorretores } from "@/lib/actions/corretores";
import { Corretor as CorretorORM } from "@prisma/client";
import { useState } from "react";
import { AdminHeader } from "./adminHeader";
import { ActionButtons } from "./actionButtons";
import { UserTable } from "./usersTable";
import Link from "next/link";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";

interface Props {
    initialCorretores: CorretorORM[];
}

export default function CorretoresListClient({ initialCorretores }: Props) {
    const [corretores, setCorretores] = useState(initialCorretores);

    const {
        selectedIds,
        handleSelectAll,
        handleSelectOne,
        handleDelete,
        handleActivate,
        handleDeactivate,
    } = useAdminListHandlers({
        items: corretores,
        setItems: setCorretores,
        itemNameSingular: "banner",
        routeBase: "/admin/corretores",
        actions: {
            activate: activateCorretores,
            deactivate: deactivateCorretores,
            delete: deleteCorretores,
        },
    });

    return (
        <div>
            <main className="py-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    {/* Header Section */}
                    <AdminHeader
                        title="Corretores"
                        subtitle="Gerencie os registros no Painel de Controle."
                        totalLabel="Total de Corretores"
                        total={corretores.length}
                        ativosLabel="Corretores Ativos"
                        ativos={
                            corretores.filter((corretor: CorretorORM) => corretor.status === true)
                                .length
                        }
                        selecionados={selectedIds.length}
                    />

                    <ActionButtons
                        addButtonText="Novo Corretor"
                        addButtonHref="/admin/corretores/novo"
                        onAtivar={handleActivate}
                        onDesativar={handleDeactivate}
                        onExcluir={() => handleDelete()}
                    />

                    <UserTable
                        type="corretor"
                        data={corretores}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelect={handleSelectOne}
                        renderActions={(item) => (
                            <Link href={`/admin/corretores/${item.id}/edit`}>
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
