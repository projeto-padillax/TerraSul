import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { getAllChamadas } from "@/lib/actions/chamada";
import Link from "next/link";

interface ChamadasNaHomeSectionProps {
  titulo: string;
  subtitulo: string;
  imagem: string;
  url: string;
}

export default async function CategoryCards() {
  const categories = await getAllChamadas();
  if (categories.length == 0) return null;
  return (
    <section className="py-8 justify-items-center">
      <div className="px-8 sm:px-10 md:px-0 w-full max-w-7xl">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {categories.map(
            (category: ChamadasNaHomeSectionProps, index: number) => (
              <Link href={category.url} key={index}>
                <Card
                  key={index}
                  className="relative overflow-hidden transform transition duration-300 hover:scale-105 cursor-pointer aspect-[3/4] py-0 border-0 shadow-none hover:shadow-2xl"
                >
                  <div className="relative w-full h-full">
                    <Image
                      src={category.imagem}
                      alt={category.titulo}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 50vw, 20vw"
                    />

                    {/* Gradiente inferior mais forte e responsivo */}
                    <div
                      className="absolute bottom-0 left-0 w-full
                 h-16 sm:h-20 md:h-24
                 bg-gradient-to-t from-black/80 via-black/60 to-transparent"
                    />

                    <CardContent className="absolute bottom-0 z-10 p-4 text-white">
                      <p className="text-lg font-semibold mb-1 font-sans">{category.titulo}</p>
                      <h3 className="text-sm opacity-90">
                        {category.subtitulo}
                      </h3>
                    </CardContent>
                  </div>
                </Card>
              </Link>
            )
          )}
        </div>
      </div>
    </section>
  );
}
