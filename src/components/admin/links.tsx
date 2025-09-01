"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { AdminTable } from "@/components/admin/adminTable";
import { AdminHeader } from "@/components/admin/adminHeader";
import { useAdminListHandlers } from "@/hooks/adminHandlers";
import { useState } from "react";
import { MaisAcessado as MaisAcessadosORM } from "@prisma/client";
import { ActionButtons } from "./actionButtons";
import { activateMaisAcessados, deactivateMaisAcessados, deleteMaisAcessados } from "@/lib/actions/links";

interface Props {
  initialLinks: MaisAcessadosORM[];
}

export default function LinksListClient({ initialLinks }: Props) {
  const [links, setLinks] = useState(initialLinks);

  const {
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleDelete,
    handleActivate,
    handleDeactivate,
  } = useAdminListHandlers({
    items: links,
    setItems: setLinks,
    itemNameSingular: "banner",
    routeBase: "/admin/banners",
    actions: {
      activate: activateMaisAcessados,
      deactivate: deactivateMaisAcessados,
      delete: deleteMaisAcessados,
    },
  });

  return (
    <div>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Header Section */}
          <AdminHeader
            title="Links Mais Acessados"
            subtitle="Gerencie os registros no Painel de Controle."
            totalLabel="Total de Links mais acessados"
            total={links.length}
            ativosLabel="Links mais acessados Ativos"
            ativos={
              links.filter((links: MaisAcessadosORM) => links.status === true)
                .length
            }
            selecionados={selectedIds.length}
          />
          <ActionButtons
            addButtonText="Novo Link"
            addButtonHref="/admin/links/novo"
            onAtivar={handleActivate}
            onDesativar={handleDeactivate}
            onExcluir={() => handleDelete()}
          />

          {/* Table */}
          <AdminTable
            data={links}
            selectedIds={selectedIds}
            onSelect={handleSelectOne}
            onSelectAll={handleSelectAll}
            columns={[]}
            renderActions={(item) => (
              <Link href={`/admin/links/${item.id}/edit`}>
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
