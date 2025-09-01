"use client";

import { X, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface GaleriaModalProps {
    imagens: { Foto: string }[];
    onClose: () => void;
}

export default function GaleriaModal({ imagens, onClose }: GaleriaModalProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

    const selectedImage = selectedIndex !== null ? imagens[selectedIndex].Foto : null;

    const handleNext = () => {
        if (selectedIndex !== null && selectedIndex < imagens.length - 1) {
            setSelectedIndex(selectedIndex + 1);
        }
    };

    const handlePrev = () => {
        if (selectedIndex !== null && selectedIndex > 0) {
            setSelectedIndex(selectedIndex - 1);
        }
    };

    return (
        <div className="fixed inset-0 z-50 bg-white flex items-center justify-center">
            <button
                onClick={() => {
                    if (selectedIndex !== null) {
                        setSelectedIndex(null);
                    } else {
                        onClose();
                    }
                }}
                className="absolute top-4 right-4 text-black hover:text-red-500 z-50"
                title={selectedIndex !== null ? "Fechar imagem" : "Fechar galeria"}
            >
                <X size={28} />
            </button>

            {selectedImage ? (
                <div className="w-full h-full relative flex items-center justify-center">
                    <Image
                        src={selectedImage}
                        alt="Imagem ampliada"
                        fill
                        className="object-contain"
                    />

                    {selectedIndex !== null && selectedIndex > 0 && (
                        <button
                            onClick={handlePrev}
                            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 hover:bg-white rounded-full p-2 shadow z-50"
                            title="Anterior"
                        >
                            <ChevronLeft size={32} />
                        </button>
                    )}
                    {selectedIndex !== null && selectedIndex < imagens.length - 1 && (
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
                        {imagens.length} fotos
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {imagens.map((img, index) => (
                            <div
                                key={index}
                                onClick={() => setSelectedIndex(index)}
                                className="cursor-pointer relative aspect-[4/3] rounded overflow-hidden"
                            >
                                <Image
                                    src={img.Foto}
                                    alt={`Imagem ${index + 1}`}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
