"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Edit, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { AdminHeader } from "@/components/admin/adminHeader";
import { useEffect, useState } from "react";
import { PaginasConteudo } from "@prisma/client";
import { ActionButtons } from "./actionButtons";

import {
  activatePaginas,
  deactivatePaginas,
  deletePaginas,
} from "@/lib/actions/contentPages";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { useAdminListHandlers } from "@/hooks/adminHandlers";

interface tableColumns {
  id: number;
  titulo: string;
  url: string;
  ordem: number;
  tipo: string;
  isOnMenu: boolean;
  data: Date;
  status: boolean;
}

interface Props {
  initialContentPages: PaginasConteudo[];
}

export default function PaginaConteudo({ initialContentPages }: Props) {
  const [pages, setPages] = useState(initialContentPages);
  const [rows, setRows] = useState<tableColumns[]>([]);

  const {
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleDelete,
    handleActivate,
    handleDeactivate,
  } = useAdminListHandlers({
    items: pages,
    setItems: setPages,
    itemNameSingular: "Pagina de Conteúdo",
    routeBase: "/admin/paginas",
    actions: {
      activate: activatePaginas,
      deactivate: deactivatePaginas,
      delete: deletePaginas,
    },
  });

  useEffect(() => {
    const combinedData = [...pages].map((item) => ({
      id: item.id,
      titulo: item.titulo,
      url: item.url ?? formatPageUrl(item.titulo),
      ordem: item.ordem,
      tipo: item.tipo,
      isOnMenu: item.isOnMenu,
      data: item.createdAt,
      status: item.status,
    }));

    setRows(combinedData);
  }, [pages]);

  function formatPageUrl(titulo: string) {
    return `pagina/${encodeURIComponent(titulo.toLowerCase())}`;
  }

  const formattedDate = (date: Date) => {
    const newdDte = new Date(date);
    return newdDte.toLocaleDateString("pt-BR");
  };

  const formattedTime = (date: Date) => {
    const newdDte = new Date(date);
    return newdDte.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  return (
    <div>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          {/* Header Section */}
          <AdminHeader
            title="Conteúdos na Home"
            subtitle="Gerencie os registros no Painel de Controle."
            totalLabel="Total de conteúdos"
            total={pages.length}
            ativosLabel="Conteúdos Ativos"
            ativos={
              pages.filter((pages: PaginasConteudo) => pages.status === true)
                .length
            }
            selecionados={selectedIds.length}
          />
          <ActionButtons
            addButtonText="Novo conteúdo"
            addButtonHref="/admin/paginas/novo"
            onAtivar={handleActivate}
            onDesativar={handleDeactivate}
            onExcluir={() => handleDelete()}
          />

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 border-b border-gray-200">
                  <TableHead className="w-16 py-5 text-center">
                    <Checkbox
                      checked={
                        selectedIds.length === pages.length && pages.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      className="scale-110 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                    />
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                    Título
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                    URL
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                    Ordem
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                    Tipo
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                    Exibir no Menu
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                    Data
                  </TableHead>
                  <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                    Status
                  </TableHead>

                  <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((item, index) => (
                  <TableRow
                    key={item.id}
                    className={`hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                    }`}
                  >
                    <TableCell className="py-5 text-center">
                      <Checkbox
                        checked={selectedIds.includes(item.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOne(item.id, checked as boolean)
                        }
                        className="scale-110 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                      />
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <span className="text-gray-900 font-medium text-base">
                        {item.titulo}
                      </span>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-medium text-base bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors duration-200"
                      >
                        Abrir URL
                        <ExternalLink className="h-3.5 w-3.5" />
                      </a>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <span className="text-gray-900 font-medium text-base">
                        {item.ordem}
                      </span>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <span className="text-gray-900 font-medium text-base">
                        {item.tipo}
                      </span>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <span className="text-gray-900 font-medium text-base">
                        {item.isOnMenu ? "Sim" : "Não"}
                      </span>
                    </TableCell>
                    <TableCell className="py-5 text-center">
                      <span className="text-gray-900 font-medium text-base">
                        {`${formattedDate(item.data)} ${formattedTime(
                          item.data,
                        )}`}
                      </span>
                    </TableCell>
                    <TableCell className="text-center py-5">
                      <Badge
                        variant={item.status ? "default" : "secondary"}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${
                          item.status
                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                        }`}
                      >
                        {item.status ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>

                    <TableCell className="text-center">
                      <Link href={`/admin/paginas/${item.id}/edit`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Editar
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </main>
    </div>
  );
}
