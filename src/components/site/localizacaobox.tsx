"use client";

import { useMemo, useState } from "react";
import { Dot, Lock } from "lucide-react";

interface LocalizacaoBoxProps {
  bairro?: string;
  cidade?: string;
  uf?: string;
  endereco?: string;
  numero?: string;
  cep?: string;
}

export default function LocalizacaoBox({
  bairro = "",
  cidade = "",
  uf = "",
  endereco = "",
  numero = "",
  cep = "",
}: LocalizacaoBoxProps) {
  const [mapaAberto, setMapaAberto] = useState(false);

  const toPascalCase = (text: string) =>
    text
      .toLowerCase()
      .split(" ")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(" ");

  const partesEndereco = [endereco, bairro, cidade, numero, uf, cep].filter(
    (part) => part && part.trim() !== ""
  );
  const enderecoTextoFormatado = partesEndereco.map((part) =>
    toPascalCase(part.trim())
  );

  const apiKey = process.env.NEXT_PUBLIC_MAPS_API_KEY ?? "";

  const src = useMemo(() => {
    if (!apiKey || !bairro.trim()) return "";

    const query = [
      `Bairro ${bairro.trim()}`,
      cidade && cidade.trim(),
      uf && uf.trim(),
    ]
      .filter(Boolean)
      .join(", ");

    return `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(
      query
    )}`;
  }, [apiKey, bairro, cidade, uf]);

  const podeExibirMapa = Boolean(apiKey && src);

  return (
    <div>
      <h2 className="text-[#4d4d4d] text-xl font-bold mb-2">Localização</h2>

      <p className="text-md text-[#303030] mb-8 flex flex-wrap items-center">
        {enderecoTextoFormatado.length > 0
          ? enderecoTextoFormatado.map((parte, index) => (
            <span key={index} className="flex items-center">
              <span
                className="inline-block text-muted-foreground border-b text-sm border-muted-foreground/30 pb-0.5 cursor-pointer hover:text-foreground transition-colors duration-200"
                onClick={() => console.log(`Clicou em: ${parte}`)}
              >
                {parte}
              </span>
              {index < enderecoTextoFormatado.length - 1 && (
                <Dot className="text-gray-400" />
              )}
            </span>
          ))
          : "Endereço não disponível"}
      </p>

      <div className="relative group overflow-hidden rounded-lg shadow-md h-[180px]">
        {podeExibirMapa && (
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
        )}

        {!mapaAberto && podeExibirMapa && (
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
