"use client";

import { useState } from "react";
import Link from "next/link";
import { Edit } from "lucide-react";
import { Chamadas as ChamadasORM } from "@prisma/client";
import { Button } from "@/components/ui/button";
import { AdminTable } from "@/components/admin/adminTable";
import { AdminHeader } from "@/components/admin/adminHeader";
import { useAdminListHandlers } from "@/hooks/adminHandlers";
import { ActionButtons } from "./actionButtons";
import { activateChamadas, deactivateChamadas, deleteChamadas } from "@/lib/actions/chamada"

interface Props {
  initialChamadas: ChamadasORM[];
}

export default function ChamadasListClient({ initialChamadas }: Props) {
  const [chamadas, setChamadas] = useState(initialChamadas);

  const {
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleDelete,
    handleActivate,
    handleDeactivate,
  } = useAdminListHandlers({
    items: chamadas,
    setItems: setChamadas,
    itemNameSingular: "chamada",
    routeBase: "/admin/chamadas",
    actions: {
      activate: activateChamadas,
      deactivate: deactivateChamadas,
      delete: deleteChamadas,
    },
  });

  return (
    <div>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Header Section */}
          <AdminHeader
            title="Chamadas na Home"
            subtitle="Gerencie as chamadas no sistema de administração."
            totalLabel="Total de Chamadas"
            total={chamadas.length}
            ativosLabel="Chamadas Ativas"
            ativos={
              chamadas.filter((banner: ChamadasORM) => banner.status === true)
                .length
            }
            selecionados={selectedIds.length}
          />
          <ActionButtons
            addButtonText="Nova Chamada"
            addButtonHref="/admin/chamadas/novo"
            onAtivar={handleActivate}
            onDesativar={handleDeactivate}
            onExcluir={() => handleDelete()}
          />

          {/* Table */}
          <AdminTable
            data={chamadas}
            selectedIds={selectedIds}
            onSelect={handleSelectOne}
            onSelectAll={handleSelectAll}
            columns={[
              {
                header: "Subtítulo",
                accessor: "subtitle",
                cell: (item) => (
                  <span className="text-gray-700 text-base">
                    {item.subtitulo}
                  </span>
                ),
              },
                            {
                header: "Ordem",
                accessor: "ordem",
                cell: (item) => <span className="text-gray-700 text-base">{item.ordem}</span>
              },
              {
                header: "Data",
                accessor: "date",
                cell: (item) => {
                  const date = new Date(item.createdAt);
                  const formattedDate = date.toLocaleDateString("pt-BR");
                  const formattedTime = date.toLocaleTimeString("pt-BR", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  return (
                    <span className="text-gray-600 text-sm">
                      {`${formattedDate} ${formattedTime}`}
                    </span>
                  );
                },
              },
            ]}
            renderActions={(item) => (
              <Link href={`/admin/chamadas/${item.id}/edit`}>
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
