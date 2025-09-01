"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { FileDown, Trash2 } from "lucide-react";
import { FormularioPlain } from "@/lib/actions/formularios";

type Delimiter = "," | ";";

interface Props {
  data: FormularioPlain[];
  onExcluir: () => void;
  filename?: string;
  delimiter?: Delimiter;
}

function csvEscape(value: unknown): string {
  if (value === null || value === undefined) return "";
  const s = String(value);
  if (/[",;\r\n]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

function fmtDate(d?: Date | string | null): string {
  if (!d) return "";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function ActionButtonsFormularios({
  data,
  onExcluir,
  filename = "formularios",
  delimiter = ",",
}: Props) {
  const handleExport = useCallback(() => {
    const headers = [
      "id",
      "tipo",
      "nome",
      "email",
      "telefone",
      "origem",
      "interesse",
      "dataEnvio",
      "turnoVisita",
      "DataVisita",
      "codigoImovel",
      "mensagem",
      "condominio",
      "assunto",
      "finalidade",
      "valorDesejado",
      "urlRespondida",
    ] as const;

    type Row = {
      [K in (typeof headers)[number]]: string;
    };

    const rows: Row[] = data.map((f) => ({
      id: f.id,
      tipo: f.tipo,
      nome: f.nome,
      email: f.email,
      telefone: f.telefone,
      origem: f.origem,
      interesse: f.interesse ?? "",
      dataEnvio: fmtDate(f.dataEnvio),
      turnoVisita: f.turnoVisita ?? "",
      DataVisita: fmtDate(f.DataVisita ?? null),
      codigoImovel: f.codigoImovel ?? "",
      mensagem: f.mensagem ?? "",
      condominio: f.condominio ?? "",
      assunto: f.assunto ?? "",
      finalidade: f.finalidade ?? "",
      valorDesejado: f.valorDesejado !== null && f.valorDesejado !== undefined
        ? String(f.valorDesejado)
        : "",
      urlRespondida: f.urlRespondida ?? "",
    }));

    const sep: Delimiter = delimiter;
    const headerLine = headers.join(sep);

    const bodyLines = rows.map((r) =>
      headers.map((h) => csvEscape(r[h])).join(sep)
    );

    const csvContent = "\uFEFF" + [headerLine, ...bodyLines].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }, [data, delimiter, filename]);

  return (
    <div className="mt-6 mb-8 flex flex-wrap items-center gap-3">
      <Button
        type="button"
        onClick={handleExport}
        className="inline-flex items-center gap-2"
      >
        <FileDown className="h-4 w-4" />
        Exportar CSV
      </Button>

      <Button
        type="button"
        variant="destructive"
        onClick={onExcluir}
        className="inline-flex items-center gap-2"
      >
        <Trash2 className="h-4 w-4" />
        Excluir
      </Button>
    </div>
  );
}
