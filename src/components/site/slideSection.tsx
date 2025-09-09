"use client";
import Link from "next/link";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import { type CarouselApi } from "@/components/ui/carousel";
import { useEffect, useState } from "react";

interface SlideSectionProps {
  slides: {
    imagem?: string;
    titulo?: string;
    url?: string;
  }[];
}

export default function SlideSection({ slides }: SlideSectionProps) {
  const [api, setApi] = useState<CarouselApi>();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!api) return;

    const onSelect = () => {
      const index = api.selectedScrollSnap();
      setCurrentIndex(index);

      // Impede que avance se estiver no último
      if (!api.canScrollNext()) {
        api.scrollTo(index); // trava no último
      }
    };

    api.on("select", onSelect);
    setCurrentIndex(api.selectedScrollSnap());

    return () => {
      api.off("select", onSelect);
    };
  }, [api]);

  return (
    <section className="py-8 pt-16 justify-items-center">
      <div className="px-8 sm:px-10 md:px-0 w-full max-w-7xl">
        <Carousel setApi={setApi}>
          <CarouselContent>
            {slides.map((slide, index) => (
              <CarouselItem key={index}>
                <div
                  className="relative h-80 bg-center bg-cover rounded-3xl overflow-hidden object-cover"
                  style={{ backgroundImage: `url(${slide.imagem})` }}
                >
                  <Link
                    href={slide.url ?? "#"}
                    className="absolute w-full h-full z-10"
                      aria-label={slide.titulo ? `Abrir: ${slide.titulo}` : "Slide sem título"}
  title={slide.titulo ? slide.titulo : "Slide sem título"}
                  >
                    {!slide.imagem && (
                      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                    )}
                  </Link>
                  <div className="absolute [background:linear-gradient(0deg,rgba(0,0,0,0.59)_0%,rgba(237,221,83,0)_100%)] bottom-0 left-0 right-0 flex items-end px-[2rem] py-[2rem] text-white">
                    <h2
                      dangerouslySetInnerHTML={{
                        __html: slide.titulo ?? "Slide não encontrado",
                      }}
                      className="font-semibold text-lg text-white text-start max-w-2xl font-sans leading-[1.2]"
                    ></h2>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="flex justify-center gap-2 mt-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => api?.scrollTo(index)}
              className={`w-4 h-4 rounded-full transition-all duration-300 cursor-pointer ${
                currentIndex === index ? "bg-site-primary" : "bg-[#e7e7e7]"
              }`}
              aria-label={`Ir para o slide ${index + 1}`}
              aria-current={currentIndex === index ? "true" : undefined}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
