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
import { formatBRL0, formatIntPtBR, lower } from "@/utils/format";
import "./page.css";
import FixedForm from "@/components/site/fixedForm";
import NewForm from "@/components/site/newForm";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ tituloSite: string; codigo: string }>;
}): Promise<Metadata> {
  const { codigo } = await params;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vista/imoveis/${codigo}`,
    {
      cache: "no-store",
    }
  );

  const capitalizar = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const imovel = await res.json();
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
          url: imovel.FotoDestaque,
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
  const parsedParams = await params.then((p) => ({
    codigo: p.codigo,
    tituloSite: p.tituloSite,
  }));
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/vista/imoveis/${parsedParams.codigo}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    return notFound();
  }

  const imovel = await res.json();

  type FotoObj = { Foto: string };

  const imagensGaleria: { Foto: string }[] = (imovel.fotos ?? [])
    .map((foto: { url: string }) => ({ Foto: foto.url }))
    .filter((f: FotoObj) => f.Foto !== imovel.FotoDestaque);

 

  const hasBadges =
    imovel.Lancamento === "Sim" ||
    imovel.EstudaDacao === "Sim" ||
    imovel.Exclusivo === "Sim";

  function gerarTitulo() {
    const capitalizar = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

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
        ? `${imovel.AreaUtil || imovel.AreaTotal}m²`
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

  const valorAtual = parseFloat(imovel.ValorVenda || imovel.ValorLocacao);
  const valorAnterior = parsePtBrCurrency(imovel.Desconto);
  const isRelease = imovel.Lancamento === "Sim";

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
              principal={imovel.FotoDestaque}
              video={
                Array.isArray(imovel?.videos)
                  ? imovel.videos
                      .filter(
                        (v: { video: string }): v is { video: string } =>
                          typeof v.video === "string" && v.video.trim() !== ""
                      )
                      .map((v: { video: string }) => ({ url: v.video }))
                  : []
              }
            />
          </section>

          <section className="px-8 sm:px-10 md:px-0 w-full max-w-7xl mb-8">
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
                        {imovel.ValorCondominio && imovel.Codigo > 0 && (
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
                                parseFloat(imovel.ValorCondominio)
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
                      <FavoriteButton property={imovel} />
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

                    {imovel.Dormitorios > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-end sm:ml-2">
                        {" "}
                        <Dot
                          size={25}
                          className="text-site-primary hidden sm:inline-block mr-2"
                        />
                        <div className="flex flex-col items-center ml-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 29 18"
                            className="opacity-70 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.12034 13.809C1.12034 14.4776 1.13806 15.0989 1.11611 15.7219C1.09585 16.2783 1.03169 16.8312 0.986953 17.3867C0.859481 17.4204 0.73117 17.4517 0.602854 17.4829C0.466097 17.2254 0.239011 16.9806 0.205244 16.7113C-0.273408 12.899 -0.200812 12.8247 3.64782 12.8247C11.2632 12.8247 18.8786 12.8272 26.4939 12.8272C26.9405 12.8272 27.3888 12.8272 27.805 12.8272C28.7901 8.82243 26.8021 6.98718 23.5536 7.07244C17.5287 7.23114 11.497 7.11465 5.46787 7.11802C2.42037 7.11887 1.4749 7.98078 1.10683 11.0418C1.07644 11.2891 0.953187 11.5255 0.842599 11.8581C-0.240487 11.2874 0.168943 10.3808 0.277842 9.69532C0.591878 7.73344 1.87504 6.72717 4.77903 6.04507C4.77903 4.78217 4.76805 3.47959 4.78156 2.17786C4.7976 0.594176 5.33365 0.0176031 6.88104 0.0133822C12.0019 -0.00350147 17.1235 -0.00350513 22.2469 0.00831343C23.8204 0.0116902 24.3843 0.571384 24.3894 2.1289C24.3911 3.15374 24.321 4.17943 24.2822 5.20595C24.0635 5.20342 23.8449 5.20173 23.6296 5.1992C23.5916 4.3643 23.5342 3.52941 23.5207 2.69535C23.492 1.03569 23.3671 0.888796 21.7463 0.887952C16.9412 0.882042 12.1361 0.914127 7.33183 0.866852C6.10354 0.85419 5.64262 1.26868 5.63756 2.51554C5.62405 6.2789 5.58691 6.27891 9.40092 6.23754C9.80444 6.23248 10.2071 6.2367 10.6883 6.2367C10.7415 5.80617 10.7685 5.46258 10.8293 5.12238C11.0277 3.99793 11.6498 3.33439 12.8452 3.32426C13.6168 3.31836 14.3867 3.32258 15.1583 3.32005C17.8284 3.31245 18.0774 3.51927 18.5147 6.24007C20.4293 6.24007 22.3701 6.23754 24.3117 6.24007C27.2326 6.24345 28.9666 7.94532 28.9893 10.8527C29.0054 12.6651 29.0054 14.4793 28.975 16.2909C28.9708 16.6792 28.8171 17.0642 28.7319 17.45C28.5563 17.4458 28.3798 17.4432 28.2043 17.439C28.1198 16.2504 28.0354 15.0601 27.9459 13.8124C19.0111 13.809 10.148 13.809 1.12034 13.809ZM17.2577 6.16578C17.4553 4.50781 17.2729 4.27482 15.7931 4.24865C14.981 4.23429 14.1663 4.24105 13.3534 4.25709C11.9005 4.28579 11.6895 4.56099 11.9335 6.16578C13.6674 6.16578 15.4149 6.16578 17.2577 6.16578Z"
                              fill="#4D4D4D"
                            />
                          </svg>
                          <span className="mt-1 sm:mt-2 text-center leading-5">
                            {imovel.Dormitorios} quarto
                            {imovel.Dormitorios > 1 ? "s" : ""}
                            {imovel.Suites > 0
                              ? ` (${imovel.Suites} suíte${
                                  imovel.Suites > 1 ? "s" : ""
                                })`
                              : ""}
                          </span>
                        </div>
                      </div>
                    )}

                    {imovel.AreaPrivativa > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-end sm:ml-2">
                        <Dot
                          size={25}
                          className="text-site-primary hidden sm:inline-block mx-2"
                        />
                        <div className="flex flex-col items-center ml-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 29 30"
                            className="opacity-70 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M14.5 4.07391C17.6105 4.07291 20.7201 4.1047 23.8296 4.05306C24.7513 4.03816 25.0045 4.36689 24.9996 5.2359C24.9708 11.3805 24.9618 17.5251 24.9887 23.6698C24.9926 24.6599 24.7672 25.0691 23.6588 25.0572C17.5907 25.0046 11.5215 25.0105 5.45238 25.0512C4.39467 25.0592 3.98351 24.799 3.99245 23.6638C4.04012 17.5579 4.03416 11.45 3.99444 5.34315C3.98848 4.35 4.27053 4.03319 5.28255 4.05306C8.35437 4.11562 11.4282 4.07589 14.5 4.07391ZM5.1594 23.8158C11.451 23.8158 17.6115 23.8158 23.7989 23.8158C23.7989 17.5738 23.7989 11.4202 23.7989 5.26569C17.54 5.26569 11.3785 5.26569 5.1594 5.26569C5.1594 11.4838 5.1594 17.6106 5.1594 23.8158Z"
                              fill="#4D4D4D"
                            />

                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M27.6761 5.18822C27.4487 5.18822 27.1825 5.26371 27.0058 5.17035C26.7207 5.01939 26.4943 4.7562 26.244 4.5397C26.5003 4.38576 26.7386 4.15535 27.0137 4.09675C27.3732 4.01929 27.7774 4.01333 28.135 4.09477C28.4429 4.16429 28.711 4.40066 28.998 4.56353C28.707 4.77309 28.427 5.00251 28.1191 5.18227C28.0079 5.24782 27.8241 5.19319 27.6751 5.19319C27.6761 5.19021 27.6761 5.18822 27.6761 5.18822Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M27.5709 25.0155C27.3067 25.0155 27.0058 25.0919 26.7863 24.9926C26.5618 24.8893 26.3394 24.6351 26.2718 24.4027C26.2421 24.2934 26.5718 23.9667 26.7664 23.9379C27.2491 23.8644 27.7566 23.8465 28.2363 23.923C28.5074 23.9647 28.7478 24.2319 29 24.3987C28.7517 24.6073 28.5253 24.8665 28.2423 25.0105C28.0615 25.1019 27.7963 25.0274 27.5699 25.0274C27.5709 25.0224 27.5709 25.0184 27.5709 25.0155Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M23.7164 27.6215C23.9329 27.1637 24.1624 26.3125 24.358 26.3195C25.2479 26.3543 24.9102 27.1627 24.9857 27.701C25.0055 27.846 25.0363 28.0218 24.9767 28.1429C24.8178 28.4726 24.6132 28.7815 24.4265 29.0963C24.2488 28.7815 24.0521 28.4726 23.9022 28.1439C23.8446 28.0188 23.8932 27.848 23.8932 27.7C23.8346 27.6732 23.777 27.6463 23.7164 27.6215Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.42318 5.18424C1.19675 5.18424 0.931578 5.25972 0.753804 5.16736C0.471749 5.02136 0.248288 4.76116 0 4.54962C0.250274 4.39071 0.483666 4.15335 0.755789 4.09277C1.11531 4.01332 1.52051 4.01034 1.87904 4.09078C2.19089 4.15931 2.46699 4.38972 2.75897 4.54862C2.465 4.76215 2.18196 4.99454 1.87011 5.17728C1.75788 5.24283 1.57414 5.18821 1.42318 5.18821V5.18424Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.44105 23.921C1.70523 23.921 1.99224 23.8565 2.22563 23.9399C2.43419 24.0154 2.75598 24.3044 2.72619 24.4126C2.65964 24.642 2.42526 24.944 2.21173 24.9897C1.77871 25.084 1.30002 25.0919 0.864028 25.0085C0.556151 24.9509 0.287004 24.6857 0.000976562 24.5139C0.29197 24.3093 0.56906 24.0779 0.881902 23.917C1.03187 23.8396 1.25235 23.9031 1.44105 23.9031C1.44105 23.9081 1.44105 23.9161 1.44105 23.921Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29347 27.7417C5.06108 28.1916 4.82868 28.6385 4.59628 29.0874C4.40162 28.5829 4.19604 28.0843 4.01926 27.5748C3.97258 27.4408 3.96365 27.2501 4.02423 27.1279C4.17519 26.822 4.3758 26.541 4.55754 26.251C4.74028 26.5281 4.95381 26.7913 5.09285 27.0882C5.16535 27.2431 5.10477 27.4606 5.10477 27.6493C5.16734 27.6801 5.23091 27.7099 5.29347 27.7417Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.09984 1.41822C5.09984 1.68141 5.17134 1.97239 5.07997 2.19883C4.9886 2.42428 4.73535 2.58319 4.5536 2.77089C4.38477 2.60305 4.10073 2.45407 4.07093 2.26538C3.99545 1.78767 3.96566 1.28017 4.05207 0.810413C4.1057 0.51644 4.40562 0.269144 4.59532 0C4.76713 0.284041 4.96875 0.556163 5.09885 0.858081C5.16638 1.01698 5.11077 1.23052 5.11077 1.41822C5.10679 1.41822 5.10282 1.41822 5.09984 1.41822Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M23.9022 1.42418C23.9022 1.16 23.8357 0.872977 23.9191 0.639586C24.0055 0.399244 24.2389 0.211541 24.4067 0C24.5994 0.227432 24.9083 0.430037 24.9609 0.685276C25.0513 1.11829 25.0374 1.595 24.9539 2.03099C24.9013 2.29616 24.6332 2.51863 24.4623 2.76096C24.2736 2.50373 24.0532 2.2624 23.9101 1.98134C23.8337 1.83038 23.8962 1.61089 23.8962 1.42219C23.8972 1.42418 23.9002 1.42418 23.9022 1.42418Z"
                              fill="#4D4D4D"
                            />
                          </svg>
                          <span className="mt-1 sm:mt-2 text-center leading-5">
                            {imovel.AreaPrivativa} m² privativos
                          </span>
                        </div>
                      </div>
                    )}

                    {imovel.AreaUtil > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-end sm:ml-2">
                        <Dot
                          size={25}
                          className="text-site-primary hidden sm:inline-block mx-2"
                        />
                        <div className="flex flex-col items-center ml-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 29 30"
                            className="opacity-70 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M14.5 4.07391C17.6105 4.07291 20.7201 4.1047 23.8296 4.05306C24.7513 4.03816 25.0045 4.36689 24.9996 5.2359C24.9708 11.3805 24.9618 17.5251 24.9887 23.6698C24.9926 24.6599 24.7672 25.0691 23.6588 25.0572C17.5907 25.0046 11.5215 25.0105 5.45238 25.0512C4.39467 25.0592 3.98351 24.799 3.99245 23.6638C4.04012 17.5579 4.03416 11.45 3.99444 5.34315C3.98848 4.35 4.27053 4.03319 5.28255 4.05306C8.35437 4.11562 11.4282 4.07589 14.5 4.07391ZM5.1594 23.8158C11.451 23.8158 17.6115 23.8158 23.7989 23.8158C23.7989 17.5738 23.7989 11.4202 23.7989 5.26569C17.54 5.26569 11.3785 5.26569 5.1594 5.26569C5.1594 11.4838 5.1594 17.6106 5.1594 23.8158Z"
                              fill="#4D4D4D"
                            />

                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M27.6761 5.18822C27.4487 5.18822 27.1825 5.26371 27.0058 5.17035C26.7207 5.01939 26.4943 4.7562 26.244 4.5397C26.5003 4.38576 26.7386 4.15535 27.0137 4.09675C27.3732 4.01929 27.7774 4.01333 28.135 4.09477C28.4429 4.16429 28.711 4.40066 28.998 4.56353C28.707 4.77309 28.427 5.00251 28.1191 5.18227C28.0079 5.24782 27.8241 5.19319 27.6751 5.19319C27.6761 5.19021 27.6761 5.18822 27.6761 5.18822Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M27.5709 25.0155C27.3067 25.0155 27.0058 25.0919 26.7863 24.9926C26.5618 24.8893 26.3394 24.6351 26.2718 24.4027C26.2421 24.2934 26.5718 23.9667 26.7664 23.9379C27.2491 23.8644 27.7566 23.8465 28.2363 23.923C28.5074 23.9647 28.7478 24.2319 29 24.3987C28.7517 24.6073 28.5253 24.8665 28.2423 25.0105C28.0615 25.1019 27.7963 25.0274 27.5699 25.0274C27.5709 25.0224 27.5709 25.0184 27.5709 25.0155Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M23.7164 27.6215C23.9329 27.1637 24.1624 26.3125 24.358 26.3195C25.2479 26.3543 24.9102 27.1627 24.9857 27.701C25.0055 27.846 25.0363 28.0218 24.9767 28.1429C24.8178 28.4726 24.6132 28.7815 24.4265 29.0963C24.2488 28.7815 24.0521 28.4726 23.9022 28.1439C23.8446 28.0188 23.8932 27.848 23.8932 27.7C23.8346 27.6732 23.777 27.6463 23.7164 27.6215Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.42318 5.18424C1.19675 5.18424 0.931578 5.25972 0.753804 5.16736C0.471749 5.02136 0.248288 4.76116 0 4.54962C0.250274 4.39071 0.483666 4.15335 0.755789 4.09277C1.11531 4.01332 1.52051 4.01034 1.87904 4.09078C2.19089 4.15931 2.46699 4.38972 2.75897 4.54862C2.465 4.76215 2.18196 4.99454 1.87011 5.17728C1.75788 5.24283 1.57414 5.18821 1.42318 5.18821V5.18424Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.44105 23.921C1.70523 23.921 1.99224 23.8565 2.22563 23.9399C2.43419 24.0154 2.75598 24.3044 2.72619 24.4126C2.65964 24.642 2.42526 24.944 2.21173 24.9897C1.77871 25.084 1.30002 25.0919 0.864028 25.0085C0.556151 24.9509 0.287004 24.6857 0.000976562 24.5139C0.29197 24.3093 0.56906 24.0779 0.881902 23.917C1.03187 23.8396 1.25235 23.9031 1.44105 23.9031C1.44105 23.9081 1.44105 23.9161 1.44105 23.921Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.29347 27.7417C5.06108 28.1916 4.82868 28.6385 4.59628 29.0874C4.40162 28.5829 4.19604 28.0843 4.01926 27.5748C3.97258 27.4408 3.96365 27.2501 4.02423 27.1279C4.17519 26.822 4.3758 26.541 4.55754 26.251C4.74028 26.5281 4.95381 26.7913 5.09285 27.0882C5.16535 27.2431 5.10477 27.4606 5.10477 27.6493C5.16734 27.6801 5.23091 27.7099 5.29347 27.7417Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M5.09984 1.41822C5.09984 1.68141 5.17134 1.97239 5.07997 2.19883C4.9886 2.42428 4.73535 2.58319 4.5536 2.77089C4.38477 2.60305 4.10073 2.45407 4.07093 2.26538C3.99545 1.78767 3.96566 1.28017 4.05207 0.810413C4.1057 0.51644 4.40562 0.269144 4.59532 0C4.76713 0.284041 4.96875 0.556163 5.09885 0.858081C5.16638 1.01698 5.11077 1.23052 5.11077 1.41822C5.10679 1.41822 5.10282 1.41822 5.09984 1.41822Z"
                              fill="#4D4D4D"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M23.9022 1.42418C23.9022 1.16 23.8357 0.872977 23.9191 0.639586C24.0055 0.399244 24.2389 0.211541 24.4067 0C24.5994 0.227432 24.9083 0.430037 24.9609 0.685276C25.0513 1.11829 25.0374 1.595 24.9539 2.03099C24.9013 2.29616 24.6332 2.51863 24.4623 2.76096C24.2736 2.50373 24.0532 2.2624 23.9101 1.98134C23.8337 1.83038 23.8962 1.61089 23.8962 1.42219C23.8972 1.42418 23.9002 1.42418 23.9022 1.42418Z"
                              fill="#4D4D4D"
                            />
                          </svg>
                          <span className="mt-1 sm:mt-2 text-center leading-5">
                            {imovel.AreaUtil} m² úteis
                          </span>
                        </div>
                      </div>
                    )}

                    {imovel.Vagas > 0 && (
                      <div className="flex flex-col sm:flex-row sm:items-end sm:ml-2">
                        <Dot
                          size={25}
                          className="text-site-primary hidden sm:inline-block mx-2"
                        />
                        <div className="flex flex-col items-center ml-1">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 29 21"
                            className="opacity-70 w-[26px] h-[26px] sm:w-[30px] sm:h-[30px]"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M29 11.267C29 11.4919 29 11.7183 29 11.9431C28.9918 11.9725 28.9853 12.0044 28.9779 12.0338C28.9011 12.4083 28.8545 12.7909 28.7392 13.1514C28.4629 14.0245 27.952 14.7471 27.2604 15.3464C27.217 15.3831 27.168 15.4445 27.168 15.496C27.1623 16.4304 27.1663 17.3631 27.1623 18.2984C27.1606 18.4578 27.1443 18.6213 27.1108 18.7766C26.9137 19.7061 26.124 20.3503 25.1782 20.356C24.5454 20.3601 23.9127 20.3642 23.2816 20.3503C23.0927 20.3462 22.8949 20.3086 22.7159 20.2473C21.954 19.9832 21.4128 19.2499 21.3883 18.4422C21.3711 17.8495 21.3825 17.2585 21.3801 16.6658C21.3801 16.62 21.3801 16.5742 21.3801 16.526C16.7849 16.526 12.2077 16.526 7.61992 16.526C7.61992 16.5792 7.61992 16.6225 7.61992 16.6658C7.61828 17.2462 7.62973 17.825 7.61419 18.4055C7.58558 19.4551 6.72476 20.3846 5.59906 20.3601C5.01945 20.3454 4.43902 20.3585 3.85941 20.356C3.75804 20.356 3.65668 20.356 3.55776 20.3413C2.56777 20.1909 1.84509 19.3636 1.83774 18.358C1.82956 17.4212 1.83447 16.4827 1.83774 15.5442C1.83774 15.4608 1.81812 15.406 1.75272 15.3513C0.904153 14.627 0.351519 13.7228 0.112809 12.6331C0.0629417 12.4058 0.0367875 12.1736 0 11.9439C0 11.7101 0 11.4771 0 11.2433C0.0073575 11.2123 0.0171621 11.182 0.0212496 11.151C0.144692 9.89527 0.674435 8.8407 1.59412 7.98151C1.66116 7.91938 1.67587 7.87687 1.62846 7.79185C1.3922 7.37002 1.1633 6.94573 0.934401 6.51982C0.549358 5.80532 1.06683 4.95185 1.85981 4.97392C2.70919 4.99845 3.55858 4.97801 4.40878 4.98128C4.49216 4.98128 4.5363 4.95839 4.57391 4.87991C4.82652 4.35017 5.08648 3.8237 5.34073 3.29478C5.55082 2.85905 5.76092 2.42495 6.05767 2.03909C7.06647 0.731094 8.38428 0.0133291 10.0471 0.00678906C13.0522 -0.00547344 16.0565 0.00106521 19.0592 0.00924021C19.3707 0.0100577 19.6895 0.0484829 19.9928 0.11797C21.5477 0.4744 22.675 1.39572 23.4099 2.79774C23.7672 3.47871 24.0868 4.17686 24.4187 4.86928C24.4604 4.95512 24.507 4.98209 24.6018 4.98209C25.4635 4.97801 26.3251 4.97882 27.1868 4.98046C27.6209 4.98046 27.9822 5.23634 28.1277 5.64509C28.2389 5.95901 28.2062 6.26149 28.046 6.55252C27.8048 6.99724 27.5628 7.44277 27.3168 7.89403C27.3495 7.92592 27.3764 7.95289 27.4067 7.97905C28.1719 8.69191 28.6689 9.55682 28.8913 10.5795C28.9411 10.8051 28.9648 11.0373 29 11.267ZM14.4935 15.8777C17.6506 15.8777 20.8086 15.8802 23.9658 15.872C24.3288 15.8712 24.6999 15.8344 25.0547 15.7543C27.1941 15.2654 28.6362 13.1694 28.3141 11.0136C28.0999 9.58708 27.3454 8.52024 26.084 7.82209C25.5935 7.55068 25.067 7.35448 24.5005 7.35366C17.8321 7.34712 11.163 7.34958 4.49298 7.34958C4.44066 7.34958 4.38833 7.35121 4.33683 7.35775C3.8496 7.42561 3.39017 7.5752 2.95281 7.79838C0.67362 8.95923 -0.0727583 11.9456 1.40937 14.0294C2.28491 15.2605 3.4989 15.872 5.00801 15.8753C8.17173 15.8802 11.333 15.8777 14.4935 15.8777ZM4.41859 6.68168C11.1425 6.68168 17.8575 6.68168 24.5773 6.68168C24.5691 6.66042 24.5634 6.63753 24.5536 6.61709C23.9805 5.43499 23.4377 4.2349 22.8222 3.07405C21.9932 1.51017 20.6803 0.656705 18.8867 0.647713C15.9633 0.633815 13.0391 0.644439 10.1157 0.643621C9.61298 0.643621 9.12085 0.712296 8.6467 0.884788C7.47522 1.31071 6.63973 2.10858 6.09609 3.21956C5.55082 4.33545 5.01046 5.45543 4.46845 6.57295C4.44965 6.60811 4.43494 6.64489 4.41859 6.68168ZM2.48684 15.8949C2.4852 15.9055 2.47948 15.9211 2.47948 15.9366C2.48029 16.7582 2.47457 17.5798 2.48684 18.4022C2.49665 19.0276 3.00676 19.7249 3.85124 19.7167C4.43494 19.7102 5.01863 19.7208 5.60233 19.7118C5.76092 19.7085 5.92606 19.6881 6.07566 19.6358C6.63074 19.442 6.97327 18.9156 6.97736 18.2681C6.98063 17.7261 6.97818 17.1808 6.97736 16.6388C6.97736 16.6004 6.97245 16.5612 6.96918 16.517C6.91032 16.517 6.867 16.517 6.82285 16.517C6.21054 16.517 5.59824 16.5146 4.98593 16.5187C4.43739 16.5211 3.90111 16.4492 3.38445 16.266C3.08443 16.159 2.7934 16.0233 2.48684 15.8949ZM22.0275 16.5162C22.0275 17.1539 22.0136 17.7694 22.03 18.3858C22.0455 19.0529 22.5753 19.7478 23.4663 19.7184C24.0222 19.6996 24.5773 19.7069 25.1332 19.7159C26.0022 19.7306 26.5066 19.012 26.514 18.3924C26.5238 17.574 26.5197 16.7574 26.5197 15.9399C26.5197 15.9219 26.5123 15.9039 26.5099 15.89C26.4968 15.8875 26.4919 15.8835 26.4895 15.8851C26.4633 15.8982 26.438 15.9096 26.4134 15.9211C25.6875 16.3126 24.9125 16.5154 24.0876 16.5162C23.4516 16.5162 22.8148 16.5162 22.1788 16.5162C22.1322 16.5162 22.0848 16.5162 22.0275 16.5162ZM4.20522 5.6361C4.18723 5.62547 4.18315 5.62138 4.18069 5.62138C3.38772 5.62138 2.59392 5.61811 1.80013 5.62138C1.63254 5.6222 1.5279 5.72438 1.47231 5.87971C1.4249 6.01133 1.45597 6.13232 1.52137 6.25004C1.73228 6.63508 1.94074 7.01931 2.15084 7.40517C2.16637 7.43296 2.18436 7.45831 2.2048 7.49264C2.63235 7.21142 3.08688 7.00459 3.57247 6.86398C3.59536 6.85744 3.62234 6.83374 3.63215 6.81166C3.82426 6.4209 4.01392 6.03095 4.20522 5.6361ZM24.7874 5.61975C24.9526 5.95983 25.1169 6.27211 25.255 6.59666C25.3343 6.78305 25.4496 6.88033 25.6442 6.93674C26.0554 7.0561 26.4322 7.25475 26.7927 7.48937C26.8058 7.4722 26.8189 7.46076 26.8254 7.44768C27.0486 7.03811 27.2693 6.62772 27.4958 6.21979C27.6405 5.95574 27.4786 5.6083 27.1287 5.61566C26.4486 5.63037 25.7676 5.61975 25.0883 5.61975C24.9967 5.61975 24.9035 5.61975 24.7874 5.61975Z"
                              fill="#4D4D4D"
                            />
                          </svg>
                          <span className="mt-1 sm:mt-2 text-center leading-5">
                            {imovel.Vagas} vaga{imovel.Vagas > 1 ? "s" : ""}
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
                  </div>
                </div>

                <div className="sm:hidden my-4">
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
                  empreendimento={imovel.Empreendimento}
                  imagem={imovel.FotoDestaque}
                  infraestrutura={imovel.infraestrutura}
                />

                <AgendamentoForm
                  codigo={imovel.Codigo}
                  codigoCorretor={imovel.corretor?.codigo}
                />

                <NewForm
                  className="flex sm:hidden"
                  codigoImovel={imovel.Codigo}
                  valor={parseFloat(imovel.ValorVenda || imovel.ValorLocacao)}
                  corretor={imovel.corretor}
                ></NewForm>

                <MidiaBox
                  imagens={imagensGaleria}
                  videos={
                    Array.isArray(imovel?.videos)
                      ? imovel.videos
                          .filter(
                            (v: { video: string }): v is { video: string } =>
                              typeof v.video === "string" &&
                              v.video.trim() !== ""
                          )
                          .map((v: { video: string }) => ({ url: v.video }))
                      : []
                  }
                />

                <LocalizacaoBox
                  bairro={imovel.Bairro}
                  cidade={imovel.Cidade}
                  endereco={imovel.endereco}
                  numero={imovel.numero}
                  uf={imovel.uf}
                  cep={imovel.cep}
                />
              </div>
              <div className="block scroll-mt-6">
                <div className="lg:sticky lg:top-2 z-30" id="sendMessage">
                  <ImovelContatoBox
                    financiamento={
                      imovel.Status === "VENDA" ||
                      imovel.Status === "VENDA E ALUGUEL"
                    }
                    codigoImovel={imovel.Codigo}
                    valor={parseFloat(imovel.ValorVenda || imovel.ValorLocacao)}
                    valorAnterior={valorAnterior ?? undefined}
                    corretor={imovel.corretor}
                    isRelease={imovel.Lancamento == "Sim"}
                  />
                </div>
                <NewForm
                  className="hidden sm:flex"
                  codigoImovel={imovel.Codigo}
                  valor={parseFloat(imovel.ValorVenda || imovel.ValorLocacao)}
                  corretor={imovel.corretor}
                ></NewForm>
              </div>
            </div>

            <div>
              <SemelhantesSection codigo={imovel.Codigo} />
            </div>
          </section>
        </div>
      </main>
      <Footer />
      <FixedForm />
    </div>
  );
}
