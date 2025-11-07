"use client";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import React from "react";
import type { Formulario } from "@prisma/client";
import Link from "next/link";
import { FormularioPlain } from "@/lib/actions/formularios";

type IdType = string;

interface FormulariosTableProps {
    data: FormularioPlain[];
    selectedIds: IdType[];
    onSelectAll: (checked: boolean) => void;
    onSelect: (id: IdType, checked: boolean) => void;
    renderActions?: (item: Formulario) => React.ReactNode;
}

function formatPtBR(d: Date | string | null | undefined): string {
    if (!d) return "-";
    const dt = typeof d === "string" ? new Date(d) : d;
    if (Number.isNaN(dt.getTime())) return "-";
    return dt.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}


function humanizeEnum(value?: string | null): string {
    if (!value) return "-";
    return value
        .toString()
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/(^\w{1})|(\s+\w{1})/g, (l) => l.toUpperCase());
}

export function FormulariosTable({
    data,
    selectedIds,
    onSelectAll,
    onSelect,
}: FormulariosTableProps) {
    const columns = [
        { key: "cod", label: "Cód" },
        { key: "nome", label: "Nome" },
        { key: "email", label: "E-mail" },
        { key: "telefone", label: "Telefone" },
        { key: "url", label: "URL" },
        { key: "formulario", label: "Formulário" },
        { key: "origem", label: "Origem" },
        // { key: "interesse", label: "Interesse" },
        { key: "data", label: "Data" },
    ] as const;

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

                        {columns.map((c) => (
                            <TableHead
                                key={c.key}
                                className="font-semibold text-gray-900 text-base py-5 text-center"
                            >
                                {c.label}
                            </TableHead>
                        ))}

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

                            <TableCell className="py-5 text-center">
                                <span className="text-gray-900 text-base">{item.codigoImovel || "-"}</span>
                            </TableCell>

                            <TableCell className="py-5 text-center">
                                <Link
                                    href={`/admin/leads/${item.id}`}
                                    className="text-blue-600 hover:underline text-base font-medium"
                                >
                                    {item.nome}
                                </Link>
                            </TableCell>

                            <TableCell className="py-5 text-center">
                                <span className="text-gray-900 text-base">{item.email}</span>
                            </TableCell>

                            <TableCell className="py-5 text-center">
                                <span className="text-gray-900 text-base">{item.telefone ?? "-"}</span>
                            </TableCell>

                            <TableCell className="py-5 text-center">
                                {item.urlRespondida ? (
                                    <a
                                        href={item.urlRespondida}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                        title={item.urlRespondida}
                                    >
                                        URL
                                    </a>
                                ) : (
                                    <span className="text-gray-900 text-base">-</span>
                                )}
                            </TableCell>

                            <TableCell className="py-5 text-center">
                                <Badge className="px-3 py-1 text-xs font-medium rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                                    {humanizeEnum(item.tipo)}
                                </Badge>
                            </TableCell>

                            <TableCell className="py-5 text-center">
                                <span className="text-gray-900 text-base">{humanizeEnum(item.origem)}</span>
                            </TableCell>

                            {/* <TableCell className="py-5 text-center">
                                <span className="text-gray-900 text-base">
                                    {item.interesse ? humanizeEnum(item.interesse) : "-"}
                                </span>
                            </TableCell> */}

                            <TableCell className="py-5 text-center">
                                <span className="text-gray-900 text-base">{formatPtBR(item.dataEnvio)}</span>
                            </TableCell>

                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
