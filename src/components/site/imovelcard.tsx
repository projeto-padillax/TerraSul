import Image from "next/image";
import FavoriteButton from "./favoritosButton";
import { CodigoImobiliariaIcon } from "../ui/codigoImobiliariaIcon";
import { Destaque } from "@/lib/types/destaque";
import ImageBadge from "./imageBadge";
import { formatNumberPtBR, isSitio, isTerreno } from "@/utils/format";
import { AreaIcon, DormitorioIcon, VagaIcon } from "./imovelDetailIcons";

interface PropertyCardProps {
  imovel: Destaque;
  activeTab: string;
}

export function ImovelCard({ imovel, activeTab }: PropertyCardProps) {
  const capitalizeCategory = (category: string) => {
    return category
      .toLowerCase()
      .split("/")
      .map((part) =>
        part
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
      )
      .join("/");
  };

  const sitio = isSitio(imovel.Categoria);
  const terreno = isTerreno(imovel.Categoria);

  const areas = [imovel.AreaUtil, imovel.AreaTotal];
  const area = areas.find((a) => Number(a) > 0);

  const hasAreaTerreno = Number(imovel.AreaTerreno) > 0;
  // Terreno exibe apenas a área do terreno; oculta dormitórios, área útil e vagas.
  const hasDormitorios = !terreno && Number(imovel.Dormitorios) > 0;
  const hasAreaUtil = Number(imovel.AreaUtil) > 0;
  const hasAreaTotal = Number(imovel.AreaTotal) > 0;
  // Sítio destaca área útil e total e omite vagas; demais tipos mantêm vagas.
  const hasVagas = !sitio && !terreno && Number(imovel.Vagas) > 0;
  const hasAnyDetail = terreno
    ? hasAreaTerreno
    : sitio
    ? hasDormitorios || hasAreaUtil || hasAreaTotal
    : area || hasDormitorios || hasVagas;

  const fmtBRL = (n: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);

  // Converte "R$ 1.234.567,89" -> 1234567.89
  const parsePtBrCurrency = (v?: string | null) => {
    if (!v) return undefined;
    const s = v
      .toString()
      .replace(/[^\d.,]/g, "")
      .replace(/\.(?=\d{3}(?:\D|$))/g, "")
      .replace(",", ".");
    const n = Number(s);
    return Number.isFinite(n) ? n : undefined;
  };

  const resolveCurrentValue = (): number | undefined => {
    if (activeTab === "Alugar") {
      return typeof imovel.ValorLocacao === "number" && imovel.ValorLocacao > 0
        ? imovel.ValorLocacao
        : undefined;
    }
    if (activeTab === "Comprar") {
      return typeof imovel.ValorVenda === "number" && imovel.ValorVenda > 0
        ? imovel.ValorVenda
        : undefined;
    }
    // Lançamentos ou outros: prioriza venda, senão locação
    if (typeof imovel.ValorVenda === "number" && imovel.ValorVenda > 0) return imovel.ValorVenda;
    if (typeof imovel.ValorLocacao === "number" && imovel.ValorLocacao > 0) return imovel.ValorLocacao;
    return undefined;
  };

  const valorAtual = resolveCurrentValue();
  const valorAnterior = parsePtBrCurrency(imovel.Desconto);
  const mostrarAnterior =
    typeof valorAtual === "number" &&
    valorAtual > 0 &&
    typeof valorAnterior === "number" &&
    valorAnterior > valorAtual;

  const priceNode =
    typeof valorAtual === "number" && valorAtual > 0 ? (
      <div className="flex flex-col items-end leading-tight">
        {mostrarAnterior && (
          <span className="text-xs text-gray-500 line-through">
            {fmtBRL(valorAnterior!)}
          </span>
        )}
        <span className="text-lg text-[#303030]">
          {fmtBRL(valorAtual)}
        </span>
      </div>
    ) : (
      <span className="text-lg text-[#303030]">Consulte</span>
    );
    
  return (
    <div className="w-full overflow-hidden shadow-lg bg-white rounded-md transition-colors duration-200 hover:bg-gray-50 cursor-pointer">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={imovel.FotoDestaque}
          alt={imovel.Bairro}
          fill
          className="object-cover rounded-t-xl rounded-b-xl"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />

        {/* alterar o black/90 para mais ou pra menos para mudar a intensidade da sombra*/}
        <div
          className="absolute bottom-0 left-0 w-full 
                  h-16 sm:h-20 md:h-24 lg:h-28 
                  bg-gradient-to-t from-black/90 to-transparent 
                  rounded-b-xl"
        />

        <div className="absolute bottom-4 left-0 w-full flex flex-col items-center justify-center gap-1 z-10 px-2">
          {imovel.EstudaDacao === "Sim" && <ImageBadge text="ESTUDA IMÓVEL NO NEGÓCIO" />}
          {imovel.EstudaDacao !== "Sim" && imovel.Exclusivo === "Sim" && (
            <ImageBadge text="EXCLUSIVO" />
          )}
          <h3 className="text-white text-lg sm:text-base md:text-lg font-bold text-center">
            {imovel.Bairro}
          </h3>
        </div>
      </div>

      <div className="p-5 flex flex-col h-[180px]">
        {/* Categoria e Código */}
        <div
          className={`flex justify-between items-center mb-4 ${
            hasAnyDetail ? "border-b border-gray-200 pb-3" : ""
          }`}
        >
          <p className="text-sm text-[#303030]">{capitalizeCategory(imovel.Categoria)}</p>
          <p className="text-sm text-[#303030] flex items-center gap-1">
            <CodigoImobiliariaIcon className="w-3 h-3 text-gray-400" />
            {imovel.Codigo}
          </p>
        </div>

        {/* Detalhes do imóvel - sempre ocupa espaço, mas só mostra conteúdo se houver */}
        <div className="flex-1 flex items-center justify-center mb-4">
          {hasAnyDetail ? (
            <div className="flex justify-between items-center w-full border-b border-gray-200 pb-3">
              {hasDormitorios && (
                <div className="flex flex-col items-center gap-1">
                  <DormitorioIcon className="opacity-70 w-[18px] h-[18px]" />
                  <span className="text-sm text-[#303030]">
                    {imovel.Dormitorios} quarto{Number(imovel.Dormitorios) > 1 ? "s" : ""}
                  </span>
                </div>
              )}
              {terreno ? (
                hasAreaTerreno && (
                  <div className="flex flex-col items-center gap-1">
                    <AreaIcon className="opacity-70 w-[18px] h-[18px]" />
                    <span className="text-sm text-[#303030]">
                      {formatNumberPtBR(Number(imovel.AreaTerreno))}m²
                    </span>
                  </div>
                )
              ) : sitio ? (
                <>
                  {hasAreaUtil && (
                    <div className="flex flex-col items-center gap-1">
                      <AreaIcon className="opacity-70 w-[18px] h-[18px]" />
                      <span className="text-sm text-[#303030]">
                        {formatNumberPtBR(Number(imovel.AreaUtil))}m²
                      </span>
                    </div>
                  )}
                  {hasAreaTotal && (
                    <div className="flex flex-col items-center gap-1">
                      <AreaIcon className="opacity-70 w-[18px] h-[18px]" />
                      <span className="text-sm text-[#303030]">
                        {formatNumberPtBR(Number(imovel.AreaTotal))}m²
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {area && (
                    <div className="flex flex-col items-center gap-1">
                      <AreaIcon className="opacity-70 w-[18px] h-[18px]" />
                      <span className="text-sm text-[#303030]">
                        {formatNumberPtBR(Number(area))}m²
                      </span>
                    </div>
                  )}
                  {hasVagas && (
                    <div className="flex flex-col items-center gap-1">
                      <VagaIcon className="opacity-70 w-[18px] h-[18px]" />
                      <span className="text-sm text-[#303030]">
                        {imovel.Vagas} vaga{Number(imovel.Vagas) > 1 ? "s" : ""}
                      </span>
                    </div>
                  )}
                </>
              )}
            </div>
          ) : (
            <div className="w-full" />
          )}
        </div>

        {/* Favoritos e Preço (com valor anterior/atual em linha) */}
        <div className="flex justify-between items-center mt-auto">
          <FavoriteButton property={imovel} />
          {priceNode}
        </div>
      </div>
    </div>
  );
}
