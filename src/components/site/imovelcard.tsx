import Image from "next/image";
import FavoriteButton from "./favoritosButton";
import { CodigoImobiliariaIcon } from "../ui/codigoImobiliariaIcon";
import { Destaque } from "@/lib/types/destaque";
import ImageBadge from "./imageBadge";

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

  const areas = [imovel.AreaUtil, imovel.AreaTotal];
  const area = areas.find((a) => Number(a) > 0);

  const hasDormitorios = Number(imovel.Dormitorios) > 0;
  const hasVagas = Number(imovel.Vagas) > 0;
  const hasAnyDetail = area || hasDormitorios || hasVagas;

  const formatPrice = () => {
    const isRent = activeTab === "Alugar";
    const value = isRent ? imovel.ValorLocacao : imovel.ValorVenda;

    if (value === null || value === undefined || value === 0) {
      return "Consulte";
    }

    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="w-full overflow-hidden shadow-lg bg-white rounded-md transition-colors duration-200 hover:bg-gray-50 cursor-pointer">
      <div className="relative w-full aspect-[4/3]">
        <Image
          src={imovel.FotoDestaque}
          alt={imovel.Bairro}
          fill
          className="object-cover rounded-t-xl rounded-b-xl"
        />

        { /* alterar o black/90 para mais ou pra menos para mudar a intensidade da sombra*/}
        <div className="absolute bottom-0 left-0 w-full 
                  h-16 sm:h-20 md:h-24 lg:h-28 
                  bg-gradient-to-t from-black/90 to-transparent 
                  rounded-b-xl" />

        <div className="absolute bottom-4 left-0 w-full flex flex-col items-center justify-center gap-1 z-10 px-2">
          {imovel.EstudaDacao === "Sim" && (
            <ImageBadge text="ESTUDA IMÓVEL NO NEGÓCIO" />
          )}
          {imovel.EstudaDacao !== "Sim" && imovel.Exclusivo === "Sim" && (
            <ImageBadge text="EXCLUSIVO" />
          )}
          <h3 className="text-white text-sm sm:text-base md:text-lg font-bold text-center">
            {imovel.Bairro}
          </h3>
        </div>
      </div>

      <div className="p-5 flex flex-col h-[180px]">
        {/* Categoria e Código */}
        <div
          className={`flex justify-between items-center mb-4 ${hasAnyDetail ? "border-b border-gray-200 pb-3" : ""
            }`}
        >
          <p className="text-sm text-[#303030]">
            {capitalizeCategory(imovel.Categoria)}
          </p>
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
                <p className="text-sm text-[#303030]">
                  {imovel.Dormitorios} quarto
                  {Number(imovel.Dormitorios) > 1 ? "s" : ""}
                </p>
              )}
              {area && (
                <p className="text-sm text-[#303030]">
                  {area}m²
                </p>
              )}
              {hasVagas && (
                <p className="text-sm text-[#303030]">
                  {imovel.Vagas} vaga
                  {Number(imovel.Vagas) > 1 ? "s" : ""}
                </p>
              )}
            </div>
          ) : (
            // Espaço vazio sem nenhuma linha ou borda
            <div className="w-full"></div>
          )}
        </div>

        {/* Favoritos e Preço - sempre na parte inferior */}
        <div className="flex justify-between items-center mt-auto">
          <FavoriteButton property={imovel} />
          <p className="text-lg text-[#303030]">{formatPrice()}</p>
        </div>
      </div>
    </div>
  );
}