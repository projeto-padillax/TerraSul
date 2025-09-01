"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { X, Menu } from "lucide-react";
import { PaginasConteudo } from "@prisma/client";

interface SidebarProps {
  dynamicItems: PaginasConteudo[];
}

export default function Sidebar({ dynamicItems }: SidebarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const fixedItems = [{ title: "Página Inicial", href: "/" }];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // const locacaoItems = [
  //   { title: "2ª via de Boleto", href: "/boleto" },
  //   { title: "Seguro Fiança", href: "/seguro-fianca" },
  //   { title: "Título de Capitalização", href: "/capitalizacao" },
  // ];

  // const condominiosItems = [
  //   { title: "Área Restrita", href: "/condominios/area-restrita" },
  //   { title: "Administração", href: "/condominios/administracao" },
  // ];

  // const proprietariosItems = [
  //   {
  //     title: "Administração de Imóveis para Locação",
  //     href: "/proprietarios/administracao-locacao",
  //   },
  //   {
  //     title: "Demonstrativos de Rendimentos Mensais",
  //     href: "/proprietarios/demonstrativos",
  //   },
  //   {
  //     title: "Administração e Avaliação de Imóveis para Venda",
  //     href: "/proprietarios/administracao-venda",
  //   },
  // ];

  const footerItems = [
    { title: "Anuncie seu Imóvel", href: "/anuncie-seu-imovel" },
    { title: "Sobre a Empresa", href: "/empresa" },
    { title: "Contato", href: "/contato" },
    { title: "Política de Privacidade", href: "/politica-de-privacidade" },
  ];

  const handleDynamicItemClick = async (item: PaginasConteudo) => {
    if (item.tipo === "link" && item.url) {
      if (item.url.startsWith("http")) {
        window.open(item.url, "_blank");
      } else {
        router.push(item.url);
      }
    } else if (item.tipo === "pagina" && item.titulo) {
      router.push(`/pagina/${item.titulo}`);
    }
    setIsOpen(false);
  };

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => {
          setIsOpen(!isOpen);
        }}
        className="rounded-md mr-0 text-[#303030] hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors"
        aria-label="Abrir menu"
      >
        <Menu className="h-6 w-6" />
      </button>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black opacity-60 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        ref={sidebarRef}
        className={`
        fixed z-[100] top-0 right-0 h-full w-80 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "translate-x-full"}
      `}
      >
        <div className="flex items-center justify-end p-4 border-b border-gray-200">
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            aria-label="Fechar menu lateral"
          >
            <X className="h-5 w-5 text-gray-600" />
          </button>
        </div>

        <div className="h-full overflow-y-auto pb-20 justify-items-center" style={{ scrollbarWidth: 'none' }}>
          <div className="border-b border-sky-500 w-9/12 ml-4">
            {fixedItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center justify-between py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span className="font-medium">{item.title}</span>
              </Link>
            ))}
          </div>

          {/* <div className="border-b border-sky-500 w-9/12 ml-4">
            <div className="py-3 ">
              <h3 className="font-semibold text-sm uppercase tracking-wide">
                Locação
              </h3>
            </div>
            {locacaoItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center justify-between py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span>{item.title}</span>
              </Link>
            ))}
          </div> */}

          {/* <div className="border-b border-sky-500 w-9/12 ml-4">
            <div className="py-3">
              <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                Condomínios
              </h3>
            </div>
            {condominiosItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center justify-between py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span>{item.title}</span>
              </Link>
            ))}
          </div> */}
{/* 
          <div className="border-b border-sky-500 w-9/12 ml-4">
            <div className="py-3">
              <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                Proprietários
              </h3>
            </div>
            {proprietariosItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center justify-between py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span>{item.title}</span>
              </Link>
            ))}
          </div> */}

          {dynamicItems.length > 0 && (
            <div className="border-b border-sky-500 w-9/12 ml-4">
              <div className="py-3">
                <h3 className="font-semibold text-gray-800 text-sm uppercase tracking-wide">
                  Páginas Adicionais
                </h3>
              </div>
              {dynamicItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleDynamicItemClick(item)}
                  className="w-full flex items-center justify-between py-3 text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors text-left"
                >
                  <span>{item.titulo}</span>
                  <div className="flex items-center">
                    {item.tipo === "link" && (
                      <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full mr-2">
                        Link
                      </span>
                    )}
                    {item.tipo === "pagina" && (
                      <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full mr-2">
                        Página
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          )}

          <div className="w-9/12 ml-4">
            {footerItems.map((item, index) => (
              <Link
                key={index}
                href={item.href}
                onClick={handleLinkClick}
                className="flex items-center justify-between py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <span>{item.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
