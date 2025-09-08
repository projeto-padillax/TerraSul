"use client";

import Image from "next/image";
import { useState } from "react";
import GaleriaModal from "./galeriaModal";
import { Camera, PlayCircle } from "lucide-react";

interface MidiaBoxProps {
  imagens: { Foto: string }[];
  videos?: { url: string }[];
}

type Midia = {
  type: "image" | "video";
  src: string;
};

export default function MidiaBox({ imagens, videos = [] }: MidiaBoxProps) {
  const [modalAberta, setModalAberta] = useState(false);
  const [midiasSelecionadas, setMidiasSelecionadas] = useState<Midia[] | null>(null);

  const handleAbrirGaleria = (tipo: "image" | "video") => {
    const midiasFiltradas: Midia[] =
      tipo === "image"
        ? imagens.map((img) => ({ type: "image", src: img.Foto }))
        : videos.map((vid) => ({ type: "video", src: vid.url }));

    setMidiasSelecionadas(midiasFiltradas);
    setModalAberta(true);
  };

  const [videoAberto, setVideoAberto] = useState(false);

  return (
    <>
      <section className="mt-8">
        <h2 className="text-[#4d4d4d] text-xl font-bold mb-4">Mídias</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.length === 1 ? (
            <div
              key="video-unico"
              className="relative overflow-hidden rounded-lg shadow-md h-64 cursor-pointer"
              onClick={() => setVideoAberto(true)}
            >
              {videoAberto ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videos[0].url}?rel=0&controls=1&autoplay=1`}
                  title="Vídeo"
                  className="w-full h-full rounded-lg"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <>
                  <Image
                    src={imagens[1]?.Foto ?? "/fallback.jpg"}
                    alt="Thumb do vídeo"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="bg-white/80 text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md">
                      <PlayCircle size={18} />
                      Vídeo
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            videos.map((video, i) => (
              <div
                key={`video-${i}`}
                className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer h-64"
                onClick={() => handleAbrirGaleria("video")}
              >
                <Image
                  src={imagens[1]?.Foto ?? "/fallback.jpg"}
                  alt={`Thumb do vídeo ${i + 1}`}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/30" />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="bg-white/80 text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md">
                    <PlayCircle size={18} />
                    Vídeo
                  </div>
                </div>
              </div>
            ))
          )}

          {/* Imagens */}
          {imagens.slice(0, 1).map((img, i) => (
            <div
              key={`foto-${i}`}
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => handleAbrirGaleria("image")}
            >
              <Image
                src={img.Foto}
                alt="Foto"
                width={800}
                height={450}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md pointer-events-none">
                  <Camera size={18} />
                  Fotos
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {modalAberta && midiasSelecionadas && (
        <GaleriaModal
          midias={midiasSelecionadas}
          onClose={() => {
            setModalAberta(false);
            setMidiasSelecionadas(null);
          }}
        />
      )}
    </>
  );
}
