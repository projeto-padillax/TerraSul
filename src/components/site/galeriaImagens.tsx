'use client';

import Image from "next/image";
import { Camera, Video } from "lucide-react";
import { useState } from "react";
import GaleriaModal from "./galeriaModal";

type Midia = {
  type: "image" | "video";
  src: string;
};

interface GaleriaImagensProps {
  imagens: { Foto: string }[];
  principal: string;
  video: { url: string }[];
}

export default function GaleriaImagens({ imagens, principal, video }: GaleriaImagensProps) {
  const [modalAberta, setModalAberta] = useState(false);
  const [videoAberto, setVideoAberto] = useState(false);

  // converter para tipo unificado
  const midias: Midia[] = [
    ...(principal ? [{ type: "image" as const, src: principal }] : []),
    ...imagens.map((f): Midia => ({ type: "image", src: f.Foto })),
    ...video.map((v): Midia => ({ type: "video", src: v.url })),
  ];

  const temVideo = midias.some(m => m.type === "video");

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:h-[448px]">
        <div
          className="w-full aspect-square md:aspect-auto md:w-4/7 md:h-full relative rounded-md overflow-hidden"
        >
          {videoAberto && video.length > 0 ? (
            <iframe
              src={`https://www.youtube.com/embed/${video[0].url}?rel=0&controls=1&autoplay=1`}
              title="Vídeo"
              className="w-full h-full rounded-md"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />

          ) : (
            <div className="relative w-full h-full cursor-pointer" onClick={() => setModalAberta(true)}>
              <Image
                src={principal}
                alt="Foto principal"
                fill
                className="object-cover rounded-md"
                sizes="(max-width: 768px) 100vw, 60vw"
                priority
              />
            </div>
          )}

          {(temVideo || imagens.length > 3) && (
            <div className="absolute bottom-5 left-5 flex gap-2">
              {temVideo && !videoAberto && (
                <div
                  className="bg-white text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md cursor-pointer"
                  onClick={() => setVideoAberto(true)}
                >
                  <Video size={16} />
                  <span>Vídeo</span>
                </div>
              )}
              {imagens.length > 3 && (
                <div
                  className={`bg-white text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md cursor-pointer ${videoAberto ? "opacity-50" : ""
                    }`} onClick={() => { setModalAberta(true); setVideoAberto(false); }}
                >
                  <Camera size={16} />
                  <span>{imagens.length} Fotos</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-[6px] w-full md:w-1/2 h-full">
          {midias.filter(m => m.src !== principal).slice(0, 4).map((m, i) => (
            <div
              key={i}
              className="relative w-full h-full rounded-md overflow-hidden cursor-pointer"
              onClick={() => { setModalAberta(true); setVideoAberto(false); }}
            >
              {m.type === "image" ? (
                <Image
                  src={m.src}
                  alt={`Foto ${i + 1}`}
                  fill
                  className="object-cover rounded-md"
                  sizes="(max-width: 768px) 50vw, 30vw"
                />
              ) : (
                <video
                  src={`https://www.youtube.com/embed/${m.src}`}
                  className="object-cover w-full h-full rounded-md"
                  muted
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {modalAberta && (
        <GaleriaModal midias={midias} onClose={() => setModalAberta(false)} />
      )}
    </>
  );
}
