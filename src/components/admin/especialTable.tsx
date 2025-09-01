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
import React from "react"

export interface EspecialItem {
    id: string
    nomeCliente: string
    status: boolean
    createdAt: Date
    corretor?: {
        id: string;
        name: string;
    };
}

interface EspecialTableProps {
    data: EspecialItem[]
    selectedIds: string[]
    onSelectAll: (checked: boolean) => void
    onSelect: (id: string, checked: boolean) => void
    renderActions: (item: EspecialItem) => React.ReactNode
}

export function EspecialTable({
    data,
    selectedIds,
    onSelectAll,
    onSelect,
    renderActions
}: EspecialTableProps) {
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
                        <TableHead className="text-center py-5">Nome do Cliente</TableHead>
                        <TableHead className="text-center py-5">URL</TableHead>
                        <TableHead className="text-center py-5">Corretor</TableHead>
                        <TableHead className="text-center py-5">Data</TableHead>
                        <TableHead className="text-center py-5">Status</TableHead>
                        <TableHead className="text-center py-5">Ações</TableHead>
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
                            <TableCell className="py-5 text-center">{item.nomeCliente}</TableCell>
                            <TableCell className="py-5 text-center">
                                <a
                                    href={`/especial/${item.id}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 hover:underline font-medium text-base bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors duration-200"
                                >
                                    Abrir URL
                                </a>
                            </TableCell>
                            <TableCell className="py-5 text-center">{item.corretor?.name || "-"}</TableCell>
                            <TableCell className="py-5 text-center">
                                {new Date(item.createdAt).toLocaleDateString("pt-BR")}
                            </TableCell>
                            <TableCell className="py-5 text-center">
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
