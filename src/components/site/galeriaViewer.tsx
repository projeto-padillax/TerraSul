"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type Midia = {
  type: "image" | "video";
  src: string;
};

interface GaleriaViewerProps {
  midias: Midia[];
  initialIndex: number;
  onClose: () => void;
}

export default function GaleriaViewer({ midias, initialIndex, onClose }: GaleriaViewerProps) {
  const [selectedIndex, setSelectedIndex] = useState<number>(initialIndex);

  const selectedItem = useMemo(() => midias[selectedIndex], [midias, selectedIndex]);

  const handleNext = () => {
    setSelectedIndex((prev) => Math.min(prev + 1, midias.length - 1));
  };

  const handlePrev = () => {
    setSelectedIndex((prev) => Math.max(prev - 1, 0));
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [midias.length, onClose]);

  return (
    <div className="fixed inset-0 z-50 w-screen h-screen bg-white flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-black hover:text-red-500 z-50"
        title="Fechar"
      >
        <X size={28} />
      </button>

      <div className="w-full h-full relative flex items-center justify-center p-4">
        {selectedItem.type === "image" ? (
          <Image
            src={selectedItem.src}
            alt="Imagem ampliada"
            fill
            className="object-contain"
            sizes="100vw"
            unoptimized
          />
        ) : (
          <iframe
            src={`https://www.youtube.com/embed/${selectedItem.src}?rel=0&controls=1`}
            className="w-[95vw] h-[70vh] sm:w-[70vw] sm:h-[75vh] rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        )}

        {selectedIndex > 0 && (
          <button
            onClick={handlePrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow z-50"
            title="Anterior"
          >
            <ChevronLeft size={32} />
          </button>
        )}

        {selectedIndex < midias.length - 1 && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow z-50"
            title="Próxima"
          >
            <ChevronRight size={32} />
          </button>
        )}
      </div>
    </div>
  );
}