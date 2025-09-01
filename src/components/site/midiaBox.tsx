"use client";

import Image from "next/image";
import { useState } from "react";
import GaleriaModal from "./galeriaModal";
import { Camera, PlayCircle } from "lucide-react";

interface MidiaBoxProps {
  imagens: { Foto: string }[];
  videos?: { url: string; thumb: string }[];
}

export default function MidiaBox({ imagens, videos = [] }: MidiaBoxProps) {
  const [modalAberta, setModalAberta] = useState(false);

  return (
    <>
      <section className="mt-8">
        <h2 className="text-[#4d4d4d] text-xl font-bold mb-4">Mídias</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {videos.map((video, i) => (
            <div
              key={`video-${i}`}
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => setModalAberta(true)}
            >
              <Image
                src={video.thumb}
                alt="Vídeo"
                width={800}
                height={450}
                className="w-full h-45 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md pointer-events-none">
                  <PlayCircle size={18} />
                  Vídeo
                </button>
              </div>
            </div>
          ))}

          {imagens.slice(0, 1).map((img, i) => (
            <div
              key={`foto-${i}`}
              className="relative group overflow-hidden rounded-lg shadow-md cursor-pointer"
              onClick={() => setModalAberta(true)}
            >
              <Image
                src={img.Foto}
                alt="Foto"
                width={800}
                height={450}
                className="w-full h-45 object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/30" />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-white text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md pointer-events-none">
                  <Camera size={18}/>
                  Fotos
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {modalAberta && (
        <GaleriaModal imagens={imagens} onClose={() => setModalAberta(false)} />
      )}
    </>
  );
}
