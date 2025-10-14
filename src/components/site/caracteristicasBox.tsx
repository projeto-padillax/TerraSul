"use client";
import { useState } from "react";

interface Item {
  nome: string;
  valor: string;
}

interface Props {
  caracteristicas: Item[];
}

export default function CaracteristicasBox({
  caracteristicas,
}: Props) {
  const [expandido, setExpandido] = useState(false);

  const itensComSim = [
    ...(caracteristicas || []).filter(
      (item) => item.valor?.trim().toLowerCase() === "sim"
    ),
  ];

  const limite = 12;
  const itensVisiveis = expandido ? itensComSim : itensComSim.slice(0, limite);

  if (itensComSim.length === 0) return null;

  return (
    <div className="bg-white rounded-lg border p-4 sm:p-6 shadow-sm mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-1 text-center sm:text-left">
        CARACTERISTICAS
      </h2>

      <div className="flex gap-5 sm:gap-6 items-start">

        <div className="grid grid-cols-3 gap-x-6 gap-y-2 text-sm text-gray-900 justify-items-center sm:justify-items-start text-center sm:text-left w-full">
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
