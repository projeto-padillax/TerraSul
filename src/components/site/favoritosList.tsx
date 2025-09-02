"use client";

import { useFavoriteStore } from "@/lib/stores/useFavoriteStore";
import { Destaque } from "@/lib/types/destaque";
import Link from "next/link";
import { ImovelCard } from "./imovelcard";
import { Imovel } from "@prisma/client";

export default function FavoritesList() {
  const favoritos = useFavoriteStore((state) => state.favorites);

  const comprar = favoritos.filter((favorito) => favorito.Status === "VENDA");
  const alugar = favoritos.filter((favorito) => favorito.Status === "ALUGUEL");

  if (favoritos.length === 0) {
    return (
      <p className="text-center text-gray-500 col-span-full py-8">
        Nenhum imóvel favoritado.
      </p>
    );
  }

  function toSlug(text: string): string {
    return text
      .normalize("NFD") // separa acentos das letras
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-zA-Z0-9\s-]/g, "") // remove caracteres especiais
      .trim() // remove espaços extras do começo/fim
      .replace(/\s+/g, "-") // troca espaços por -
      .replace(/-+/g, "-") // evita múltiplos hífens
      .toLowerCase();
  }

  function gerarTitulo(imovel: Imovel) {
    const capitalizar = (str: string) =>
      str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

    const categoria = imovel.Categoria ? capitalizar(imovel.Categoria) : "Imóvel";

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

  return (
    // Removidas as classes de padding: px-4 sm:px-6 lg:px-8
    // O container pai em Favoritos.tsx já define a largura e o padding externo.
    <div className="w-full py-8 space-y-10">
      {comprar.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#333] mb-6">
            Imóveis Favoritos para Comprar
          </h2>
          {/* Removido max-w-screen-xl mx-auto daqui */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {comprar.map((favorito: Destaque) => (
              <Link
                key={favorito.id}
                href={`/imovel/${encodeURIComponent(toSlug(gerarTitulo(favorito)))}/${favorito.Codigo}`}
              >
                <ImovelCard
                  imovel={favorito}
                  activeTab="comprar"
                />
              </Link>
            ))}
          </div>
        </section>
      )}

      {alugar.length > 0 && (
        <section>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold text-[#333] mb-6">
            Imóveis Favoritos para Alugar
          </h2>
          {/* Removido max-w-screen-xl mx-auto daqui */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {alugar.map((favorito: Destaque) => (
              <Link
                key={favorito.id}
                href={`/imovel/${encodeURIComponent(toSlug(gerarTitulo(favorito)))}/${favorito.Codigo}`}
              >
                <ImovelCard
                  imovel={favorito}
                  activeTab="alugar"
                />
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}