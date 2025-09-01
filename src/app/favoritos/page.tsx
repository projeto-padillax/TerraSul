import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import FavoritesList from "@/components/site/favoritosList";
import BreadCrumb from "@/components/site/filteredBreadcrumb";
import { Suspense } from "react";
import { getSecao } from "@/lib/actions/secoes";
import { Metadata } from "next/types";

export async function generateMetadata(): Promise<Metadata> {
  const secao = await getSecao(5);

  return {
    title: secao?.titulo,
    description: secao?.descricao,
    keywords: secao?.palavrasChave,
  };
}

export default function Favoritos() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="shadow-lg">
        <Header />
      </div>
      <main className="flex-1">
        <section className="justify-items-center py-8">
          <div className="px-8 sm:px-10 md:px-12 w-full max-w-7xl">
            <div className="h-6 rounded-sm select-none mb-7">
              <Suspense>
                <BreadCrumb />
              </Suspense>
            </div>
            <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
              <Image
                src="/Anuncie seu imovel.jpg"
                alt="Ambiente de sala com sofá"
                fill
                priority
                sizes="100vw"
                className="object-cover"
              />
              {/* Sombra lateral da esquerda para direita */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex items-center z-10 px-6">
                <h1 className="text-white text-2xl ml-10 md:text-4xl font-semibold">
                  Favoritos
                </h1>
              </div>
            </div>
            <FavoritesList />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
