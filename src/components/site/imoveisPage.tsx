"use client";
import { Filtros } from "@/utils/parseFilter";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { ChevronDown, Search, SlidersHorizontal } from "lucide-react";
import { LocationSelectModal } from "./locationSelectModal";
import { TypeSelectModal } from "./tipoImovelSelectModal";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Checkbox } from "../ui/checkbox";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { ImovelCard } from "./imovelcard";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Destaque } from "@/lib/types/destaque";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";
import BreadCrumb from "./filteredBreadcrumb";
import { ImovelCardSkeleton } from "./cardSkeleton";
import { Imovel } from "@prisma/client";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function ImoveisPage({ filtros }: { filtros: Filtros }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(filtros.page ? Number(filtros.page) : 1);
  const [imoveis, setImoveis] = useState<Destaque[]>([]);
  const [totalPages, setTotalPages] = useState(0);
  const [totalImoveis, setTotalImoveis] = useState(0);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState(filtros.sort || "ImovelRecente");
  const [titulo, setTitulo] = useState("");
  const location =
    filtros.bairro?.map((i) => `${filtros.cidade}:${i.replaceAll("-", " ")}`) ??
    [];
  const [searchData, setSearchData] = useState({
    action: filtros.action ?? "comprar",
    tipos: filtros.tipo
      ? filtros.tipo.map((t: string) => decodeURIComponent(t))
      : ([] as string[]),
    locations:
      location.length > 0 ? location : [filtros.cidade ?? "porto alegre"],
    valueRange: { min: filtros.valorMin ?? "", max: filtros.valorMax ?? "" },
    quartos: filtros.quartos ?? "",
    area: filtros.areaMinima ?? "",
    suites: filtros.suites ?? "",
    vagas: filtros.vagas ?? "",
    caracteristicas: filtros.caracteristicas ?? ([] as string[]),
    lancamentos: filtros.lancamentos ?? "",
    empreendimento: filtros.empreendimento ?? "",
  });
  const [codigo, setCodigo] = useState(filtros.codigo ?? "");
  const [empreendimento, setEmpreendimento] = useState(
    filtros.empreendimento ?? ""
  );
  const [modals, setModals] = useState({
    location: false,
    type: false,
  });

  const caracteristicas = [
    { id: "academia", label: "Academia" },
    { id: "elevador", label: "Elevador" },
    { id: "piscina", label: "Piscina" },
    { id: "playground", label: "Playground" },
    { id: "portaria", label: "Portaira" },
    { id: "quadra", label: "Quadra de esportes" },
    { id: "sacada", label: "Sacada" },
    { id: "saloa", label: "Salão de festa" },
  ];

  useEffect(() => {
    const newData = {
      action: searchParams.get("action") ?? "comprar",
      tipos: searchParams.get("tipos")
        ? searchParams.get("tipos")!.split(",")
        : [],
      locations: searchParams.get("cidade")
        ? searchParams.get("bairro")
          ? searchParams
              .get("bairro")!
              .split(",")
              .map((b) => `${searchParams.get("cidade")}:${b}`)
          : [searchParams.get("cidade")!] // só cidade, sem ":"
        : [],
      valueRange: {
        min: searchParams.get("valorMin") ?? "",
        max: searchParams.get("valorMax") ?? "",
      },
      quartos: searchParams.get("quartos") ?? "",
      area: searchParams.get("areaMinima") ?? "",
      suites: searchParams.get("suites") ?? "",
      vagas: searchParams.get("vagas") ?? "",
      caracteristicas: searchParams.get("caracteristicas")
        ? searchParams.get("caracteristicas")!.split(",")
        : [],
      lancamentos: searchParams.get("lancamentos") ?? "",
      empreendimento: searchParams.get("empreendimento") ?? "",
    };

    setSearchData(newData);
    setPage(Number(searchParams.get("page") ?? 1));
    setSortOrder(searchParams.get("sort") ?? "");
  }, [searchParams]);

  useEffect(() => {
    if (empreendimento || searchData.empreendimento) {
      handleSearchByName(empreendimento || searchData.empreendimento);
      return;
    }

    const newSearchParams = new URLSearchParams();

    let pathLocation = "porto alegre";
    if (searchData.locations.length > 0) {
      const [cidade, bairro] = searchData.locations[0].split(":");
      pathLocation = bairro ? `${cidade}+${bairro}` : cidade;
    }

    const path = `/busca/${searchData.action}/${
      searchData.tipos.length > 0
        ? searchData.tipos[0].replace("/", "-")
        : "imoveis"
    }/${pathLocation}`;
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
    if (searchData.quartos !== "")
      newSearchParams.set("quartos", searchData.quartos);
    if (searchData.area !== "")
      newSearchParams.set("areaMinima", searchData.area);
    if (searchData.suites !== "")
      newSearchParams.set("suites", searchData.suites);
    if (searchData.vagas !== "") newSearchParams.set("vagas", searchData.vagas);
    if (searchData.caracteristicas?.length > 0)
      newSearchParams.set(
        "caracteristicas",
        searchData.caracteristicas.join(",")
      );
    if (searchData.lancamentos != "")
      newSearchParams.set("lancamentos", searchData.lancamentos);
    if (codigo) newSearchParams.set("codigo", codigo);
    // ... e os outros filtros
    if (sortOrder) newSearchParams.set("sort", sortOrder);
    newSearchParams.set("page", String(page));
    router.push(
      `${path}?${decodeURIComponent(newSearchParams.toString())}${
        isMobile ? "#ImoveisSection" : ""
      }`,
      { scroll: false }
    );

    const fetchImoveis = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/vista/imoveis?${newSearchParams.toString()}`
        );
        const data = await res.json();
        setImoveis(data.imoveis);
        setTotalPages(data.totalPages);
        setTotalImoveis(data.totalItems);
        gerarTitulo(data.totalItems);
        // ... (atualize totalPages e totalImoveis)
      } catch (error) {
        console.error("Falha ao buscar imóveis:", error);
        setImoveis([]);
      } finally {
        setLoading(false);
      }
    };

    fetchImoveis();
  }, [searchData, sortOrder, page, router]);

  function gerarTitulo(totalImoveis: number) {
    if (totalImoveis === 0) {
      setTitulo("");
    }

    let titulo = `${totalImoveis} `;

    // Tipo de ação
    titulo +=
      searchData.action === "comprar"
        ? "imóveis à venda"
        : "imóveis para alugar";

    // Tipos de imóvel
    // if (searchData.tipos.length > 0) {
    //   titulo += ` (${searchData.tipos.join(", ")})`;
    // }

    // Quartos
    if (searchData.quartos !== "") {
      titulo += `, com ${searchData.quartos}+ quarto${
        searchData.quartos !== "1" ? "s" : ""
      }`;
    }

    // Suítes
    if (searchData.suites !== "") {
      titulo += `, com ${searchData.suites}+ suíte${
        searchData.suites !== "1" ? "s" : ""
      }`;
    }

    // Vagas
    if (searchData.vagas !== "") {
      titulo += `, com ${searchData.vagas}+ vaga${
        searchData.vagas !== "1" ? "s" : ""
      }`;
    }

    // Área mínima
    if (searchData.area !== "") {
      titulo += `, com área mínima de ${searchData.area}m²`;
    }

    // Características
    if (searchData.caracteristicas.length > 0) {
      titulo += `, com ${searchData.caracteristicas.join(", ")}`;
    }

    // Lançamentos
    if (searchData.lancamentos === "s") {
      titulo += `, lançamento`;
    }

    if (filtros.bairro && filtros.bairro[0]?.split(",").length > 1) {
      titulo += ` em alguns bairros`;
    }
    // Localizações
    if (filtros.cidade) {
      titulo += ` em ${filtros.cidade}`;
      if (filtros.bairro && filtros.bairro[0]?.split(",").length === 1) {
        titulo +=
          filtros.bairro[0] == "all" ? "" : ` no bairro ${filtros.bairro[0]}`;
      }
    }

    if (codigo) {
      titulo += ` com código ${codigo}`;
    }

    setTitulo(titulo);
  }

  function toSlug(text: string): string {
    return (
      text
        // .normalize("NFD") // separa acentos das letras
        .trim() // remove espaços extras do começo/fim
        .replace(/\s+/g, "-") // troca espaços por -
        .replace(/-+/g, "-")
    ); // evita múltiplos hífens
    // .toLowerCase();
  }

  function gerarTitulos(imovel: Imovel) {
    const capitalizar = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    let categoria = imovel.Categoria ? imovel.Categoria : "Imóvel";

    categoria = categoria.replaceAll(" ", "_");
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

    return [categoria, detalhes, localizacao].filter(Boolean).join(" ");
  }

  const openModal = (modalType: "location" | "type") => {
    setModals({ ...modals, [modalType]: true });
  };

  const closeModal = (modalType: "location" | "type") => {
    setModals({ ...modals, [modalType]: false });
  };

  const handleSearchByCode = async (code: string) => {
    if (!code) return;
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

      if (!code) {
        console.error("code não definido");
        return;
      }

      router.push(
        `/imovel/comprar+${tipo}+em+${location}/${code}${
          isMobile ? "#main" : ""
        }`
      );
    } catch (error) {
      console.error("Falha ao buscar imóveis:", error);
      setImoveis([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchByName = async (name: string) => {
    console.log(name);
    if (!name) return;
    try {
      setLoading(true);

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
        `${decodeURIComponent(
          path
        )}?action=comprar&empreendimento=${name}&page=1${
          isMobile ? "#ImoveisSection" : ""
        }`,
        { scroll: false }
      );
      const res = await fetch(
        `/api/vista/imoveis?action=comprar&empreendimento=${name}&page=1`
      );
      const data = await res.json();
      setImoveis(data.imoveis);
      setTotalPages(data.totalPages);
      setTotalImoveis(data.totalItems);
      gerarTitulo(data.totalItems);
      // ... (atualize totalPages e totalImoveis)
    } catch (error) {
      console.error("Falha ao buscar imóveis:", error);
      setImoveis([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col scroll-smooth">
      <div className="w-full content-center shadow-lg shadow-gray-200 scroll-smooth">
        <div className="bg-white w-[full] max-w-7xl px-4 mx-auto py-4 border-t-1 scroll-smooth">
          <div className="flex flex-col md:flex-row w-[full] justify-start items-center md:gap-2 scroll-smooth">
            <div className="grid grid-cols-2 gap-4 md:flex md:flex-row md:gap-2 md:flex-wrap md:justify-between w-full justify-start items-center">
              <Button
                variant="outline"
                onClick={() => openModal("type")}
                className="justify-between bg-transparent has-[>svg]:px-0 md:has-[>svg]:pl-3 font-normal w-full md:w-fit lg:h-12 border-0 shadow-none cursor-pointer"
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>
                    Tipo
                    {searchData.tipos.length > 0
                      ? `(${searchData.tipos.length})`
                      : ""}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
              </Button>

              {/* Localização - Modal Select */}
              <Button
                variant="outline"
                onClick={() => openModal("location")}
                className="justify-between bg-transparent has-[>svg]:px-0 md:has-[>svg]:pl-3 font-normal w-full md:w-fit lg:h-12 border-0 shadow-none cursor-pointer"
              >
                <div className="flex items-center gap-2 font-medium">
                  <span>
                    Localização
                    {searchData.locations.length > 0
                      ? `(${searchData.locations.length})`
                      : ""}
                  </span>
                </div>
                <ChevronDown className="h-4 w-4 text-muted-foreground opacity-50" />
              </Button>

              <div className="flex items-center gap-2 sm:gap-4 w-full md:w-fit h-9 lg:h-12 justify-between">
                <span className="text-sm font-medium">Quartos</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setSearchData({
                          ...searchData,
                          quartos:
                            searchData.quartos === num.toString()
                              ? ""
                              : num.toString(),
                        });
                        setPage(1);
                        setEmpreendimento("");
                      }}
                      className={`w-[30px] h-[30px] border border-gray-300 rounded-[4px] cursor-pointer ${
                        searchData.quartos === num.toString()
                          ? "bg-site-primary text-white font-bold"
                          : "bg-white text-black font-normal"
                      }  hover:bg-site-primary hover:text-white hover:font-bold`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              <Select
                value={searchData.valueRange.min}
                onValueChange={
                  (value) => {
                    setSearchData({
                      ...searchData,
                      valueRange: { ...searchData.valueRange, min: value },
                    });
                    setPage(1);
                    setEmpreendimento("");
                  } // Reset page to 1 when value range changes
                }
              >
                <SelectTrigger className="lg:data-[size=default]:h-10 has-[>svg]:px-0 md:has-[>svg]:pl-3 w-full border-0 md:w-fit shadow-none cursor-pointer text-black font-medium">
                  <SelectValue placeholder="Valor de" className="text-black" />
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
                onValueChange={
                  (value) => {
                    setSearchData({
                      ...searchData,
                      valueRange: { ...searchData.valueRange, max: value },
                    });
                    setPage(1);
                    setEmpreendimento("");
                  } // Reset page to 1 when value range changes
                }
              >
                <SelectTrigger className="lg:data-[size=default]:h-10 w-full has-[>svg]:px-0 md:has-[>svg]:pl-3 md:w-fit shadow-none border-0 cursor-pointer font-medium">
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
              {/* Botão Filtros */}
              <Button
                variant="outline"
                className="bg-transparent border font-medium has-[>svg]:pr-2 pl-3 pr-1.5 w-full md:w-fit lg:h-10 lg:w-24 justify-between shadow-none cursor-pointer"
                onClick={() => {
                  setShowFilters(!showFilters);
                  setPage(1);
                  setEmpreendimento("");
                }}
              >
                Filtros
                <SlidersHorizontal className="h-4 w-5" />
              </Button>

              {/* Busca por código */}
              <div className="flex items-center border rounded-lg overflow-hidden w-full md:w-fit h-9 lg:h-10">
                <Input
                  placeholder="Código"
                  value={codigo}
                  onChange={(e) => setCodigo(e.target.value)}
                  className="placeholder:text-black border-0 text-sm focus:ring-0 focus:outline-none focus-visible:ring-0 shadow-none text-black"
                />
                <Button
                  onClick={() => handleSearchByCode(codigo)}
                  className="bg-transparent rounded-none h-full cursor-pointer hover:bg-site-primary text-gray-500 hover:text-white"
                >
                  <Search className="h-4 w-4 text-current" />
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`bg-white max-w-7xl mx-auto px-4 overflow-hidden border-t-1 transition-all duration-500 scroll-smooth ease-in-out ${
            showFilters ? "opacity-100 max-h-96 py-4" : "opacity-0 max-h-0 py-0"
          }`}
        >
          <div className="flex flex-col md:flex-row w-[full] justify-start items-center md:gap-2">
            <div className="gap-4 w-full grid grid-cols-2 md:grid md:grid-cols-3 lg:grid lg:auto-cols-auto lg:grid-flow-col lg:grid-cols-none lg:gap-x-1">
              <Select
                value={searchData.area}
                onValueChange={(value) => {
                  setSearchData({ ...searchData, area: value });
                  setPage(1); // Reset page to 1 when area changes
                  setEmpreendimento("");
                }}
              >
                <SelectTrigger className="data-[size=default]:h-12 p-0 border-0 shadow-none cursor-pointer w-full md:w-fit font-medium">
                  <SelectValue placeholder="Area Mínima" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Area Minima</SelectItem>
                  <SelectItem value="100">100m²</SelectItem>
                  <SelectItem value="150">150m²</SelectItem>
                  <SelectItem value="200">200m²</SelectItem>
                  <SelectItem value="250">250m²</SelectItem>
                  <SelectItem value="300">300m²</SelectItem>
                  <SelectItem value="350">350m²</SelectItem>
                  <SelectItem value="400">400m²</SelectItem>
                  <SelectItem value="450">450m²</SelectItem>
                  <SelectItem value="500">500m²</SelectItem>
                </SelectContent>
              </Select>

              <div className="flex items-center gap-4 h-12 w-full md:w-fit justify-between text-sm">
                <span className="font-medium">Suítes</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setSearchData({
                          ...searchData,
                          suites:
                            searchData.suites == num.toString()
                              ? ""
                              : num.toString(),
                        });
                        setPage(1); // Reset page to 1 when suites changes
                        setEmpreendimento("");
                      }}
                      className={`w-[30px] h-[30px] border border-gray-300 rounded-[4px] cursor-pointer ${
                        searchData.suites === num.toString()
                          ? "bg-site-primary text-white font-bold"
                          : "bg-white text-black font-normal"
                      }  hover:bg-site-primary hover:text-white hover:font-bold`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 h-12 w-full md:w-fit">
                <span className="text-sm font-medium">Vagas</span>
                <div className="flex items-center gap-2">
                  {[1, 2, 3].map((num) => (
                    <button
                      key={num}
                      onClick={() => {
                        setSearchData({
                          ...searchData,
                          vagas:
                            searchData.vagas == num.toString()
                              ? ""
                              : num.toString(),
                        });
                        setPage(1);
                        setEmpreendimento("");
                      }}
                      className={`w-[30px] h-[30px] border border-gray-300 rounded-[4px] cursor-pointer ${
                        searchData.vagas === num.toString()
                          ? "bg-site-primary text-white font-bold"
                          : "bg-white text-black font-normal"
                      }  hover:bg-site-primary hover:text-white hover:font-bold`}
                    >
                      {num}+
                    </button>
                  ))}
                </div>
              </div>

              <Popover>
                <PopoverTrigger className="cursor-pointer h-12 w-full md:w-fit text-start text-sm font-medium">
                  Caracteristicas
                </PopoverTrigger>
                <PopoverContent className="cursor-pointer">
                  {caracteristicas.map((type) => (
                    <div
                      key={type.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border-0 shadow-none ${
                        searchData.caracteristicas.includes(type.id)
                          ? " border shadow-sm"
                          : "hover:bg-gray-50 border border-transparent"
                      }`}
                      onClick={() => {
                        setSearchData((prev) => ({
                          ...prev,
                          caracteristicas: prev.caracteristicas.includes(
                            type.id
                          )
                            ? prev.caracteristicas.filter(
                                (id) => id !== type.id
                              )
                            : [...prev.caracteristicas, type.id],
                        }));
                        setPage(1); // Reset page to 1 when caracteristicas changes
                        setEmpreendimento("");
                      }}
                    >
                      <Checkbox
                        checked={searchData.caracteristicas.includes(type.id)}
                        onCheckedChange={(checked) => {
                          setSearchData((prev) => ({
                            ...prev,
                            caracteristicas: checked
                              ? [...prev.caracteristicas, type.id] // agora sim, adiciona quando checked = true
                              : prev.caracteristicas.filter(
                                  (id) => id !== type.id
                                ), // remove quando false
                          }));
                          setPage(1); // Reset page to 1 when caracteristicas changes
                          setEmpreendimento("");
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {type.label}
                      </span>
                    </div>
                  ))}
                </PopoverContent>
              </Popover>
              <div className="flex items-center space-x-2 h-12 w-full md:w-fit justify-between">
                <Label>Lançamentos</Label>
                <Switch
                  checked={
                    searchData.lancamentos == ""
                      ? false
                      : searchData.lancamentos === "s"
                  }
                  onCheckedChange={(checked) => {
                    setSearchData({
                      ...searchData,
                      lancamentos: checked ? "s" : "",
                    });
                    setPage(1); // Reset page to 1 when lancamentos changes
                    setEmpreendimento("");
                  }}
                />
              </div>
              <div className="flex items-center border rounded-lg overflow-hidden w-full md:w-fit h-9 lg:h-10 lg:justify-self-end self-center">
                <Input
                  placeholder="Empreendimento"
                  value={empreendimento}
                  onChange={(e) => setEmpreendimento(e.target.value)}
                  className="placeholder:text-black border-0 text-sm focus:ring-0 focus:outline-none focus-visible:ring-0 shadow-none text-black"
                />
                <Button
                  onClick={() => handleSearchByName(empreendimento)}
                  className="bg-transparent rounded-none h-full cursor-pointer hover:bg-site-primary text-gray-500 hover:text-white"
                >
                  <Search className="h-4 w-4 text-current" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <main className="flex-1 pb-8 scroll-smooth">
        <div className="py-8 justify-items-center scroll-smooth">
          <div className="px-8 sm:px-10 md:px-0 w-full max-w-7xl">
            <div className="rounded-sm select-none mt-3">
              <BreadCrumb />
            </div>
          </div>
        </div>
        <div
          className="justify-items-center scroll-mt-8 scroll-smooth"
          id="ImoveisSection"
        >
          <div className="px-8 sm:px-10 md:px-0 w-full max-w-7xl flex flex-col gap-4 sm:gap-0 sm:flex-row items-center justify-between">
            <div className="h-auto min-h-6 rounded-sm">
              <h1 className="text-2xl font-bold text-[#4d4d4d]">{titulo}</h1>
            </div>
            <div>
              <Select
                value={sortOrder}
                onValueChange={(value) => setSortOrder(value)}
              >
                <SelectTrigger className="lg:data-[size=default]:h-12 border w-full has-[>svg]:px-3 md:w-fit shadow-none cursor-pointer">
                  <SelectValue placeholder={"Mais recentes"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ImovelRecente">Mais recentes</SelectItem>
                  <SelectItem value="MenorValor">Menor valor</SelectItem>
                  <SelectItem value="MaiorValor">Maior valor</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        <div className="py-8 justify-items-center">
          <div className="px-8 sm:px-10 md:px-0 w-full max-w-7xl grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-5">
            {loading ? (
              // Se estiver carregando, mostre os skeletons
              Array.from({ length: 8 }).map((_, index) => (
                <ImovelCardSkeleton key={index} />
              ))
            ) : imoveis.length === 0 ? (
              // Se não estiver carregando, mas não houver imóveis, mostre a mensagem de "não encontrado"
              <p className="text-center text-gray-500 col-span-full">
                Nenhum imóvel encontrado com os filtros selecionados.
              </p>
            ) : (
              // Caso contrário, mostre os imóveis
              imoveis.map((imovel: Destaque) => (
                <Link
                  key={imovel.id}
                  href={`/imovel/${encodeURIComponent(
                    toSlug(gerarTitulos(imovel))
                  )}/${imovel.Codigo}${isMobile ? "#main" : ""}`}
                >
                  <ImovelCard imovel={imovel} activeTab={searchData.action} />
                </Link>
              ))
            )}
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-10">
            {totalImoveis > 0 && (
              <Pagination>
                <PaginationContent>
                  {/* Botão Anterior */}
                  <PaginationItem>
                    <PaginationPrevious
                      href={`?page=${page - 1}`}
                      onClick={(e) => {
                        e.preventDefault(); // evita reload da página
                        setPage(Number(page) - 1);
                      }}
                      className={
                        page === 1
                          ? "pointer-events-none opacity-50 cursor-none"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>

                  {(() => {
                    const maxVisible = 5; // máximo de páginas visíveis
                    let startPage = Math.max(
                      1,
                      Number(page) - Math.floor(maxVisible / 2)
                    );
                    let endPage = startPage + maxVisible - 1;

                    if (endPage > (totalPages || 1)) {
                      endPage = totalPages || 1;
                      startPage = Math.max(1, endPage - maxVisible + 1);
                    }

                    const pages = [];
                    for (let i = startPage; i <= endPage; i++) {
                      pages.push(
                        <PaginationItem key={i}>
                          <PaginationLink
                            href={`?page=${i}`}
                            className="cursor-pointer"
                            isActive={page === i}
                            onClick={(e) => {
                              e.preventDefault();
                              setPage(i);
                            }}
                          >
                            {i}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    }
                    return pages;
                  })()}

                  {/* Botão Próximo */}
                  <PaginationItem>
                    <PaginationNext
                      href={`?page=${page + 1}`}
                      onClick={(e) => {
                        e.preventDefault();
                        setPage(Number(page) + 1);
                      }}
                      className={
                        page === totalPages
                          ? "pointer-events-none opacity-50 cursor-none"
                          : "cursor-pointer"
                      }
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            )}
          </div>
        </div>
      </main>
      <LocationSelectModal
        isOpen={modals.location}
        onClose={() => closeModal("location")}
        selectedLocations={searchData.locations}
        onSelectionChange={(location) => {
          setSearchData({ ...searchData, locations: location });
          setPage(1);
          setEmpreendimento("");
        }}
      />

      <TypeSelectModal
        isOpen={modals.type}
        onClose={() => closeModal("type")}
        selectedTypes={searchData.tipos}
        onSelectionChange={(tipos) => {
          setSearchData({ ...searchData, tipos });
          setPage(1);
          setEmpreendimento("");
        }}
      />
    </div>
  );
}
