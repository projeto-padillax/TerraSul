"use client";

import { useEffect, useState } from "react";
import { ImovelCard } from "./imovelcard";
import Link from "next/link";
import { Destaque } from "@/lib/types/destaque";
import { Imovel } from "@prisma/client";

interface DestaquesSectionProps {
  destaques: {
    lancamentos: Destaque[];
    venda: Destaque[];
    aluguel: Destaque[];
  };
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

  function gerarTitulo (imovel: Imovel) {
    const capitalizar = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const categoria = imovel.Categoria ? imovel.Categoria : "Imóvel";
    const area =
      imovel.AreaTerreno || imovel.AreaTotal
        ? `${imovel.AreaTerreno || imovel.AreaTotal}m²`
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

    const bairro = imovel.Bairro ? `no bairro ${capitalizar(imovel.Bairro)}` : "";
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

export function DestaquesSection({ destaques }: DestaquesSectionProps) {
  const [activeTab, setActiveTab] = useState<string>("Alugar");
  const [todosImoveis, setTodosImoveis] = useState<Destaque[]>([]);

  useEffect(() => {
    switch (activeTab) {
      case "Alugar":
        setTodosImoveis(destaques.aluguel);
        break;
      case "Comprar":
        setTodosImoveis(destaques.venda);
        break;
      case "Lançamentos":
        setTodosImoveis(destaques.lancamentos);
        break;
      default:
        setTodosImoveis([]);
    }
  }, [activeTab, destaques]);

  if (todosImoveis.length === 0) return null;

  return (
    <section className="py-8 justify-items-center">
      <div className="px-8 sm:px-10 md:px-12 w-full max-w-7xl">
        <div className="w-full mt-3 mb-12 flex flex-col md:flex-row items-center justify-center md:gap-[35px] text-center">
          <h2 className="text-[min(max(2rem,4vw),4rem)] font-semibold text-[#303030] mb-2 md:mb-0">
            Destaques
          </h2>

          <div className="flex justify-center items-center gap-6 md:pl-[35px] md:border-l border-[#d0d0d0] text-[1.2rem] py-2">
            {["Alugar", "Comprar", "Lançamentos"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`
                relative py-1 inline-block group
                transition-colors duration-300 ease-in-out
                cursor-pointer
                ${activeTab === tab ? "text-site-primary" : "text-[#303030]"}
                hover:text-site-primary-hover
              `}
              >
                {tab}
                {/* Animated bottom border with fade effect */}
                <span
                  className={`
                  absolute bottom-0 left-0 h-[2px] w-1/2 w-full bg-site-primary
                  transition-opacity duration-300 ease-in-out
                  ${activeTab === tab ? "opacity-100" : "opacity-0"}
                  group-hover:opacity-100 group-hover:bg-site-primary
                `}
                ></span>
              </button>
            ))}
          </div>
        </div>

        <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-5 mb-10">
          {todosImoveis.map((imovel: Destaque) => (
            <Link
              key={imovel.id}
              href={`/imovel/${encodeURIComponent(toSlug(gerarTitulo(imovel)))}/${imovel.Codigo}`}
            >
              <ImovelCard
                key={imovel.id}
                imovel={imovel}
                activeTab={activeTab}
              ></ImovelCard>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
