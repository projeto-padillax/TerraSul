import Footer from "@/components/site/footer";
import Header from "@/components/site/header";
import ImovelContatoBox from "@/components/site/imovelContatoBox";
import { Dot, Home } from "lucide-react";
import GaleriaImagens from "@/components/site/galeriaImagens";
import { notFound } from "next/navigation";
import AgendamentoForm from "@/components/site/agendamentoForm";
import EmpreendimentoBox from "@/components/site/empreendimentoBox";
import CaracteristicasBox from "@/components/site/caracteristicasBox";
import MidiaBox from "@/components/site/midiaBox";
import SemelhantesSection from "@/components/site/semelhantesSection";
import FavoriteButton from "@/components/site/favoritosButton";
import BreadCrumb from "@/components/site/filteredBreadcrumb";
import LocalizacaoBox from "@/components/site/localizacaobox";
import { Metadata } from "next/dist/types";
import {
  formatBRL0,
  formatIntPtBR,
  formatNumberPtBR,
  isTerreno,
  lower,
  usaAreaTotalComoTerreno,
} from "@/utils/format";
import { Destaque } from "@/lib/types/destaque";
import "./page.css";
import FixedForm from "@/components/site/fixedForm";
import NewForm from "@/components/site/newForm";
import { cache } from "react";
import { prisma } from "@/lib/neon/db";
import {
  AreaIcon,
  DormitorioIcon,
  VagaIcon,
} from "@/components/site/imovelDetailIcons";

const getImovel = cache(async (codigo: string) => {
  const codigoUppercase = codigo.toUpperCase();
  const imovel = await prisma.imovel.findUnique({
    where: { id: codigoUppercase },
    include: {
      fotos: {
        select: { id: true, destaque: true, codigo: true, url: true, urlPequena: true },
        orderBy: { id: "asc" },
      },
      videos: { select: { id: true, destaque: true, video: true } },
      caracteristicas: { select: { nome: true, valor: true } },
      infraestrutura: { select: { nome: true, valor: true } },
      corretor: true,
    },
  });
  return imovel;
});

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tituloSite: string; codigo: string }>;
}): Promise<Metadata> {
  const { codigo } = await params;

  const imovel = await getImovel(codigo);
  if (!imovel) return { title: "Imóvel não encontrado" };

  const capitalizar = (str: string | null) =>
    str ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : "";
  let title = "";
  if (imovel.Categoria) {
    title += `${capitalizar(imovel.Categoria)} `;
  }
  if (imovel.Status == "VENDA") {
    title += `à venda em`;
  } else {
    title += `para alugar em`;
  }
  title += ` ${capitalizar(imovel.Cidade)} - ${imovel.Bairro}, `;
  if (imovel.Dormitorios && imovel.Dormitorios != "0") {
    title += `com ${imovel.Dormitorios} dormitórios, `;
  }
  if (imovel.Suites && imovel.Suites != "0") {
    title += `${imovel.Suites} suites `;
  }
  if (imovel.Vagas && imovel.Vagas != "0") {
    title += `e ${imovel.Vagas} vagas`;
  }
  title += `-${imovel.Codigo}`;

  return {
    title: title,
    description: imovel.Descricao + " - " + imovel.Codigo,
    openGraph: {
      images: [
        {
          url: imovel.FotoDestaque ?? "",
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export default async function ImovelPage({
  params,
}: {
  params: Promise<{ tituloSite: string; codigo: string }>;
}) {
  const { codigo } = await params;
  const imovelResult = await getImovel(codigo);

  if (!imovelResult) {
    return notFound();
  }

  const imovel = imovelResult;

  type FotoObj = { Foto: string };

  const imagensGaleria: { Foto: string }[] = (imovel.fotos ?? [])
    .map((foto: { url: string | null }) => ({ Foto: foto.url ?? "" }))
    .filter((f: FotoObj) => f.Foto !== imovel.FotoDestaque);

  const hasBadges =
    imovel.Lancamento === "Sim" ||
    imovel.EstudaDacao === "Sim" ||
    imovel.Exclusivo === "Sim";

  function gerarTitulo() {
    const capitalizar = (str: string) => {
      const palavras = str.split(" ");
      const novasPalavras = palavras.map(
        (x) => (x = x.charAt(0).toUpperCase() + x.slice(1).toLowerCase()),
      );
      return novasPalavras.join(" ");
    };

    let status = "";
    if (imovel.Status == "VENDA") {
      status += ` à venda`;
    } else {
      status += ` para alugar`;
    }

    let categoria = imovel.Categoria
      ? imovel.Categoria.split("/")[0]
      : "Imóvel";

    categoria += status;

    const area =
      imovel.AreaUtil || imovel.AreaTotal
        ? `${formatNumberPtBR(Number(imovel.AreaUtil || imovel.AreaTotal))}m²`
        : "";

    const quartos =
      imovel.Dormitorios && imovel.Dormitorios !== "0"
        ? `${imovel.Dormitorios} quarto${imovel.Dormitorios === "1" ? "" : "s"}`
        : "";

    const suites =
      imovel.Suites && imovel.Suites !== "0"
        ? `${imovel.Suites} suíte${imovel.Suites === "1" ? "" : "s"}`
        : "";

    const vagas =
      imovel.Vagas && imovel.Vagas !== "0"
        ? `${imovel.Vagas} vaga${imovel.Vagas === "1" ? "" : "s"}`
        : "";

    const bairro = imovel.Bairro
      ? `no bairro ${capitalizar(imovel.Bairro)}`
      : "";
    const cidade = imovel.Cidade ? `em ${capitalizar(imovel.Cidade)}` : "";

    const detalhes = [area && `com ${area}`, quartos, suites, vagas]
      .filter(Boolean)
      .join(", ");

    const localizacao = [bairro, cidade].filter(Boolean).join(" ");

    if (!detalhes) {
      return [categoria, localizacao].filter(Boolean).join(" ");
    }

    return [categoria, detalhes, localizacao].filter(Boolean).join(", ");
  }

  const parsePtBrCurrency = (v?: string | null) => {
    if (!v) return undefined;
    const s = v
      .replace(/[^\d.,-]/g, "")
      .replace(/\.(?=\d{3}(?:\D|$))/g, "")
      .replace(",", ".");

    if (!/\d/.test(s)) return undefined;

    const n = Number.parseFloat(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const valorAtual = imovel.ValorVenda || imovel.ValorLocacao || 0;
  const valorAnterior = parsePtBrCurrency(imovel.Desconto);
  const isRelease = imovel.Lancamento === "Sim";

  // Sítios e casas em condomínio não trazem AreaTerreno; usam AreaTotal como terreno.
  const areaTerreno = usaAreaTotalComoTerreno(imovel.Categoria)
    ? Number(imovel.AreaTotal ?? 0)
    : Number(imovel.AreaTerreno ?? 0);

  // Terreno exibe somente a área do terreno (sem dormitórios, área útil ou vagas).
  const terreno = isTerreno(imovel.Categoria);

  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <div className="shadow-lg">
        <Header />
      </div>
      <main className="flex-1 pb-8">
        <div className="py-4 justify-items-center">
          <section className="px-8 hidden md:block sm:px-10 md:px-0 w-full max-w-7xl mb-4">
            <div className="justify-between items-center">
              <nav className="text-sm text-gray-500">
                <BreadCrumb />
              </nav>
            </div>
          </section>

          <section
            id="main"
            className="px-8 sm:px-10 md:px-0 w-full max-w-7xl sm:mb-8 scroll-mt-6 scroll-smooth"
          >
            <GaleriaImagens
              imagens={imagensGaleria}
              principal={imovel.FotoDestaque ?? ""}
              video={
                Array.isArray(imovel?.videos)
                  ? imovel.videos
                      .filter(
                        (v: { video: string | null }) =>
                          typeof v.video === "string" && v.video.trim() !== "",
                      )
                      .map((v) => ({ url: v.video! }))
                  : []
              }
            />
          </section>

          <section className="px-8 sm:px-10 md:px-0 w-full max-w-7xl mb-8 mt-4 sm:mt-0">
            <div className="grid grid-cols-1 lg:grid-cols-[3fr_1.25fr] gap-6 lg:gap-8">
              <div className="space-y-8">
                <div className="space-y-4">
                  <h1 className="hidden sm:block text-lg sm:text-xl font-semibold title-mobile-small">
                    {gerarTitulo()}
                  </h1>

                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 sm:gap-x-4 sm:gap-y-4">
                    {hasBadges && (
                      <div className="flex gap-2 flex-wrap">
                        {[
                          imovel.Lancamento === "Sim" && "LANÇAMENTO",
                          imovel.EstudaDacao === "Sim" &&
                            "ESTUDA IMÓVEL NO NEGÓCIO",
                          imovel.Exclusivo === "Sim" && "EXCLUSIVO",
                        ]
                          .filter(Boolean)
                          .slice(0, 3)
                          .map((badge, i) => (
                            <span
                              key={i}
                              className="border border-site-primary bg-[#FFF8E6] text-black px-5 py-[6px] rounded-md text-xs font-medium"
                            >
                              {badge}
                            </span>
                          ))}
                      </div>
                    )}

                    {(imovel.ValorCondominio &&
                      parseFloat(imovel.ValorCondominio) > 0.1) ||
                    (imovel.ValorIptu && parseFloat(imovel.ValorIptu) > 0) ? (
                      <div className="flex items-center gap-0 sm:gap-2 text-xs text-black whitespace-nowrap">
                        {imovel.ValorCondominio && imovel.Codigo && (
                          <span>Código {imovel.Codigo}</span>
                        )}
                        <Dot
                          size={30}
                          className="text-gray-500 relative top-[1px]"
                        />
                        {imovel.ValorCondominio &&
                          parseFloat(imovel.ValorCondominio) > 0 && (
                            <span>
                              Cond R${" "}
                              {formatIntPtBR(
                                parseFloat(imovel.ValorCondominio),
                              )}
                              /mês
                            </span>
                          )}

                        {imovel.ValorCondominio &&
                          parseFloat(imovel.ValorCondominio) > 0 &&
                          imovel.ValorIptu &&
                          parseFloat(imovel.ValorIptu) > 0 && (
                            <Dot
                              size={30}
                              className="text-gray-500 relative top-[1px]"
                            />
                          )}

                        {imovel.ValorIptu &&
                          parseFloat(imovel.ValorIptu) > 0 && (
                            <span>
                              IPTU R${" "}
                              {formatIntPtBR(parseFloat(imovel.ValorIptu))}
                            </span>
                          )}
                      </div>
                    ) : null}

                    <div
                      className={`hidden sm:flex items-center gap-1 mt-0 ${
                        !hasBadges &&
                        (!imovel.ValorCondominio ||
                          parseFloat(imovel.ValorCondominio) === 0) &&
                        (!imovel.ValorIptu ||
                          parseFloat(imovel.ValorIptu) === 0)
                          ? ""
                          : "ml-4"
                      }`}
                    >
                      <FavoriteButton property={imovel as unknown as Destaque} />
                      <span>Salvar</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-y-2 sm:gap-y-0 sm:flex sm:flex-wrap items-center justify-center sm:items-end sm:justify-start text-sm text-grey mt-5 sm:mt-10">
                    {imovel.Categoria && (
                      <div className="flex flex-col items-center sm:mr-1">
                        <Home
                          size={26}
                          strokeWidth={1}
                          className="text-[#4D4D4D] opacity-70 sm:size-[30px]"
                        />
                        <span className="mt-1 sm:mt-2 text-center leading-5 capitalize">
                          {lower(imovel.Categoria ?? "")}
                        </span>
                      </div>
                    )}

                    {!terreno && Number(imovel.Dormitorios) > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-end sm:ml-2">
                        {" "}
                        <Dot
                          size={25}
                          className="text-site-primary hidden sm:inline-block mr-2"
                        />
                        <div className="flex flex-col items-center ml-1">
                          <DormitorioIcon className="opacity-70 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]" />
                          <span className="mt-1 sm:mt-2 text-center leading-5">
                            {imovel.Dormitorios} quarto
                            {Number(imovel.Dormitorios) > 1 ? "s" : ""}
                            {Number(imovel.Suites) > 0
                              ? ` (${imovel.Suites} suíte${
                                  Number(imovel.Suites) > 1 ? "s" : ""
                                })`
                              : ""}
                          </span>
                        </div>
                      </div>
                    )}

                    {areaTerreno > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-end sm:ml-2">
                        <Dot
                          size={25}
                          className="text-site-primary hidden sm:inline-block mx-2"
                        />
                        <div className="flex flex-col items-center ml-1">
                          <AreaIcon className="opacity-70 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]" />
                          <span className="mt-1 sm:mt-2 text-center leading-5">
                            {formatNumberPtBR(areaTerreno)} m² terreno
                          </span>
                        </div>
                      </div>
                    )}

                    {!terreno && (imovel.AreaUtil ?? 0) > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-end sm:ml-2">
                        <Dot
                          size={25}
                          className="text-site-primary hidden sm:inline-block mx-2"
                        />
                        <div className="flex flex-col items-center ml-1">
                          <AreaIcon className="opacity-70 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]" />
                          <span className="mt-1 sm:mt-2 text-center leading-5">
                            {formatNumberPtBR(Number(imovel.AreaUtil))} m² área
                          </span>
                        </div>
                      </div>
                    )}

                    {!terreno && Number(imovel.Vagas) > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-end sm:ml-2">
                        <Dot
                          size={25}
                          className="text-site-primary hidden sm:inline-block mx-2"
                        />
                        <div className="flex flex-col items-center ml-1">
                          <VagaIcon className="opacity-70 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]" />
                          <span className="mt-1 sm:mt-2 text-center leading-5">
                            {imovel.Vagas} vaga{Number(imovel.Vagas) > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="hidden sm:flex flex-col sm:flex-row sm:items-end sm:ml-2">
                      <Dot
                        size={25}
                        className="text-site-primary hidden sm:inline-block mx-2"
                      />
                      <div className="flex flex-col sm:items-start">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2">
                          {isRelease && (
                            <p className="text-xs text-[#303030] leading-none">
                              A partir de
                            </p>
                          )}

                          {typeof valorAnterior === "number" &&
                            valorAnterior > valorAtual && (
                              <span className="text-xs sm:text-sm text-gray-500 line-through leading-none">
                                {valorAnterior.toLocaleString("pt-BR", {
                                  style: "currency",
                                  currency: "BRL",
                                  minimumFractionDigits: 0,
                                })}
                              </span>
                            )}
                        </div>
                        <p className="text-xl sm:text-xl font-semibold text-[#303030] mt-0.5 mb-0.5 leading-5">
                          {valorAtual > 0
                            ? valorAtual.toLocaleString("pt-BR", {
                                style: "currency",
                                currency: "BRL",
                                minimumFractionDigits: 0,
                              })
                            : "Consultar"}
                        </p>
                      </div>
                    </div>

                    {imovel.Codigo && (
                      <div className="hidden sm:flex items-end sm:ml-2">
                        <Dot
                          size={25}
                          className="text-site-primary mx-2"
                        />
                        <span className="text-sm leading-5">
                          CÓDIGO {imovel.Codigo}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="sm:hidden my-4">
                  {imovel.Bairro && (
                    <div className="w-full text-center mb-3">
                      <span className="text-2xl font-semibold text-[#303030]">
                        {imovel.Bairro}
                      </span>
                    </div>
                  )}
                  <div className="border-t border-gray-200 mb-3" />
                  <div className="w-full flex items-baseline justify-center gap-3 text-center">
                    {typeof valorAnterior === "number" &&
                      valorAnterior > 0 &&
                      valorAnterior > valorAtual && (
                        <span className="text-sm text-gray-500 line-through">
                          {formatBRL0(valorAnterior)}
                        </span>
                      )}
                    <span className="text-2xl font-semibold text-[#303030]">
                      {formatBRL0(valorAtual)}
                    </span>
                  </div>
                  {imovel.Codigo && (
                    <p className="text-sm text-center mt-2">
                      CÓDIGO {imovel.Codigo}
                    </p>
                  )}
                </div>

                <div className="border-t"></div>

                <div>
                  <p className="text-gray-800 text-lg mb-8 whitespace-pre-line">
                    {imovel.Descricao}
                  </p>
                </div>

                <CaracteristicasBox
                  caracteristicas={imovel.caracteristicas}
                ></CaracteristicasBox>

                <EmpreendimentoBox
                  empreendimento={imovel.Empreendimento ?? ""}
                  imagem={imovel.FotoDestaque ?? ""}
                  infraestrutura={imovel.infraestrutura}
                />

                <AgendamentoForm
                  codigo={imovel.Codigo ?? ""}
                  codigoCorretor={imovel.corretor?.codigo ?? ""}
                />

                <NewForm
                  className="flex sm:hidden"
                  codigoImovel={imovel.Codigo ?? ""}
                  valor={imovel.ValorVenda || imovel.ValorLocacao || 0}
                  corretor={imovel.corretor ?? undefined}
                ></NewForm>

                <MidiaBox
                  imagens={imagensGaleria}
                  videos={
                    Array.isArray(imovel?.videos)
                      ? imovel.videos
                          .filter(
                            (v: { video: string | null }) =>
                              typeof v.video === "string" &&
                              v.video.trim() !== "",
                          )
                          .map((v) => ({ url: v.video! }))
                      : []
                  }
                />

                <LocalizacaoBox
                  bairro={imovel.Bairro ?? ""}
                  cidade={imovel.Cidade ?? ""}
                  endereco={imovel.Endereco ?? ""}
                  uf={imovel.UF ?? ""}
                />
              </div>
              <div className="block scroll-mt-6">
                <div className="lg:sticky lg:top-2 z-30" id="sendMessage">
                  <ImovelContatoBox
                    financiamento={
                      imovel.Status === "VENDA" ||
                      imovel.Status === "VENDA E ALUGUEL"
                    }
                    codigoImovel={imovel.Codigo ?? ""}
                    valor={imovel.ValorVenda || imovel.ValorLocacao || 0}
                    valorAnterior={valorAnterior ?? undefined}
                    corretor={imovel.corretor ?? undefined}
                    isRelease={imovel.Lancamento == "Sim"}
                  />
                </div>
                <NewForm
                  className="hidden sm:flex"
                  codigoImovel={imovel.Codigo ?? ""}
                  valor={imovel.ValorVenda || imovel.ValorLocacao || 0}
                  corretor={imovel.corretor ?? undefined}
                ></NewForm>
              </div>
            </div>

            <div>
              <SemelhantesSection codigo={imovel.Codigo ?? ""} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <FixedForm />
    </div>
  );
}
