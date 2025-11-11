export const revalidate = 0;

import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import AnuncieForm from "@/components/site/anuncieForm";
import BreadCrumb from "@/components/site/filteredBreadcrumb";
import { Suspense } from "react";
import { getSecao } from "@/lib/actions/secoes";
import { Metadata } from "next/types";

export async function generateMetadata(): Promise<Metadata> {
  const secao = await getSecao(3);

  return {
    title: secao?.titulo,
    description: secao?.descricao,
    keywords: secao?.palavrasChave,
  };
}

export default async function AnuncieImovel() {
  const secao = await getSecao(3);

  if (!secao) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="shadow-lg">
        <Header />
      </div>

      <main className="flex-1">
        <section className="relative w-full py-8">
          <div className="w-full max-w-7xl mx-auto px-8 sm:px-10 md:px-0">
            <div className="rounded-sm mb-8">
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
                  <h2 className="text-white text-2xl md:text-4xl font-semibold">
                    {secao.titulo || secao.tituloh1}
                  </h2>
                </div>
              </div>
            ) : (
              <h2 className="text-2xl md:text-4xl font-semibold text-gray-900">
                {secao.titulo || secao.tituloh1}
              </h2>
            )}
          </div>
        </section>

        <section className="py-8 md:py-12">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-2xl md:text-3xl font-semibold text-[#111] mb-4">
              {secao.tituloh1 || "Anuncie seu imóvel"}
            </h1>

            <p className="text-lg text-[#444] leading-relaxed text-justify whitespace-pre-line mb-6">
              {secao.textoPagina?.trim()
                ? secao.textoPagina
                : `Anuncie seu imóvel com visibilidade e segurança. Nosso portal conecta vendedores e compradores 
                de forma prática, permitindo anúncios detalhados, fotos de alta qualidade e informações completas 
                sobre o imóvel. O processo é simples, rápido e garante que seu anúncio alcance as pessoas certas.`}
            </p>

            {/* Texto adicional para SEO */}
            <div className="space-y-4 text-[#444] leading-relaxed text-justify hidden">
              <p>
                Ao anunciar conosco, você garante que seu imóvel apareça nas primeiras páginas dos buscadores,
                com otimização de SEO, descrição completa e palavras-chave relacionadas ao mercado imobiliário.
                O Google identifica o conteúdo relevante e direciona potenciais compradores diretamente à sua página.
              </p>
              <p>
                Preencha o formulário abaixo com as informações do seu imóvel — localização, metragem, valor e
                características principais — e nossa equipe cuidará da publicação. Imóveis com descrições completas
                e boas fotos recebem até 3x mais visualizações e geram leads qualificados.
              </p>
              <p>
                Aproveite também para incluir detalhes sobre o bairro, proximidade de serviços e diferenciais como
                área gourmet, garagem, piscina ou segurança 24h. Essas informações aumentam a relevância do anúncio
                e ajudam o comprador a entender o valor real do imóvel.
              </p>
              <p>
                Dica importante: mantenha seu anúncio atualizado. Ajuste o preço, adicione novas fotos e revise a
                descrição sempre que necessário. Isso mantém o conteúdo fresco para os mecanismos de busca e
                melhora o ranqueamento da página.
              </p>
              <p>
                Nosso sistema foi desenvolvido para oferecer praticidade tanto para quem anuncia quanto para quem
                busca imóveis. Além da visibilidade orgânica, seus anúncios podem ser promovidos em campanhas
                específicas, alcançando ainda mais compradores interessados.
              </p>
              <p>
                A equipe de suporte está disponível para orientar sobre boas práticas de publicação, ajudando você
                a criar um anúncio atrativo e eficaz. Anunciar com qualidade é o primeiro passo para vender mais
                rápido e com segurança.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4">
          <AnuncieForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
