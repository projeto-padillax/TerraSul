import ChamadasNaHomeSection from "@/components/site/chamadasNaHomeSection";
import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import { HeroSection } from "@/components/site/heroSection";
import { MostSearched } from "@/components/site/mostSearched";
import SlideSection from "@/components/site/slideSection";
import { getRandomBannerImage } from "@/lib/actions/banner";
import { getDestaques } from "@/lib/actions/destaques";
import { getAllSlides } from "@/lib/actions/slide";
import { DestaquesSection } from "@/components/site/destaquesSection";
import ClientLayout from "@/components/client-layout";
import { Metadata } from "next/types";
import { getSecao } from "@/lib/actions/secoes";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const secao = await getSecao(1);

  return {
    title: secao?.titulo,
    description: secao?.descricao,
    keywords: secao?.palavrasChave,
  };
}

export default async function Home() {
  const [imageHero, slides, destaques] = await Promise.all([
    getRandomBannerImage(),
    getAllSlides(),
    getDestaques(),
  ]);

  return (
    <ClientLayout>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 pb-8">
          <h1 className="sr-only">
            Imobiliária TerraSul - Imóveis à Venda e Locação em Porto Alegre
          </h1>

          <HeroSection
            imageUrl={imageHero?.imagem}
            subtitulo={imageHero?.subtitulo}
            titulo={imageHero?.titulo}
            url={imageHero?.url}
          />
          <SlideSection slides={slides} />
          <ChamadasNaHomeSection />
          <DestaquesSection destaques={destaques} />
          <MostSearched />

          {/* Conteúdo otimizado para SEO */}
          <div className="sr-only">
            <h2>Imóveis em Porto Alegre e Região</h2>
            <p>
              A <strong>TerraSul Imóveis</strong> é referência no mercado imobiliário de Porto Alegre,
              oferecendo imóveis à venda e para locação em bairros como Tristeza, Cristal, Cavalhada, 
              Jardim Isabel, Ipanema, Petrópolis e Bela Vista. Nosso compromisso é conectar pessoas aos 
              seus objetivos imobiliários com segurança e transparência.
            </p>

            <h2>Apartamentos, Casas e Imóveis Comerciais</h2>
            <p>
              Trabalhamos com apartamentos, coberturas, casas, sobrados, terrenos, salas comerciais
              e lançamentos imobiliários. Cada imóvel é selecionado para garantir as melhores 
              oportunidades em localização e valorização no mercado imobiliário gaúcho.
            </p>

            <h3>Corretores Especializados</h3>
            <p>
              Nossa equipe de corretores credenciados no CRECI oferece atendimento personalizado e 
              suporte completo durante compra, venda ou locação de imóveis. Valorizamos o relacionamento 
              duradouro e a confiança com nossos clientes.
            </p>

            <h3>Tecnologia e Busca Inteligente</h3>
            <p>
              Nosso site oferece filtros inteligentes, tour virtual 360°, busca por bairros e tipos 
              de imóvel, além de sistema de favoritos para facilitar sua decisão de compra ou locação 
              em Porto Alegre e Grande Porto Alegre.
            </p>

            <h2>Por que escolher a TerraSul Imóveis</h2>
            <p>
              A Imobiliária TerraSul atua há anos no mercado com credibilidade e resultados comprovados. 
              Oferecemos consultoria personalizada, suporte para financiamento imobiliário, avaliação 
              gratuita de imóveis e gestão completa de locação. Explore nossos Destaques e Lançamentos 
              ou entre em contato para atendimento personalizado.
            </p>
          </div>

          <Footer />
        </main>
      </div>
    </ClientLayout>
  );
}