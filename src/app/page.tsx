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
            Imobiliária TerraSul - Encontre seu imóvel ideal em Porto Alegre e região
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

          {/* Texto oculto apenas para SEO */}
          <div className="sr-only">
            <p>
              A <strong>TerraSul Imóveis</strong> é referência no mercado imobiliário de Porto Alegre,
              oferecendo uma ampla variedade de imóveis à venda e para locação nas principais regiões
              da cidade e da Grande Porto Alegre. Nosso compromisso é conectar pessoas aos seus
              objetivos, seja encontrar o lar ideal, investir com segurança ou comercializar com
              agilidade.
            </p>
            <p>
              Trabalhamos com apartamentos, coberturas, casas, sobrados, terrenos, salas comerciais
              e lançamentos, sempre prezando pela qualidade e transparência nas negociações. Cada
              imóvel é cuidadosamente selecionado para garantir as melhores oportunidades em
              localização, valor e potencial de valorização.
            </p>
            <p>
              Nossa equipe de corretores é formada por profissionais credenciados, preparados para
              atender com agilidade e ética, oferecendo suporte completo durante todas as etapas da
              compra, venda ou locação. Valorizamos o atendimento humanizado e o relacionamento
              duradouro com nossos clientes.
            </p>
            <p>
              Acreditamos que a tecnologia é uma aliada essencial na busca pelo imóvel ideal. Por isso,
              nosso site foi desenvolvido para proporcionar uma experiência intuitiva e eficiente:
              filtros inteligentes, tour virtual, busca por bairros e tipos de imóvel, além de um
              sistema de favoritos para facilitar comparações e decisões.
            </p>
            <p>
              Entre as regiões mais procuradas de Porto Alegre estão bairros tradicionais como
              Tristeza, Cristal, Cavalhada, Jardim Isabel, Ipanema, Petrópolis e Bela Vista. Cada um
              oferece características únicas, desde áreas residenciais tranquilas até zonas com intensa
              vida comercial e cultural.
            </p>
            <p>
              Se você está buscando um novo imóvel, explore nossas seções de Destaques, Lançamentos e
              Mais Procurados. Lá você encontra as melhores ofertas atualizadas diariamente. E, se
              preferir, entre em contato para receber uma consultoria personalizada conforme seu perfil
              e necessidades.
            </p>
            <p>
              A <strong>Imobiliária TerraSul</strong> atua há anos no mercado imobiliário gaúcho com
              credibilidade e resultados comprovados. Nosso objetivo é tornar a jornada de compra ou
              venda de um imóvel mais simples, segura e transparente. Seja bem-vindo ao seu novo
              começo com a TerraSul Imóveis.
            </p>
          </div>

          <Footer />
        </main>
      </div>
    </ClientLayout>
  );
}
