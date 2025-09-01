"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"
import React from "react"
import { Banners, Chamadas, Slides, MaisAcessado } from "@prisma/client"

interface Column<T> {
    header: string
    accessor: string
    cell: (item: T) => React.ReactNode
}

interface AdminTableProps<T> {
    data: T[]
    selectedIds: number[]
    onSelectAll: (checked: boolean) => void
    onSelect: (id: number, checked: boolean) => void
    columns?: Column<T>[]
    renderActions: (item: T) => React.ReactNode
    showStatus?: boolean
}

export function AdminTable<T extends Banners | Slides | Chamadas | MaisAcessado>(
    props: AdminTableProps<T>
) {
    const {
        data,
        selectedIds,
        onSelectAll,
        onSelect,
        columns = [],
        renderActions,
        showStatus = true
    } = props

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-gray-50 border-b border-gray-200">
                        <TableHead className="w-16 py-5 text-center">
                            <Checkbox
                                checked={selectedIds.length === data.length && data.length > 0}
                                onCheckedChange={onSelectAll}
                                className="scale-110 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                        </TableHead>
                        <TableHead className="font-semibold text-gray-900 text-base py-5">Título</TableHead>
                        <TableHead className="font-semibold text-gray-900 text-base py-5">URL</TableHead>
                        {columns.map((col) => (
                            <TableHead
                                key={col.accessor}
                                className="font-semibold text-gray-900 text-base py-5"
                            >
                                {col.header}
                            </TableHead>
                        ))}
                        {showStatus && (
                            <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                                Status
                            </TableHead>
                        )}
                        <TableHead className="font-semibold text-gray-900 text-base py-5 text-center">
                            Ações
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.map((item, index) => (
                        <TableRow
                            key={item.id}
                            className={`hover:bg-gray-50 transition-colors duration-150 border-b border-gray-100 ${index % 2 === 0 ? "bg-white" : "bg-gray-50/30"
                                }`}
                        >
                            <TableCell className="py-5 text-center">
                                <Checkbox
                                    checked={selectedIds.includes(item.id)}
                                    onCheckedChange={(checked) => onSelect(item.id, checked as boolean)}
                                    className="scale-110 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                />
                            </TableCell>
                            <TableCell className="py-5">
                                <span className="text-gray-900 font-medium text-base" dangerouslySetInnerHTML={{ __html: item.titulo }}></span>
                            </TableCell>
                            <TableCell className="py-5">
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
                            {columns.map((col) => (
                                <TableCell key={col.accessor} className="py-5">
                                    {col.cell(item)}
                                </TableCell>
                            ))}
                            {showStatus && (
                                <TableCell className="text-center py-5">
                                    <Badge
                                        variant={item.status ? "default" : "secondary"}
                                        className={`px-3 py-1 text-xs font-medium rounded-full ${item.status
                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-200"
                                            : "bg-gray-100 text-gray-700 border border-gray-200"
                                            }`}
                                    >
                                        {item.status ? "Ativo" : "Inativo"}
                                    </Badge>
                                </TableCell>
                            )}
                            <TableCell className="text-center">
                                {renderActions(item)}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}