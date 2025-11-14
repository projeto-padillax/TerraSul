"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import Link from "next/link";
import { LocationSelectModal } from "@/components/site/locationSelectModal";
import { TypeSelectModal } from "@/components/site/tipoImovelSelectModal";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

interface HeroSectionProps {
  imageUrl: string;
  titulo: string;
  subtitulo: string;
  url: string;
}

export function HeroSection(banner: HeroSectionProps) {
  const [searchData, setSearchData] = useState({
    action: "comprar",
    tipos: [] as string[],
    locations: [] as string[],
    valueRange: { min: "", max: "" },
  });
  const [isSearching, setIsSearching] = useState(false);
  const [codigo, setCodigo] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [modals, setModals] = useState({
    location: false,
    type: false,
    value: false,
  });
  const isMobile = useIsMobile();

  useEffect(() => {
    if (isSearching && inputRef.current) inputRef.current.focus();
  }, [isSearching]);

  const handleBlur = () => {
    if (!codigo.trim()) setIsSearching(false);
  };

  const openModal = (type: "location" | "type" | "value") =>
    setModals({ ...modals, [type]: true });
  const closeModal = (type: "location" | "type" | "value") =>
    setModals({ ...modals, [type]: false });

  const getTypeDisplayText = () => {
    if (searchData.tipos.length === 0) return "Tipo";
    if (searchData.tipos.length === 1) {
      const typeLabels: { [key: string]: string } = {
        apartamentos: "Apartamentos",
        casa: "Casa",
        "Casa em Condomínio": "Casa em Condomínio",
        cobertura: "Cobertura",
        comercial: "Comercial",
        "Sitio/Chácara": "Sitio/Chácara",
        terreno: "Terreno",
      };
      return typeLabels[searchData.tipos[0]] || searchData.tipos[0];
    }
    return `${searchData.tipos.length} tipos`;
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchData.action) params.set("action", searchData.action);
    if (searchData.tipos?.length > 0)
      params.set("tipos", searchData.tipos.join(","));
    if (searchData.locations.length > 0) {
      params.set("cidade", searchData.locations[0].split(":")[0]);
      params.set(
        "bairro",
        searchData.locations.map((i) => i.split(":")[1]).join(",")
      );
    }
    if (searchData.valueRange.min)
      params.set("valorMin", searchData.valueRange.min);
    if (searchData.valueRange.max)
      params.set("valorMax", searchData.valueRange.max);

    params.set("page", "1");
    const path = `/busca/${searchData.action}/${
      searchData.tipos.length > 0
        ? searchData.tipos[0].replace("/", "-")
        : "imoveis"
    }/${
      searchData.locations.length > 0
        ? searchData.locations[0].split(":")[0] +
          "+" +
          searchData.locations[0].split(":")[1]
        : "porto alegre"
    }`;
    router.push(
      `${decodeURIComponent(path).replaceAll(" ", "-")}?${decodeURIComponent(
        params.toString()
      )}${isMobile ? "#ImoveisSection" : ""}`
    );
  };

  const handleAdvancedSearch = () => {
    const path = `/busca/${searchData.action}/${
      searchData.tipos.length > 0
        ? searchData.tipos[0].replace("/", "-")
        : "imoveis"
    }/${
      searchData.locations.length > 0
        ? searchData.locations[0].split(":")[0] +
          "+" +
          searchData.locations[0].split(":")[1]
        : "porto alegre"
    }`;

    const params = new URLSearchParams();
    if (searchData.action) params.set("action", searchData.action);
    params.set("page", "1");
    router.push(`${path}?${decodeURIComponent(params.toString())}${isMobile ? '#ImoveisSection' : ''}`);
  };

  const handleSearchByCode = async () => {
    if (!codigo) return;
    try {
      const tipo =
        searchData.tipos && searchData.tipos.length > 0
          ? searchData.tipos[0].replace("/", "-")
          : "Imovel";
      const location =
        searchData.locations && searchData.locations.length > 0
          ? searchData.locations[0].split(":")[0] +
            "+" +
            searchData.locations[0].split(":")[1]
          : "porto alegre";

      router.push(`/imovel/comprar-${tipo.replace(/[\u0300-\u036f]/g, "")}-em-${location.replaceAll(" ", "-")}/${codigo}`);
    } catch (error) {
      console.error("Falha ao buscar imóveis:", error);
    }
  };

  return (
    <section
      className="relative min-h-[90vh] min-h-[90svh] min-h-[90dvh] w-full overflow-x-hidden bg-cover bg-center overflow-hidden object-cover justify-items-center content-center"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.9388) 0%, rgba(0,0,0,0) 60%),url(${
          banner.imageUrl ??
          "https://www.terrasulimoveis.com.br/uploads/fundo.jpg"
        })`,
      }}
    >
      <div className="z-10 py-8 px-8 sm:px-10 md:px-0 w-full h-full flex flex-col max-w-7xl">
        <div className="md:pt-4 lg:pt-2.5">
          {/* H1 visível para SEO */}
          <Link
            href={banner.url ?? ""}
            className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight font-[Montserrat, sans-serif]"
          >
            <h1 className="inline">
              {banner.titulo || "Imobiliária TerraSul – Encontre seu imóvel ideal"}
            </h1>
          </Link>

          {banner.subtitulo && (
            <p className="text-xl text-white mb-8 md:mb-[160px]">
              {banner.subtitulo}
            </p>
          )}

          {/* Search Form */}
          <div className="bg-white rounded-lg p-4 shadow-lg w-full lg:max-w-4xl mt-4 md:w-fit">
            <div className="flex flex-col md:flex-row w-full justify-start items-center md:gap-2">
              <div className="flex flex-col gap-y-4 w-full md:grid md:grid-cols-4 md:gap-2">
                <Button
                  variant="outline"
                  onClick={() => openModal("type")}
                  className="justify-between bg-transparent font-normal lg:h-12 border-0 shadow-none cursor-pointer"
                  aria-label="Selecionar tipo de imóvel"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-black">
                      {getTypeDisplayText()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                </Button>

                <Button
                  variant="outline"
                  onClick={() => openModal("location")}
                  className="justify-between bg-transparent font-normal lg:h-12 border-0 shadow-none cursor-pointer"
                  aria-label="Selecionar localização"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-black">
                      Localização
                      {searchData.locations.length > 0
                        ? `(${searchData.locations.length})`
                        : ""}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                </Button>

                <Select
                  value={searchData.valueRange.min}
                  onValueChange={(value) =>
                    setSearchData({
                      ...searchData,
                      valueRange: { ...searchData.valueRange, min: value },
                    })
                  }
                >
                  <SelectTrigger
                    className="lg:data-[size=default]:h-12 w-full border-0 shadow-none cursor-pointer font-medium"
                    title="Valor de"
                  >
                    <SelectValue placeholder="Valor de" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" avoidCollisions={false}>
                    <SelectItem value="100000">R$ 100.000</SelectItem>
                    <SelectItem value="200000">R$ 200.000</SelectItem>
                    <SelectItem value="300000">R$ 300.000</SelectItem>
                    <SelectItem value="400000">R$ 400.000</SelectItem>
                    <SelectItem value="500000">R$ 500.000</SelectItem>
                    <SelectItem value="600000">R$ 600.000</SelectItem>
                    <SelectItem value="700000">R$ 700.000</SelectItem>
                    <SelectItem value="800000">R$ 800.000</SelectItem>
                    <SelectItem value="900000">R$ 900.000</SelectItem>
                    <SelectItem value="1000000">R$ 1.000.000</SelectItem>
                    <SelectItem value="1500000">R$ 1.500.000</SelectItem>
                    <SelectItem value="2000000">R$ 2.000.000</SelectItem>
                    <SelectItem value="2500000">R$ 2.500.000</SelectItem>
                    <SelectItem value="3000000">R$ 3.000.000</SelectItem>
                    <SelectItem value="3500000">R$ 3.500.000</SelectItem>
                    <SelectItem value="4000000">R$ 4.000.000</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={searchData.valueRange.max}
                  onValueChange={(value) =>
                    setSearchData({
                      ...searchData,
                      valueRange: { ...searchData.valueRange, max: value },
                    })
                  }
                >
                  <SelectTrigger
                    className="lg:data-[size=default]:h-12 w-full border-0 shadow-none cursor-pointer font-medium"
                    title="Valor até"
                  >
                    <SelectValue placeholder="Valor até" />
                  </SelectTrigger>
                  <SelectContent position="popper" side="bottom" avoidCollisions={false}>
                    <SelectItem value="100000">R$ 100.000</SelectItem>
                    <SelectItem value="200000">R$ 200.000</SelectItem>
                    <SelectItem value="300000">R$ 300.000</SelectItem>
                    <SelectItem value="400000">R$ 400.000</SelectItem>
                    <SelectItem value="500000">R$ 500.000</SelectItem>
                    <SelectItem value="600000">R$ 600.000</SelectItem>
                    <SelectItem value="700000">R$ 700.000</SelectItem>
                    <SelectItem value="800000">R$ 800.000</SelectItem>
                    <SelectItem value="900000">R$ 900.000</SelectItem>
                    <SelectItem value="1000000">R$ 1.000.000</SelectItem>
                    <SelectItem value="1500000">R$ 1.500.000</SelectItem>
                    <SelectItem value="2000000">R$ 2.000.000</SelectItem>
                    <SelectItem value="2500000">R$ 2.500.000</SelectItem>
                    <SelectItem value="3000000">R$ 3.000.000</SelectItem>
                    <SelectItem value="3500000">R$ 3.500.000</SelectItem>
                    <SelectItem value="999999999">+ R$ 4.000.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearch}
                className="bg-site-primary hover:bg-site-primary-hover hover:cursor-pointer w-36 md:h-12 md:w-12 md:mt-0 mt-4 cursor-pointer"
                aria-label="Buscar imóveis"
              >
                <Search className="h-6 w-6" />
              </Button>
            </div>
          </div>

          <div className="flex justify-start items-center text-white mt-2 mb-3 bg-transparent">
            <Button
              onClick={handleAdvancedSearch}
              className="text-xs w-[152px] font-semibold flex items-center shadow-none border-transparent gap-1 bg-transparent hover:bg-transparent focus:ring-2 focus:ring-white has-[>svg]:px-0 cursor-pointer mr-4"
            >
              <span className="text-shadow">BUSCA AVANÇADA</span>
              <SlidersHorizontal className="h-4 w-5" />
            </Button>

            {!isSearching ? (
              <Button
                onClick={() => setIsSearching(true)}
                className="text-xs w-[152px] font-semibold flex items-center shadow-none border-transparent gap-1 bg-transparent hover:bg-transparent focus:ring-2 focus:ring-white has-[>svg]:px-0 cursor-pointer"
              >
                <span className="text-shadow">BUSCA POR CÓDIGO</span>
                <Search className="h-4 w-5" />
              </Button>
            ) : (
              <div className="flex h-[36px] items-center border border-white rounded-md overflow-hidden">
                <input
                  ref={inputRef}
                  type="text"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  onBlur={handleBlur}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSearchByCode();
                  }}
                  className="w-[132px] px-2 text-base text-white outline-none text-shadow"
                />
                <Button
                  onClick={handleSearchByCode}
                  className="bg-transparent hover:cursor-pointer text-white hover:bg-transparent has-[>svg]:px-0 has-[>svg]:pr-1"
                  aria-label="Buscar imóveis por código"
                >
                  <Search className="h-4 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <LocationSelectModal
        isOpen={modals.location}
        onClose={() => closeModal("location")}
        selectedLocations={searchData.locations}
        onSelectionChange={(locations) =>
          setSearchData({ ...searchData, locations })
        }
      />

      <TypeSelectModal
        isOpen={modals.type}
        onClose={() => closeModal("type")}
        selectedTypes={searchData.tipos}
        onSelectionChange={(tipos) => setSearchData({ ...searchData, tipos })}
      />
    </section>
  );
}
