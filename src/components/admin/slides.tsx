"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import { AdminTable } from "@/components/admin/adminTable"
import { AdminHeader } from "@/components/admin/adminHeader"
import { useAdminListHandlers } from "@/hooks/adminHandlers"
import { useState } from "react"
import { Slides as SlideORM } from "@prisma/client";
import { ActionButtons } from "./actionButtons"
import { activateSlides, deactivateSlides, deleteSlides } from "@/lib/actions/slide"

interface Props {
  initialSlides: SlideORM[]
}

export default function SlidesListClient({ initialSlides }: Props) {
  const [slides, setSlides] = useState(initialSlides)

  const {
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleDelete,
    handleActivate,
    handleDeactivate
  } = useAdminListHandlers({
    items: slides,
    setItems: setSlides,
    itemNameSingular: "slide",
    routeBase: "/admin/slides",
    actions: {
      activate: activateSlides,
      deactivate: deactivateSlides,
      delete: deleteSlides
    }
  })

  return (
    <div>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Header Section */}
          <AdminHeader
            title="Slides na Home"
            subtitle="Gerencie os registros no Painel de Controle."
            totalLabel="Total de Slides"
            total={slides.length}
            ativosLabel="Slides Ativos"
            ativos={slides.filter((slide: SlideORM) => slide.status === true).length}
            selecionados={selectedIds.length}
          />
          <ActionButtons
            addButtonText="Novo Slide"
            addButtonHref="/admin/slides/novo"
            onAtivar={handleActivate}
            onDesativar={handleDeactivate}
            onExcluir={() => handleDelete()}
          />

          {/* Table */}
          <AdminTable
            data={slides}
            selectedIds={selectedIds}
            onSelect={handleSelectOne}
            onSelectAll={handleSelectAll}
            columns={[
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
              <Link href={`/admin/slides/${item.id}/edit`}>
                <Button variant="outline" size="sm" className="bg-transparent cursor-pointer hover:opacity-90">
                  <Edit className="h-4 w-4 mr-1" />
                  Editar
                </Button>
              </Link>
            )}
          />
        </div>
      </main >
    </div >
  )
}