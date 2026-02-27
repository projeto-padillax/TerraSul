"use client";

import Image from "next/image";
import { Camera, Video, ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import GaleriaViewer from "./galeriaViewer";

type Midia = {
  type: "image" | "video";
  src: string;
};

interface GaleriaImagensProps {
  imagens: { Foto: string }[];
  principal: string;
  video: { url: string }[];
}

export default function GaleriaImagens({
  imagens,
  principal,
  video,
}: GaleriaImagensProps) {
  const [videoAberto, setVideoAberto] = useState(false);

  const [mostrarTodas, setMostrarTodas] = useState(false);
  const expandRef = useRef<HTMLDivElement | null>(null);

  const [viewerAberto, setViewerAberto] = useState(false);
  const [viewerIndex, setViewerIndex] = useState(0);

  const midias: Midia[] = useMemo(() => {
    return [
      ...(principal ? [{ type: "image" as const, src: principal }] : []),
      ...imagens.map((f): Midia => ({ type: "image", src: f.Foto })),
      ...video.map((v): Midia => ({ type: "video", src: v.url })),
    ];
  }, [principal, imagens, video]);

  const fotos = midias.filter((m) => m.type === "image");

  const temVideo = midias.some((m) => m.type === "video");

  const midiasSemPrincipal = midias.filter((m) => m.src !== principal);
  const topoThumbs = midiasSemPrincipal.slice(0, 4);
  const restantes = midiasSemPrincipal.slice(4);

  const temMaisQue5 = restantes.length > 0;

  const toggleMaisFotos = () => {
    setMostrarTodas((prev) => {
      const next = !prev;

      if (next) {
        setVideoAberto(false);
        requestAnimationFrame(() => {
          expandRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        });
      }

      return next;
    });
  };

  const abrirViewerPorSrc = (src: string) => {
    const idx = midias.findIndex((m) => m.src === src);
    setViewerIndex(idx >= 0 ? idx : 0);
    setViewerAberto(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4 md:h-[448px]">
        <div className="w-full aspect-[3/2] md:aspect-auto md:w-4/7 md:h-full relative rounded-md overflow-hidden">
          {videoAberto && video.length > 0 ? (
            <iframe
              src={`https://www.youtube.com/embed/${video[0].url}?rel=0&controls=1&autoplay=1`}
              title="Vídeo"
              className="w-full h-full rounded-md"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div
              className="relative w-full h-full cursor-pointer"
              onClick={() => abrirViewerPorSrc(principal)}
            >
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
                <button
                  type="button"
                  className="bg-white text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md"
                  onClick={() => setVideoAberto(true)}
                >
                  <Video size={16} />
                  <span>Vídeo</span>
                </button>
              )}

              {imagens.length > 0 && (
                <button
                  type="button"
                  className={`bg-white text-black font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md ${
                    videoAberto ? "opacity-50" : ""
                  }`}
                  onClick={() => {
                    setVideoAberto(false);
                    if (window.innerWidth < 768) {
                      toggleMaisFotos();
                    }
                  }}
                >
                  <Camera size={16} />
                  <span className="flex items-center gap-2">
                    {imagens.length} Fotos
                    <span className="md:hidden">
                      {mostrarTodas ? (
                        <ChevronUp size={16} />
                      ) : (
                        <ChevronDown size={16} />
                      )}
                    </span>
                  </span>
                </button>
              )}
            </div>
          )}
        </div>

        <div className="hidden md:grid grid-cols-2 grid-rows-2 gap-[6px] w-full md:w-1/2 h-full">
          {topoThumbs.map((m, i) => {
            const isUltima = i === 3;

            return (
              <div
                key={`${m.type}-${m.src}-${i}`}
                className="relative w-full h-full rounded-md overflow-hidden cursor-pointer"
                onClick={() => abrirViewerPorSrc(m.src)}
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
                  <div className="w-full h-full bg-black/40 flex items-center justify-center">
                    <Video className="opacity-90" />
                  </div>
                )}

                {isUltima && temMaisQue5 && (
                  <>
                    <div className="absolute inset-0 bg-black/20" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMaisFotos();
                      }}
                      className="
                        absolute
                        top-1/2 left-1/2
                        -translate-x-1/2 -translate-y-1/2
                        bg-white/90 backdrop-blur-sm
                        text-black font-semibold
                        px-4 py-2
                        rounded-md
                        shadow-lg
                        flex items-center gap-2
                      "
                    >
                      <span>Mais fotos</span>
                      {mostrarTodas ? (
                        <ChevronUp size={18} />
                      ) : (
                        <ChevronDown size={18} />
                      )}
                    </button>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {mostrarTodas && fotos.length > 1 && (
        <div ref={expandRef} className="grid grid-cols-4 gap-2">
          {fotos
            .filter((m) => m.src !== principal)
            .map((m, idx) => (
              <div
                key={`${m.src}-${idx}`}
                className="relative w-full aspect-[4/3] rounded-md overflow-hidden cursor-pointer"
                onClick={() => abrirViewerPorSrc(m.src)}
              >
                <Image
                  src={m.src}
                  alt={`Foto extra ${idx + 1}`}
                  fill
                  className="object-cover"
                  sizes="25vw"
                />
              </div>
            ))}
        </div>
      )}

      {viewerAberto && (
        <GaleriaViewer
          midias={midias}
          initialIndex={viewerIndex}
          onClose={() => setViewerAberto(false)}
        />
      )}
    </div>
  );
}
