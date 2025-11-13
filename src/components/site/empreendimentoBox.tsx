"use client";

import { useIsMobile } from "@/hooks/useIsMobile";
import { capitalizeWords } from "@/utils/capitalize";
import Link from "next/link";
import { useState } from "react";

interface Item {
  nome: string;
  valor: string;
}

interface Props {
  empreendimento: string;
  imagem: string;
  infraestrutura: Item[];
}

export default function EmpreendimentoBox({
  empreendimento,
  infraestrutura,
}: Props) {
  const [expandido, setExpandido] = useState(false);
  const isMobile = useIsMobile();

  const itensComSim = [
    ...(infraestrutura || []).filter(
      (item) => item.valor?.trim().toLowerCase() === "sim"
    ),
  ];

  const limite = 12;
  const itensVisiveis = expandido ? itensComSim : itensComSim.slice(0, limite);

  if (itensComSim.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 shadow-sm mb-8">
      <h2 className="text-xl font-bold text-[#303030] mb-1 text-center sm:text-left">
        Infraestrutura
      </h2>

      <Link
        href={`/busca/comprar/${encodeURIComponent(
          "imoveis"
        )}/${encodeURIComponent(
          "porto alegre"
        )}?action=comprar&empreendimento=${encodeURIComponent(
          empreendimento?.trim()
        )}&page=1${isMobile ? "#ImoveisSection" : ""}`}
        className={`block text-[14px] text-gray-800 underline underline-offset-4 font-medium text-center sm:text-left break-words ${
          empreendimento ? "mb-4" : "mb-0"
        } min-h-[24px]`}
      >
        {capitalizeWords(empreendimento?.trim()) || ""}
      </Link>

      <div className="flex gap-5 sm:gap-6 items-start">

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-2 text-sm text-gray-900 justify-items-center sm:justify-items-start text-center sm:text-left w-full">
          {itensVisiveis.map((item, idx) => (
            <span key={`${item.nome}-${idx}`} className="leading-tight">
              {item.nome}
            </span>
          ))}
        </div>
      </div>

      {itensComSim.length > limite && (
        <button
          onClick={() => setExpandido((v) => !v)}
          className="text-sm text-blue-600 underline mt-4 block mx-auto sm:ml-auto"
        >
          {expandido ? "Ver menos" : "Ver mais"}
        </button>
      )}
    </div>
  );
}
