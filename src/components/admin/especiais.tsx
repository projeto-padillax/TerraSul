"use client";

import { ImoveisCorretor as ImoveisCorretorORM } from "@prisma/client";
import { AdminHeader } from "./adminHeader";
import { useAdminListHandlers } from "@/hooks/adminHandlers";
import { useState } from "react";
import { ActionButtons } from "./actionButtons";
import { activateEspeciais, deactivateEspeciais, deleteEspeciais } from "@/lib/actions/especiais";
import { Edit } from "lucide-react";
import { Button } from "../ui/button";
import { EspecialTable } from "./especialTable";
import Link from "next/link";


interface Props {
    initialEspeciais: ImoveisCorretorORM[];
}

export default function EspeciaisListClient({ initialEspeciais }: Props) {
    const [especiais, setEspeciais] = useState(initialEspeciais);

    const {
        selectedIds,
        handleSelectAll,
        handleSelectOne,
        handleDelete,
        handleActivate,
        handleDeactivate,
    } = useAdminListHandlers({
        items: especiais,
        setItems: setEspeciais,
        itemNameSingular: "banner",
        routeBase: "/admin/especiais",
        actions: {
            activate: activateEspeciais,
            deactivate: deactivateEspeciais,
            delete: deleteEspeciais,
        },
    });

    return (
        <div>
            <main className="py-12">
                <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
                    {/* Header Section */}
                    <AdminHeader
                        title="Seleção Especial de Imóveis"
                        subtitle="Gerencie as seleções especiais no sistema de administração."
                        totalLabel="Total de Seleção Especial de Imóveis"
                        total={especiais.length}
                        ativosLabel="Seleção Especial de Imóveis Ativos"
                        ativos={
                            especiais.filter((especial: ImoveisCorretorORM) => especial.status === true)
                                .length
                        }
                        selecionados={selectedIds.length}
                    />

                    <ActionButtons
                        addButtonText="Nova Seleção"
                        addButtonHref="/admin/especiais/novo"
                        onAtivar={handleActivate}
                        onDesativar={handleDeactivate}
                        onExcluir={() => handleDelete()}
                    />
                    
                    <EspecialTable
                        data={especiais}
                        selectedIds={selectedIds}
                        onSelectAll={handleSelectAll}
                        onSelect={handleSelectOne}
                        renderActions={(item) => (
                            <Link href={`/admin/especiais/${item.id}/edit`}>
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
