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
  const secao = await getSecao(1)
 
  return {
    title: secao?.titulo,
    description: secao?.descricao,
    keywords: secao?.palavrasChave
  }
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
        {/* Header */}
        <Header></Header>
        <main className="flex-1 pb-8">
          <h1 className="sr-only">Imobiliária TerraSul - Encontre seu imóvel ideal</h1>
          <HeroSection imageUrl={imageHero?.imagem} subtitulo={imageHero?.subtitulo} titulo={imageHero?.titulo} url={imageHero?.url}></HeroSection>
          <SlideSection slides={slides}></SlideSection>
          <ChamadasNaHomeSection ></ChamadasNaHomeSection>
          <DestaquesSection destaques={destaques} />
          <MostSearched></MostSearched>
          <Footer></Footer>
        </main>
      </div>
    </ClientLayout>
  );
}