'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Props {
  empreendimento: string
  imagem: string
  caracteristicas: Record<string, string>
  infraestrutura: Record<string, string>
}

export default function EmpreendimentoBox({
  empreendimento,
  imagem,
  caracteristicas,
  infraestrutura,
}: Props) {
  const [expandido, setExpandido] = useState(false)

  const itensComSim = [
    ...Object.entries(caracteristicas || {}).filter(([, v]) => v === 'Sim'),
    ...Object.entries(infraestrutura || {}).filter(([, v]) => v === 'Sim'),
  ]

  const limite = 12
  const itensVisiveis = expandido ? itensComSim : itensComSim.slice(0, limite)

  if (itensComSim.length === 0) return null

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-1 text-center sm:text-left">
        Sobre o Empreendimento
      </h2>

      <p className="text-[16px] text-black underline underline-offset-4 font-medium mb-4 text-center sm:text-left break-words">
        {empreendimento}
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-[200px_1fr] gap-5 sm:gap-6 items-start">
        <div className="relative w-full max-w-[320px] sm:max-w-[200px] aspect-[4/3] mx-auto sm:mx-0 rounded overflow-hidden">
          <Image
            src={imagem}
            alt={`Imagem do empreendimento ${empreendimento}`}
            fill
            sizes="(max-width: 640px) 320px, 200px"
            className="object-cover"
          />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-800 justify-items-center sm:justify-items-start text-center sm:text-left">
          {itensVisiveis.map(([item], idx) => (
            <span key={`${item}-${idx}`} className="leading-tight">
              {item}
            </span>
          ))}
        </div>
      </div>

      {itensComSim.length > limite && (
        <button
          onClick={() => setExpandido(v => !v)}
          className="text-sm text-blue-600 underline mt-4 block mx-auto sm:ml-auto"
        >
          {expandido ? 'Ver menos' : 'Ver mais'}
        </button>
      )}
    </div>
  )
}
