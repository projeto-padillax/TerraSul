"use client";

import { FaWhatsapp } from "react-icons/fa";
import FormularioModal from "./formularioModal";
import { Button } from "../ui/button";
import { useState } from "react";

export default function WhatsAppButton() {
  const [modalAberta, setModalAberta] = useState(false)
  return (
    <>
      <button
        // href="https://wa.me/5551981214507" // substitua pelo seu número
        // target="_blank"
        onClick={() => setModalAberta(true)}
        rel="noopener noreferrer"
        className="whatsapp-float"
        id="form_whats_flutuante"
      >
        <FaWhatsapp size={32} color="#fff" />
      </button>
      <FormularioModal
        open={modalAberta}
        onClose={() => {
          setModalAberta(false);
        }}
        tipo={"whatsapp"}
        valorImovel={0}
        codigoImovel={""}
        codigoCorretor={""}
      />
    </>
  );
}
