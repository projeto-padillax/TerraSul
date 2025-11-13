"use client";

// import Image from "next/image";
import MaisInformacoesForm from "./maisInformacoesForm";
import FormularioModal from "./formularioModal";
import { useState } from "react";
import AgendamentoModal from "./agendamentoModal";
import { CorretorExterno } from "@prisma/client";
// import Link from "next/link";
import { useModal } from "@/utils/ModalContext";

interface ImovelContatoBoxProps {
  financiamento?: boolean;
  codigoImovel: string;
  valor: number; // preço atual
  valorAnterior?: number; // preço anterior (opcional)
  corretor?: CorretorExterno;
  isRelease?: boolean;
}

export default function ImovelContatoBox({
  codigoImovel,
  valor,
  // valorAnterior,
  corretor,
}: // isRelease = false,
ImovelContatoBoxProps) {
  // const isVenda = true;

  const [abrirAgendamento, setAbrirAgendamento] = useState(false);
  const [modalAberta, setModalAberta] = useState(false);
  // const [tipoModal, setTipoModal] = useState<"whatsapp" | "financiamento" | null>(null);
  const [tipoModal] = useState<"whatsapp" | "financiamento" | null>(null);

  const { setIsModalOpen } = useModal();

  // const abrirModal = (tipo: "whatsapp" | "financiamento") => {
  //   setTipoModal(tipo);
  //   setModalAberta(true);
  //   setIsModalOpen(true);
  // };

  // const fmt = (n: number) =>
  //   n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 0 });

  // const mostrarAnterior = typeof valorAnterior === "number" && valorAnterior > valor;

  return (
    <div className="bg-white rounded-2xl shadow-md lg:shadow-[0_0_15px_5px_rgba(0,0,0,0.12)] p-4 sm:p-5 lg:p-8 w-full lg:max-w-[460px] mx-auto">
      <h1 className="text-xl font-bold tracking-tight text-[#303030]">
        Mais informações
      </h1>

      {/* <p className={`text-xs text-[#303030] ${isRelease ? "block" : "hidden"}`}>A partir de</p>

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
                className="text-[12px] cursor-pointer border-b border-grey-300 pb-[1px] text-[#303030] hover:text-black hover:border-black transition lg:w-fit"
                id="form_financiamento"
              >
                Simular financiamento
              </button>
            )}
          </div> */}
      <div className="mt-4 sm:mt-5 lg:mt-8">
        <MaisInformacoesForm
          codigoImovel={codigoImovel}
          codigoCorretor={corretor?.codigo}
        />
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
        onClose={() => {
          setAbrirAgendamento(false);
          setIsModalOpen(false);
        }}
        codigoImovel={codigoImovel}
        codigoCorretor={corretor?.codigo}
      />
    </div>
  );
}
