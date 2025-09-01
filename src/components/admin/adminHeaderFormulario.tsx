"use client"

import { CalendarRange, Filter } from "lucide-react"
import { useMemo } from "react"

type TipoFormulario =
  | "WHATSAPP"
  | "FINANCIAMENTO"
  | "INFORMACOES"
  | "CONTATO"
  | "VISITA"
  | "ANUNCIEIMOVEL"
  | "ADMIMOVEL"
  | "ADMCONDOMINIO"

interface AdminHeaderFormulariosProps {
  title: string
  subtitle: string
  totalLabel: string
  total: number
  selecionados: number

  tipoValue: TipoFormulario | "ALL"
  startDate?: string // "YYYY-MM-DD"
  endDate?: string   // "YYYY-MM-DD"

  onChangeTipo: (value: TipoFormulario | "ALL") => void
  onChangeStartDate: (value: string) => void
  onChangeEndDate: (value: string) => void
  onApply?: () => void
  onClear?: () => void
}

export function AdminHeaderFormularios({
  title,
  subtitle,
  totalLabel,
  total,
  selecionados,
  tipoValue,
  startDate,
  endDate,
  onChangeTipo,
  onChangeStartDate,
  onChangeEndDate,
  onApply,
  onClear,
}: AdminHeaderFormulariosProps) {
  const tipos = useMemo(
    () =>
      [
        "WHATSAPP",
        "FINANCIAMENTO",
        "INFORMACOES",
        "CONTATO",
        "VISITA",
        "ANUNCIEIMOVEL",
        "ADMIMOVEL",
        "ADMCONDOMINIO",
      ] as const,
    []
  )

  return (
    <div className="mb-10">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">{title}</h1>
        <p className="text-lg text-gray-600">{subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{totalLabel}</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{total}</p>
              </div>
              <div className="bg-slate-100 rounded-lg p-3">
                <Filter className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-700 text-sm font-medium">Selecionados</p>
                <p className="text-2xl font-semibold text-blue-900 mt-1">{selecionados}</p>
              </div>
              <div className="bg-blue-100 rounded-lg p-3">
                <CalendarRange className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Formulário</label>
            <select
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={tipoValue}
              onChange={(e) => onChangeTipo(e.target.value as TipoFormulario | "ALL")}
            >
              <option value="ALL">Todos</option>
              {tipos.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Data de Início</label>
            <input
              type="date"
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={startDate ?? ""}
              onChange={(e) => onChangeStartDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">Data de Fim</label>
            <input
              type="date"
              className="h-11 rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={endDate ?? ""}
              onChange={(e) => onChangeEndDate(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            onClick={onApply}
            className="inline-flex items-center justify-center px-4 h-10 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
          >
            Aplicar filtros
          </button>
          <button
            type="button"
            onClick={onClear}
            className="inline-flex items-center justify-center px-4 h-10 rounded-lg border border-gray-300 text-gray-700 text-sm font-medium hover:bg-gray-50 transition"
          >
            Limpar
          </button>
        </div>
      </div>
    </div>
  )
}
