'use client'

import Image from 'next/image'
import { useState } from 'react'

interface Item {
  nome: string
  valor: string
}

interface Props {
  empreendimento: string
  imagem: string
  caracteristicas: Item[]
  infraestrutura: Item[]
}


export default function EmpreendimentoBox({
  empreendimento,
  imagem,
  caracteristicas,
  infraestrutura,
}: Props) {
  const [expandido, setExpandido] = useState(false)

  const itensComSim = [
    ...(caracteristicas || []).filter(item => item.valor?.trim().toLowerCase() === 'sim'),
    ...(infraestrutura || []).filter(item => item.valor?.trim().toLowerCase() === 'sim'),
  ]

  const limite = 12
  const itensVisiveis = expandido ? itensComSim : itensComSim.slice(0, limite)

  if (itensComSim.length === 0) return null

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-1 text-center sm:text-left">
        Sobre o Empreendimento
      </h2>

      <p className={`text-[14px] text-gray-800 underline underline-offset-4 font-medium text-center sm:text-left break-words ${empreendimento ? 'mb-4' : 'mb-0'} min-h-[24px]`}>
        {empreendimento?.trim() || ''}
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

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-2 text-sm text-gray-900 justify-items-center sm:justify-items-start text-center sm:text-left">
          {itensVisiveis.map((item, idx) => (
            <span key={`${item.nome}-${idx}`} className="leading-tight">
              {item.nome}
            </span>
          ))}
        </div>
      </div>

      {
        itensComSim.length > limite && (
          <button
            onClick={() => setExpandido(v => !v)}
            className="text-sm text-blue-600 underline mt-4 block mx-auto sm:ml-auto"
          >
            {expandido ? 'Ver menos' : 'Ver mais'}
          </button>
        )
      }
    </div >
  )
}
