import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import FavoritesList from "@/components/site/favoritosList";
import BreadCrumb from "@/components/site/filteredBreadcrumb";
import { Suspense } from "react";
import { getSecao } from "@/lib/actions/secoes";
import { Metadata } from "next/types";

export async function generateMetadata(): Promise<Metadata> {
  const secao = await getSecao(6);

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
          <div className="px-8 sm:px-10 md:px-0 w-full max-w-7xl">
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
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent" />
              <div className="absolute inset-y-0 left-0 flex items-center z-10 px-6">
                <h1 className="text-white text-2xl ml-10 md:text-4xl font-semibold">
                  Favoritos
                </h1>
              </div>
            </div>

            <FavoritesList />

            {/* Texto oculto apenas para SEO */}
            <div className="sr-only">
              <p>
                A seção de <strong>imóveis favoritos</strong> da TerraSul Imóveis foi criada para
                facilitar sua jornada na busca pelo imóvel ideal. Aqui, você salva os imóveis que
                mais chamaram sua atenção e pode revisitá-los a qualquer momento para comparar
                características, preços, tamanhos e localização.
              </p>
              <p>
                Nossa plataforma oferece uma experiência otimizada de navegação: ao adicionar
                imóveis aos favoritos, você pode acompanhar alterações de valores, verificar se
                novas fotos foram adicionadas e manter um histórico atualizado das opções que mais
                interessam. Isso torna o processo de escolha mais rápido e estratégico.
              </p>
              <p>
                Imóveis favoritos são úteis tanto para compradores quanto para investidores, pois
                permitem análise detalhada antes de uma tomada de decisão. Você pode revisar
                apartamentos, casas, coberturas, terrenos e imóveis comerciais salvos, sem
                precisar refazer filtros ou buscas.
              </p>
              <p>
                Se desejar, compartilhe sua lista de favoritos com familiares, amigos ou corretores
                da <strong>Imobiliária TerraSul</strong>. Nossa equipe está preparada para ajudar a
                agendar visitas, esclarecer dúvidas e orientar sobre financiamento, documentação e
                negociação.
              </p>
              <p>
                Ao manter seus imóveis salvos, você ganha tempo e organização. Cada favorito é uma
                oportunidade de investimento ou de conquistar o lar perfeito. Continue utilizando
                a função de favoritos para acompanhar lançamentos e imóveis exclusivos nas regiões
                mais valorizadas de Porto Alegre e da Grande Porto Alegre.
              </p>
              <p>
                A <strong>TerraSul Imóveis</strong> tem como missão oferecer tecnologia,
                transparência e credibilidade. Explore, salve e gerencie seus imóveis favoritos —
                seu próximo endereço pode estar entre eles.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
