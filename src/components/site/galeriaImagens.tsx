'use client';

import Image from "next/image";
import { Camera, Video } from "lucide-react";
import { useState} from "react";
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

  // converte para Midia[]
 const midias: Midia[] = [
  ...imagens.map(img => ({ type: "image" as const, src: img.Foto })),
  ...video.map(v => ({ type: "video" as const, src: v.url }))
];

  const temVideo = midias.some(m => m.type === "video");

  return (
    <>
      <div className="flex flex-col md:flex-row gap-4 md:h-[448px]">
        <div
          className="w-full aspect-square md:aspect-auto md:w-4/7 md:h-full relative rounded-md overflow-hidden cursor-pointer"
          onClick={() => setModalAberta(true)}
        >
          <Image
            src={principal}
            alt="Foto principal"
            fill
            className="object-cover rounded-md"
            sizes="(max-width: 768px) 100vw, 60vw"
            priority
          />

          {(temVideo || imagens.length > 4) && (
            <div className="absolute bottom-6 left-6 flex gap-2">
              {temVideo && (
                <div className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 shadow-md pointer-events-none">
                  <Video size={16}/>
                  <span>Vídeo</span>
                </div>
              )}
              {imagens.length > 4 && (
                <div className="bg-white text-black px-4 py-2 rounded-md flex items-center gap-2 shadow-md pointer-events-none">
                  <Camera size={16}/>
                  <span>{imagens.length} Fotos</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 grid-rows-2 gap-[6px] w-full md:w-1/2 h-full">
          {midias.slice(0, 4).map((m, i) => (
            <div
              key={i}
              className="relative w-full h-full rounded-md overflow-hidden cursor-pointer"
              onClick={() => setModalAberta(true)}
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
                  src={m.src}
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
