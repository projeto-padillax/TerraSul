export const revalidate = 3600;

import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import BreadCrumb from "@/components/site/filteredBreadcrumb";
import { Suspense } from "react";
import { Metadata } from "next/types";
import { getSecao } from "@/lib/actions/secoes";

export async function generateMetadata(): Promise<Metadata> {
  const secao = await getSecao(5);

  return {
    title: secao?.titulo,
    description: secao?.descricao,
    keywords: secao?.palavrasChave,
  };
}

export default async function PoliticaDePrivacidade() {
  const secao = await getSecao(5);
  if (!secao) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="shadow-lg">
        <Header />
      </div>

      <main className="flex-1">
        <section className="justify-items-center py-8">
          <div className="px-8 sm:px-10 md:px-0 w-full max-w-7xl">
            <div className="rounded-sm mb-7">
              <Suspense>
                <BreadCrumb />
              </Suspense>
            </div>

            {secao.imagem ? (
              <div className="relative w-full h-[200px] md:h-[240px] rounded-lg overflow-hidden">
                <Image
                  src={secao.imagem}
                  alt={secao.tituloh1 || secao.titulo}
                  fill
                  priority
                  sizes="100vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
                <div className="absolute inset-y-0 left-0 flex items-center z-10 px-4 sm:px-6 md:px-10">
                  <h1 className="text-white text-2xl md:text-4xl font-semibold">
                    {secao.titulo || secao.tituloh1}
                  </h1>
                </div>
              </div>
            ) : (
              <h1 className="text-2xl md:text-4xl font-semibold text-gray-900">
                {secao.titulo || secao.tituloh1}
              </h1>
            )}
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4">
            <div
              className="text-lg text-[#444] leading-relaxed whitespace-pre-line"
              dangerouslySetInnerHTML={{
                __html: secao.textoPagina || "Conteúdo indisponível no momento.",
              }}
            />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
