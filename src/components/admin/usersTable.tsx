"use client"
/* eslint-disable @typescript-eslint/no-explicit-any */

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

type IdType = string | number;

const FIELD_MAP: Record<string, string> = {
  data: "createdAt",
  nome: "name",
};

const getCellValue = (item: any, col: string) => {
  const mappedField = FIELD_MAP[col] || col;
  const value = item[mappedField];

  if (col === "data" && value) {
    return new Date(value).toLocaleDateString("pt-BR");
  }

  return value ?? "-";
};

interface BaseItem<Id extends IdType = string | number> {
    id: Id
    name: string
    email: string
    status: boolean
    [key: string]: any
}

interface UserTableProps<
    Id extends IdType = string | number,
    T extends BaseItem<Id> = BaseItem<Id>
> {
    data: T[];
    selectedIds: Id[];
    onSelectAll: (checked: boolean) => void;
    onSelect: (id: Id, checked: boolean) => void;
    renderActions: (item: T) => React.ReactNode;
    type?: "usuario" | "corretor";
}


export function UserTable<
    Id extends IdType = string | number,
    T extends BaseItem<Id> = BaseItem<Id>>({
        type = "corretor",
        data,
        selectedIds,
        onSelectAll,
        onSelect,
        renderActions
    }: UserTableProps<Id, T>) {
    const getColumns = () => {
        switch (type) {
            case "usuario":
                return ["nome", "email", "login", "perfil", "status"]
            case "corretor":
                return ["nome", "telefone", "email", "data", "status"]
        }
    }

    const columns = getColumns()

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
                        {columns.map((col) => (
                            <TableHead
                                key={col}
                                className="font-semibold text-gray-900 text-base py-5 capitalize text-center"
                            >
                                {col}
                            </TableHead>
                        ))}
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

                            {columns.map((col) => {
                                if (col === "status") {
                                    return (
                                        <TableCell key={col} className="text-center py-5">
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
                                    )
                                }

                                return (
                                    <TableCell key={col} className="py-5 text-center">
                                        <span className="text-gray-900 text-base">
                                            {getCellValue(item, col)}
                                        </span>
                                    </TableCell>
                                )
                            })}

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
