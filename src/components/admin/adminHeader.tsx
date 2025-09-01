"use client"

import { ExternalLink, Power, Edit } from "lucide-react"

interface AdminHeaderProps {
  title: string
  subtitle: string
  totalLabel: string
  total: number
  ativosLabel: string
  ativos: number
  selecionados: number
}

export function AdminHeader({
  title,
  subtitle,
  totalLabel,
  total,
  ativosLabel,
  ativos,
  selecionados,
}: AdminHeaderProps) {
  return (
    <div className="mb-10">
      <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
        <h1 className="text-3xl font-semibold text-gray-900 mb-3">{title}</h1>
        <p className="text-lg text-gray-600">{subtitle}</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">{totalLabel}</p>
                <p className="text-2xl font-semibold text-slate-900 mt-1">{total}</p>
              </div>
              <div className="bg-slate-100 rounded-lg p-3">
                <ExternalLink className="h-5 w-5 text-slate-600" />
              </div>
            </div>
          </div>

          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-700 text-sm font-medium">{ativosLabel}</p>
                <p className="text-2xl font-semibold text-emerald-900 mt-1">{ativos}</p>
              </div>
              <div className="bg-emerald-100 rounded-lg p-3">
                <Power className="h-5 w-5 text-emerald-600" />
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
                <Edit className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
