"use client";

import { useState } from "react";
import { Dot, Lock } from "lucide-react";

interface LocalizacaoBoxProps {
  bairro?: string;
  cidade?: string;
  endereco?: string;
  numero?: string;
  lat?: number | string;
  lng?: number | string;
  uf?: string;
  cep?: string;
}

export default function LocalizacaoBox({
  bairro = "",
  cidade = "",
  endereco = "",
  numero = "",
  lat = "",
  lng = "",
  uf = "",
  cep = "",
}: LocalizacaoBoxProps) {
  const [mapaAberto, setMapaAberto] = useState(false);

  const usarLatLng = lat !== "" && lng !== "";

  const toPascalCase = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");


  const partesEndereco = [
    endereco,
    bairro,
    cidade,
    numero,
    uf,
    cep,
  ].filter((part) => part && part.trim() !== "");

  const enderecoTexto = partesEndereco.join(", "); // ainda usado para o src

  const enderecoTextoFormatado = partesEndereco.map((part) =>
    toPascalCase(part.trim())
  );

  const src = usarLatLng
    ? `https://www.google.com/maps?q=${lat},${lng}&z=17&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(enderecoTexto)}&z=17&output=embed`;

  return (
    <div>
      <h2 className="text-[#4d4d4d] text-xl font-bold mb-2">Localização</h2>
     <p className="text-md text-[#303030] mb-8 flex flex-wrap items-center">
      {enderecoTextoFormatado.length > 0 ? (
        enderecoTextoFormatado.map((parte, index) => (
          <span key={index} className="flex items-center">
            <span
              className="inline-block border-b-2 text-[#303030] border-[#303030] pb-0.5 cursor-pointer hover:text-gray-500 hover:border-gray-500 transition-colors duration-200"
              onClick={() => console.log(`Clicou em: ${parte}`)}
            >
              {parte}
            </span>
            {index < enderecoTextoFormatado.length - 1 && <Dot className="text-gray-400" />}
          </span>
        ))
      ) : (
        "Endereço não disponível"
      )}
    </p>

      <div className="relative group overflow-hidden rounded-lg shadow-md h-[180px]">
        <iframe
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          className={`w-full h-full object-cover transition duration-300 ${mapaAberto ? "" : "grayscale-[40%] brightness-[0.6] pointer-events-none"
            }`}
          src={src}
        />

        {!mapaAberto && (
          <>
            <div className="absolute inset-0 bg-black/30" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                className="bg-white text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
                onClick={() => setMapaAberto(true)}
              >
                <Lock size={18} />
                Ver mapa
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
