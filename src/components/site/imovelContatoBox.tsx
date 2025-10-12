"use client";

import Image from "next/image";
import MaisInformacoesForm from "./maisInformacoesForm";
import FormularioModal from "./formularioModal";
import { useState } from "react";
import AgendamentoModal from "./agendamentoModal";
import { CorretorExterno } from "@prisma/client";
import Link from "next/link";
import { useModal } from "@/utils/ModalContext";

interface ImovelContatoBoxProps {
  financiamento?: boolean;
  codigoImovel: string;
  valor: number;              // preço atual
  valorAnterior?: number;     // preço anterior (opcional)
  corretor?: CorretorExterno;
  isRelease?: boolean;
}

export default function ImovelContatoBox({
  codigoImovel,
  valor,
  valorAnterior,
  corretor,
  isRelease = false,
}: ImovelContatoBoxProps) {
  const isVenda = true;

  const [abrirAgendamento, setAbrirAgendamento] = useState(false);
  const [modalAberta, setModalAberta] = useState(false);
  const [tipoModal, setTipoModal] = useState<"whatsapp" | "financiamento" | null>(null);
  const { setIsModalOpen } = useModal();

  const abrirModal = (tipo: "whatsapp" | "financiamento") => {
    setTipoModal(tipo);
    setModalAberta(true);
    setIsModalOpen(true);
  };

  const fmt = (n: number) =>
    n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  const mostrarAnterior = typeof valorAnterior === "number" && valorAnterior > valor;
  console.log(mostrarAnterior)

  return (
    <div id="sendMessage" className="block scroll-mt-6">
      <div className="lg:sticky lg:top-2">
        <div className="flex justify-center mb-6 lg:mb-8">
          <div className="flex items-start gap-4">
            <div className="w-[70px] h-[70px] rounded-md overflow-hidden">
              <Image
                src={corretor?.foto || "/logo.svg"}
                alt="Corretor"
                width={70}
                height={70}
                className="object-cover w-full h-full"
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-[#111827] tracking-wide uppercase mb-3">
                {corretor?.name || "TerraSul"}
              </p>

              <div className="text-[12px] text-black flex items-center gap-5">
                <button
                  type="button"
                  className="bg-[#25d366] hover:bg-[#1ebe5d] p-1 px-2 rounded-lg text-white transition duration-300 transform hover:shadow-lg cursor-pointer"
                  onClick={() => abrirModal("whatsapp")}
                >
                  Enviar WhatsApp
                </button>

                <Link
                  href="https://wa.me/5551981214507"
                  className="bg-black p-1 px-2 rounded-lg text-white transition duration-300 transform hover:bg-[#303030] hover:shadow-lg cursor-pointer"
                  aria-label="Ligar para o número (51) 3257-7777"
                >
                  Ligar
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-md lg:shadow-[0_0_15px_5px_rgba(0,0,0,0.12)] p-4 sm:p-5 lg:p-8 w-full lg:max-w-[460px] mx-auto">
          <p className={`text-xs text-[#303030] ${isRelease ? "block" : "hidden"}`}>A partir de</p>

          <div className="flex items-center justify-between gap-2 mb-1">
            <div className="flex flex-col">
              {mostrarAnterior && (
                <span className="text-xs sm:text-sm text-gray-500 line-through">
                  {fmt(valorAnterior!)}
                </span>
              )}
              <p className="text-[20px] sm:text-[20px] font-semibold text-[#303030] truncate">
                {valor > 0 ? fmt(valor) : "Consultar"}
              </p>
            </div>

            {isVenda && (
              <button
                onClick={() => abrirModal("financiamento")}
                className="text-[12px] border-b border-grey-300 pb-[1px] text-[#303030] hover:text-black hover:border-black transition lg:w-fit"
              >
                Simular financiamento
              </button>
            )}
          </div>

          <div className="mt-2 sm:mt-2">
            <MaisInformacoesForm
              codigoImovel={codigoImovel}
              codigoCorretor={corretor?.codigo}
            />
          </div>

          <button
            onClick={() => setAbrirAgendamento(true)}
            className="mt-4 w-full hover:bg-gray-100 text-black font-medium text-sm py-3 px-4 rounded-[8px] flex items-center gap-2 justify-center transition"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 31 29"
              className="opacity-70 w-[20px] h-[20px] sm:w-[20px] sm:h-[20px]"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.9774 14.9046C24.9774 13.2704 24.9774 11.6677 24.9774 10.0472C17.2807 10.0472 9.61962 10.0472 1.93249 10.0472C1.927 10.1678 1.91604 10.2761 1.91604 10.3844C1.91467 14.1903 1.9133 17.9962 1.91467 21.802C1.91467 22.8851 2.73863 23.6666 3.89026 23.6679C6.51296 23.6734 9.13566 23.6693 11.7584 23.6693C13.1198 23.6693 14.4811 23.6693 15.8425 23.6693C15.9618 23.6693 16.0825 23.6693 16.2196 23.6693C16.2196 23.9792 16.2196 24.252 16.2196 24.5495C16.14 24.5577 16.066 24.5714 15.9906 24.5714C11.9174 24.5714 7.84419 24.5755 3.76961 24.5701C2.43975 24.5673 1.3745 23.7255 1.07425 22.4546C1.01667 22.2078 1.00296 21.946 1.00296 21.691C0.998847 16.5457 1.00022 11.4003 1.00022 6.25503C1.00022 4.4892 2.16281 3.33208 3.93824 3.33071C4.40575 3.33071 4.87326 3.33071 5.39423 3.33071C5.39423 3.0853 5.39149 2.85634 5.39423 2.62876C5.40932 1.71979 6.09618 1.00689 6.96265 1.00003C7.83871 0.994547 8.53106 1.71979 8.53517 2.65069C8.53517 2.86183 8.53517 3.07296 8.53517 3.30603C11.8324 3.30603 15.1077 3.30603 18.4406 3.30603C18.4406 3.0853 18.4378 2.85634 18.4406 2.62876C18.4543 1.69649 19.1096 1.01785 19.9994 1.00825C20.8535 0.998655 21.5376 1.68004 21.576 2.58626C21.5856 2.81796 21.5774 3.0524 21.5774 3.32934C22.0984 3.32934 22.5974 3.32797 23.0951 3.32934C24.4674 3.33345 25.5697 4.22048 25.8466 5.55445C25.8823 5.7272 25.8891 5.90817 25.8891 6.0864C25.8905 8.93257 25.8905 11.7774 25.8891 14.6249C25.8891 14.7113 25.8795 14.799 25.8741 14.9046C25.5848 14.9046 25.312 14.9046 24.9774 14.9046ZM1.91329 9.07789C9.62099 9.07789 17.2876 9.07789 24.961 9.07789C24.961 7.99481 24.9966 6.93641 24.9486 5.88075C24.9116 5.05678 24.2549 4.36991 23.4447 4.28491C22.8414 4.22185 22.2259 4.27258 21.5801 4.27258C21.5801 4.52621 21.5897 4.75791 21.5788 4.98823C21.5349 5.91502 20.859 6.56624 19.9624 6.54979C19.089 6.53333 18.4543 5.86293 18.4433 4.93888C18.4406 4.71952 18.4419 4.50153 18.4419 4.27806C15.1187 4.27806 11.8434 4.27806 8.53517 4.27806C8.53517 4.51661 8.53654 4.73735 8.53517 4.95808C8.5242 5.87801 7.85379 6.5539 6.95716 6.55253C6.07424 6.55116 5.40246 5.85744 5.39423 4.93888C5.39149 4.71952 5.39423 4.50016 5.39423 4.26024C4.81431 4.26024 4.28099 4.2575 3.74631 4.26024C2.85379 4.26709 2.11757 4.87719 1.96402 5.76147C1.9133 6.05486 1.91878 6.36059 1.91604 6.65947C1.90918 7.4615 1.91329 8.26078 1.91329 9.07789ZM7.60564 3.8037C7.60564 3.42531 7.60701 3.04691 7.60701 2.66852C7.60701 2.64658 7.60701 2.62465 7.60701 2.60134C7.5933 2.20787 7.33281 1.93367 6.9695 1.92818C6.61305 1.9227 6.32925 2.20375 6.32514 2.59448C6.31691 3.38417 6.31691 4.17524 6.32377 4.96493C6.32651 5.34469 6.62127 5.64493 6.96402 5.64082C7.33007 5.63808 7.59604 5.36799 7.60427 4.97315C7.61249 4.58379 7.60564 4.19443 7.60564 3.8037ZM19.3619 3.78177C19.3605 4.18209 19.3495 4.58242 19.3632 4.98412C19.3769 5.38171 19.6525 5.64493 20.0158 5.63534C20.3764 5.62711 20.6492 5.34881 20.6533 4.95808C20.6602 4.17935 20.6602 3.39926 20.6533 2.62054C20.6492 2.22158 20.349 1.91996 19.9911 1.92818C19.6388 1.93504 19.3742 2.21472 19.3646 2.61368C19.3536 3.00304 19.3619 3.3924 19.3619 3.78177Z"
                fill="black"
              />

              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M29.9993 23.0853C30.0459 26.0987 27.5453 28.6405 24.4866 28.6885C21.4581 28.7365 18.9122 26.2564 18.8326 23.2594C18.7504 20.1322 21.2812 17.5451 24.3276 17.5163C27.4575 17.4862 29.95 19.9169 29.9993 23.0853ZM24.4194 18.4404C21.8008 18.4637 19.7183 20.5462 19.7512 23.11C19.7827 25.7286 21.8707 27.785 24.4811 27.7686C27.0147 27.7535 29.1164 25.5997 29.0904 23.0496C29.0629 20.4969 26.9571 18.4198 24.4194 18.4404Z"
                fill="black"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M24.8746 21.1371C24.8746 21.6389 24.8595 22.1407 24.8842 22.6411C24.891 22.7987 24.9678 22.9852 25.0761 23.099C25.6067 23.6556 26.1592 24.1903 26.7007 24.736C26.9461 24.9827 26.9722 25.2748 26.7707 25.4667C26.5787 25.6504 26.3018 25.6271 26.0632 25.3913C25.423 24.7565 24.7772 24.1245 24.1548 23.4719C24.0383 23.3499 23.9574 23.1415 23.9546 22.9715C23.9368 21.8569 23.9437 20.7436 23.9464 19.629C23.9478 19.241 24.1219 19.0368 24.4331 19.045C24.7169 19.0518 24.8718 19.2575 24.8718 19.6345C24.8759 20.1335 24.8746 20.6353 24.8746 21.1371Z"
                fill="black"
              />
            </svg>
            <span className="text-[#303030]">Agendar visita</span>
          </button>
        </div>
      </div>

      {modalAberta && tipoModal && (
        <FormularioModal
          open={modalAberta}
          onClose={() => {
            setModalAberta(false);
            setIsModalOpen(false);
          }}
          tipo={tipoModal}
          valorImovel={valor}
          codigoImovel={codigoImovel}
          codigoCorretor={corretor?.codigo}
        />
      )}

      <AgendamentoModal
        open={abrirAgendamento}
        onClose={() => setAbrirAgendamento(false)}
        codigoImovel={codigoImovel}
        codigoCorretor={corretor?.codigo}
      />
    </div>
  );
}
