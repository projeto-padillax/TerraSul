export const revalidate = 0;

import Image from "next/image";
import Header from "@/components/site/header";
import Footer from "@/components/site/footer";
import ContatoForm from "@/components/site/contatoForm";
import BreadCrumb from "@/components/site/filteredBreadcrumb";
import { Suspense } from "react";
import { getSecao } from "@/lib/actions/secoes";
import { Metadata } from "next/types";

export async function generateMetadata(): Promise<Metadata> {
  const secao = await getSecao(4);

  return {
    title: secao?.titulo,
    description: secao?.descricao,
    keywords: secao?.palavrasChave,
  };
}

export default async function Contatos() {
  const secao = await getSecao(4);

  if (!secao) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <div className="shadow-lg">
        <Header />
      </div>

      <main className="flex-1">
        <section className="justify-items-center py-8">
          <div className="px-8 sm:px-10 md:px-0 w-full max-w-7xl">
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
              {secao.tituloh1 || "Fale conosco"}
            </h1>

            <p className="text-lg text-[#444] leading-relaxed whitespace-pre-line mb-6">
              {secao.textoPagina?.trim()
                ? secao.textoPagina
                : `Entre em contato com nossa equipe para tirar dúvidas, solicitar avaliações de imóveis,
agendar visitas ou obter suporte sobre anúncios. Atendemos proprietários, compradores e locatários com respostas rápidas e objetivas.`}
            </p>

            {/* Texto adicional para SEO (sem alterar CSS/estrutura) */}
            <div className="space-y-4 text-[#444] leading-relaxed hidden">
              <p>
                Se você quer vender ou alugar, informe dados essenciais: endereço, metragem, número de quartos e vagas,
                valor pretendido e diferenciais do imóvel. Quanto mais detalhes, mais assertivo será nosso retorno.
              </p>
              <p>
                Para quem busca um imóvel, descreva a região de interesse, faixa de preço, tipologia (casa, apartamento,
                sala comercial), metragem mínima, número de quartos/suítes e vagas. Assim filtramos as melhores opções.
              </p>
              <p>
                Canais de atendimento: formulário desta página, e-mail e telefone. Nosso time prioriza solicitações com
                informações completas e fotos atualizadas. Em caso de visita, indique sua disponibilidade de dias e horários.
              </p>
              <p>
                Política de privacidade e LGPD: tratamos seus dados apenas para responder à sua solicitação e intermediar
                o atendimento. Você pode pedir atualização ou exclusão a qualquer momento.
              </p>
              <p>
                Dúvidas frequentes: prazos para retorno, documentos necessários para avaliação, como anunciar um imóvel,
                como agendar visita e formas de pagamento de caução/garantia. Se preferir, descreva seu caso no campo de
                mensagem que retornamos com as instruções.
              </p>
              <p className="mb-0">
                Endereços e áreas de atendimento: trabalhamos com os principais bairros e empreendimentos da região. Caso
                seu imóvel esteja fora da área de atuação, indicamos parceiros qualificados para agilizar o processo.
              </p>
            </div>
          </div>
        </section>

        <div className="max-w-4xl mx-auto px-4">
          <ContatoForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
