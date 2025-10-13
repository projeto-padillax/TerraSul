"use client";

import { X, ChevronLeft, ChevronRight, PlayCircle } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";

type Midia = {
    type: "image" | "video";
    src: string;
};

interface GaleriaModalProps {
    midias: Midia[];
    onClose: () => void;
}

export default function GaleriaModal({ midias, onClose }: GaleriaModalProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const selectedItem = selectedIndex !== null ? midias[selectedIndex] : null;

    const handleNext = () => {
        if (selectedIndex !== null && selectedIndex < midias.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const handlePrev = () => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    // 🚫 Trava o scroll do body quando o modal abre
    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
         <div className="fixed inset-0 z-50 w-screen h-screen bg-white flex items-center justify-center">
            <button
                onClick={() => {
                    if (selectedIndex !== null) {
                        setSelectedIndex(null);
                    } else {
                        onClose();
                    }
                }}
                className="absolute top-4 right-4 text-black hover:text-red-500 z-50"
                title={selectedIndex !== null ? "Fechar item" : "Fechar galeria"}
            >
                <X size={28} />
            </button>

            {selectedItem ? (
                <div className="w-full h-full relative flex items-center justify-center p-4">
                    {selectedItem.type === "image" ? (
                        <Image
                            src={selectedItem.src}
                            alt="Imagem ampliada"
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <iframe
                            src={`https://www.youtube.com/embed/${selectedItem.src}?rel=0&controls=1`}
                            className="w-[95vw] h-[70vh] sm:w-[70vw] sm:h-[75vh] rounded-lg"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    )}

                    {selectedIndex !== null && selectedIndex > 0 && (
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow z-50"
                            title="Anterior"
                        >
                            <ChevronLeft size={32} />
                        </button>
                    )}
                    {selectedIndex !== null && selectedIndex < midias.length - 1 && (
                        <button
                            onClick={handleNext}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow z-50"
                            title="Próxima"
                        >
                            <ChevronRight size={32} />
                        </button>
                    )}
                </div>
            ) : (
                <div className="w-full h-full p-6 overflow-y-auto">
                    <h2 className="text-black text-xl font-semibold mb-6">
                        {midias.length} {midias[0]?.type === "video" ? "vídeos" : "fotos"}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {midias.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className="cursor-pointer relative aspect-[4/3] rounded overflow-hidden bg-black"
                            >
                                {item.type === "image" ? (
                                    <Image
                                        src={item.src}
                                        alt={`Imagem ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                                        <PlayCircle size={42} className="text-white opacity-80" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
