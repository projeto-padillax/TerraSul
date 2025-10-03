"use client";

import { useModal } from "@/utils/ModalContext";
import { FaWhatsapp } from "react-icons/fa";

export default function FixedForm() {
  const { isModalOpen } = useModal();

   if (isModalOpen) return null;

  const scrollToSection = (section: string) => {
    const el = document.getElementById(section);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="bg-white md:hidden fixed left-0 z-50 bottom-0 w-full p-2">
      <div className="flex justify-around w-full gap-1 pb-2 pl-[50px]">
        <button
          onClick={ () => scrollToSection("sendMessage")}
          className="w-full appearance-none inline-flex gap-1  items-center justify-center px-2 py-0 text-sm leading-4 whitespace-nowrap rounded-full cursor-pointer h-12 tracking-normal font-bold normal-case bg-transparent border  text-[#303030] transition-colors ease-in-out duration-700 lg:hidden"
        >
          Mensagem
        </button>
        <button onClick={() => scrollToSection("agendarVisita")} className="w-full appearance-none inline-flex gap-1 items-center justify-center px-2 py-0 text-sm leading-4 whitespace-nowrap rounded-full cursor-pointer h-12 tracking-normal font-bold normal-case bg-site-primary text-[#303030] hover:bg-site-primary-hover transition-colors ease-in-out duration-500">
          Agendar Visita
        </button>
        <a
          href="https://wa.me/5551981214507" // substitua pelo seu número
          target="_blank"
          rel="noopener noreferrer"
          className="bg-[#25d366] hover:bg-[#1ebe5d] rounded-full h-12 items-center justify-center inline-flex px-4"
        >
          <FaWhatsapp size={24} color="#fff" />
        </a>
      </div>
    </div>
  );
}
