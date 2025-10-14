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
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearching]);

  const handleBlur = () => {
    // Se sair do input e estiver vazio, volta para o botão
    if (!codigo.trim()) {
      setIsSearching(false);
    }
  };

  const openModal = (modalType: "location" | "type" | "value") => {
    setModals({ ...modals, [modalType]: true });
  };

  const closeModal = (modalType: "location" | "type" | "value") => {
    setModals({ ...modals, [modalType]: false });
  };

  const getTypeDisplayText = () => {
    if (searchData.tipos.length === 0) return "Tipo";
    if (searchData.tipos.length === 1) {
      // Mapear IDs para labels amigáveis
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
    const newSearchParams = new URLSearchParams();

    if (searchData.action) newSearchParams.set("action", searchData.action);
    if (searchData.tipos?.length > 0)
      newSearchParams.set("tipos", searchData.tipos.join(","));
    if (searchData.locations.length > 0) {
      newSearchParams.set("cidade", searchData.locations[0].split(":")[0]);
      newSearchParams.set(
        "bairro",
        searchData.locations.map((i) => i.split(":")[1]).join(",")
      );
    }
    if (searchData.valueRange.min)
      newSearchParams.set("valorMin", searchData.valueRange.min);
    if (searchData.valueRange.max)
      newSearchParams.set("valorMax", searchData.valueRange.max);

    newSearchParams.set("page", String("1"));
    const path = `/busca/${searchData.action}/${
      searchData.tipos.length > 0
        ? searchData.tipos[0].replace("/", "-")
        : "imoveis"
    }/${
      searchData.locations.length > 0
        ? searchData.locations[0].split(":")[0] +
          "+" +
          searchData.locations[0].split(":")[1]
        : "porto-alegre"
    }`;
    // console.log(path)
    router.push(
      `${decodeURIComponent(path)}?${decodeURIComponent(
        newSearchParams.toString()
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

    const newSearchParams = new URLSearchParams();
    if (searchData.action) newSearchParams.set("action", searchData.action);
    newSearchParams.set("page", String("1"));
    router.push(`${path}?${decodeURIComponent(newSearchParams.toString())}${isMobile ? '#ImoveisSection' : ''}`);
  };

  const handleSearchByCode = async () => {
    if (!codigo) return;
    try {
      if (!searchData) {
        console.error("searchData não definido");
        return;
      }

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

      if (!codigo) {
        console.error("codigo não definido");
        return;
      }

      router.push(`/imovel/comprar+${tipo}+em+${location}/${codigo}`);
    } catch (error) {
      console.error("Falha ao buscar imóveis:", error);
    }
  };

  return (
    <section
      className="relative min-h-[90vh] min-h-[90svh] min-h-[90dvh] w-[100%] overflow-x-hidden bg-cover bg-center overflow-hidden object-cover justify-items-center content-center"
      style={{
        backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.938813025210084) 0%, rgba(0,0,0,0) 60%),url(${
          banner.imageUrl ??
          "https://www.terrasulimoveis.com.br/uploads/fundo.jpg"
        })`,
      }}
    >
      {/* <div className="absolute inset-0 bg-black bg-opacity-40"></div> */}

      <div
        className={`z-10 py-8 px-8 sm:px-10 md:px-0 w-full h-full flex flex-col max-w-7xl`}
      >
        <div className="pt-6 md:pt-4 lg:pt-2.5">
          <Link
            href={banner.url ?? ""}
            className="text-4xl md:text-5xl font-semibold text-white mb-4 leading-tight font-[Montserrat, sans-serif]"
          >
            {banner.titulo}
          </Link>
          {banner.subtitulo && (
            <p className="text-xl text-white mb-24 md:mb-[160px]">
              {banner.subtitulo}
            </p>
          )}

          {/* Search form */}
          <div className="bg-white rounded-lg p-4 shadow-lg w-[full] lg:max-w-4xl mt-4 md:w-fit">
            <div className="flex flex-col md:flex-row w-[full] justify-start items-center md:gap-2">
              <div className=" flex flex-col gap-y-4 w-full md:grid md:grid-cols-4 md:gap-2">
                <Button
                  variant="outline"
                  onClick={() => openModal("type")}
                  className="justify-between bg-transparent font-normal lg:h-12 border-0 shadow-none cursor-pointer"
                  aria-label="Selecionar tipo de imóvel"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        searchData.tipos.length === 0
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
                      {getTypeDisplayText()}
                    </span>
                  </div>
                  <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
                </Button>

                {/* Localização - Modal Select */}
                <Button
                  variant="outline"
                  onClick={() => openModal("location")}
                  className="justify-between bg-transparent font-normal lg:h-12 border-0 shadow-none cursor-pointer"
                  aria-label="Selecionar localização"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`font-medium ${
                        searchData.locations.length === 0
                          ? "text-black"
                          : "text-black"
                      }`}
                    >
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
                    id="min-trigger"
                    aria-labelledby="min-label"
                    title="Valor de"
                  >
                    <SelectValue placeholder="Valor de" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">R$ 0</SelectItem>
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
                    <SelectItem value="4000000">R$ 4.000.000</SelectItem>
                    <SelectItem value="5000000">R$ 5.000.000</SelectItem>
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
                    id="max-trigger"
                    aria-labelledby="max-label"
                    title="Valor até"
                  >
                    <SelectValue placeholder="Valor até" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">R$ 0</SelectItem>
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
                    <SelectItem value="4000000">R$ 4.000.000</SelectItem>
                    <SelectItem value="5000000">R$ 5.000.000</SelectItem>
                    <SelectItem value="999999999">+ R$ 6.000.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSearch}
                className="bg-site-primary hover:bg-site-primary-hover hover:cursor-pointer w-36 md:h-12 md:w-12 md:mt-0 mt-4 cursor-pointer"
                aria-label="Valor de/até"
              >
                <Search className="h-6 w-6" />
              </Button>
            </div>
          </div>
          <div className="flex justify-start items-center text-white mt-2 mb-3 bg-transparent">
            <Button
              onClick={() => handleAdvancedSearch()}
              className="text-xs w-[152px] font-semibold flex items-center border border-transparent gap-1 bg-transparent hover:bg-transparent focus:ring-2 focus:ring-white has-[>svg]:px-0 cursor-pointer mr-4"
            >
              BUSCA AVANÇADA <SlidersHorizontal className="h-4 w-5" />
            </Button>
            {!isSearching ? (
              <Button
                onClick={() => setIsSearching(true)}
                className="text-xs w-[152px] font-semibold flex items-center border border-transparent gap-1 bg-transparent hover:bg-transparent focus:ring-2 focus:ring-white has-[>svg]:px-0 cursor-pointer"
              >
                <span className="text-shadow">BUSCA POR CÓDIGO</span> <Search className="h-4 w-5" />
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
                  className="w-[132px] px-2 text-sm text-white outline-none text-shadow"
                />
                <Button
                  onClick={handleSearchByCode}
                  className="bg-transparent hover:cursor-pointer text-white hover:bg-transparent has-[>svg]:px-0 has-[>svg]:pr-1"
                  aria-label="Buscar imóveis"
                >
                  <Search className="h-4 w-5" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      {/* Modals */}
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
