"use client";

import { useCallback, useMemo, useState } from "react";
import { useAdminListHandlers } from "@/hooks/adminHandlers";
import { AdminHeaderFormularios } from "./adminHeaderFormulario";
import { ActionButtonsFormularios } from "./actionButtonsFormulario";
import { FormulariosTable } from "./formularioTable";
import { deleteFormularios, type FormularioPlain } from "@/lib/actions/formularios";

type TipoFormulario =
  | "WHATSAPP"
  | "FINANCIAMENTO"
  | "INFORMACOES"
  | "CONTATO"
  | "VISITA"
  | "ANUNCIEIMOVEL"
  | "ADMIMOVEL"
  | "ADMCONDOMINIO";

interface Props {
  initialFormularios: FormularioPlain[]; // <<< usa o tipo plain
}

export default function FormulariosListClient({ initialFormularios }: Props) {
  const [formularios, setFormularios] = useState<FormularioPlain[]>(initialFormularios);

  const [tipo, setTipo] = useState<TipoFormulario | "ALL">("ALL");
  const [codigoImovel, setCodigoImovel] = useState("");
  const [appliedCodigoImovel, setAppliedCodigoImovel] = useState("");
  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const {
    selectedIds,
    handleSelectAll,
    handleSelectOne,
    handleDelete,
  } = useAdminListHandlers<FormularioPlain["id"], FormularioPlain>({
    items: formularios,
    setItems: setFormularios,
    itemNameSingular: "formulário",
    routeBase: "/admin/formularios",
    actions: {
      delete: deleteFormularios,
    },
  });

  const filtered = useMemo(() => {
    const sd = startDate ? new Date(startDate) : undefined;
    const ed = endDate ? new Date(endDate) : undefined;

    return formularios.filter((f) => {
      if (appliedCodigoImovel && !(f.codigoImovel ?? "").toLowerCase().includes(appliedCodigoImovel.toLowerCase())) return false;
      if (tipo !== "ALL" && f.tipo !== tipo) return false;
      if (sd && new Date(f.dataEnvio) < sd) return false;
      if (ed) {
        const end = new Date(ed);
        end.setHours(23, 59, 59, 999);
        if (new Date(f.dataEnvio) > end) return false;
      }
      return true;
    });
  }, [formularios, tipo, appliedCodigoImovel, startDate, endDate]);

  const handleApply = useCallback(() => {
    setAppliedCodigoImovel(codigoImovel);
  }, [codigoImovel]);

  const handleClear = useCallback(() => {
    setTipo("ALL");
    setCodigoImovel("");
    setAppliedCodigoImovel("");
    setStartDate(undefined);
    setEndDate(undefined);
  }, []);

  const handleExcluir = useCallback(() => handleDelete(), [handleDelete]);

  return (
    <div>
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-10">
          <AdminHeaderFormularios
            title="Central de Leads"
            subtitle="Gerencie os leads cadastrados no site."
            totalLabel="Total de Leads"
            total={filtered.length}
            selecionados={selectedIds.length}
            tipoValue={tipo}
            codigoImovel={codigoImovel}
            startDate={startDate}
            endDate={endDate}
            onChangeTipo={setTipo}
            onChangeCodigoImovel={setCodigoImovel}
            onChangeStartDate={setStartDate}
            onChangeEndDate={setEndDate}
            onApply={handleApply}
            onClear={handleClear}
          />

          <ActionButtonsFormularios
            data={filtered}
            onExcluir={handleExcluir}
            filename="formularios_filtrados"
          />

          <FormulariosTable
            data={filtered}
            selectedIds={selectedIds}
            onSelectAll={handleSelectAll}
            onSelect={handleSelectOne}
          />
        </div>
      </main>
    </div>
  );
}
