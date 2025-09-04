"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useEffect, useState } from "react";

interface TypeSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTypes: string[];
  onSelectionChange: (types: string[]) => void;
}

export function TypeSelectModal({
  isOpen,
  onClose,
  selectedTypes,
  onSelectionChange,
}: TypeSelectModalProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isMobile, setIsMobile] = useState(false);
  const [tempSelectedTypes, setTempSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      setTempSelectedTypes(selectedTypes);
    }
  }, [isOpen, selectedTypes]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 650);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const residenciaisTypes = [
    { id: "apartamento", label: "Apartamento" },
    { id: "casa", label: "Casa" },
    { id: "Casa em Condomínio", label: "Casa em Condomínio" },
    { id: "cobertura", label: "Cobertura" },
    { id: "comercial", label: "Comercial" },
    { id: "Sitio/Chácara", label: "Sitio/Chácara" },
    { id: "terreno", label: "Terreno" },
  ];

  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setTempSelectedTypes([...tempSelectedTypes, typeId]);
    } else {
      setTempSelectedTypes(tempSelectedTypes.filter((id) => id !== typeId));
    }
  };

  const handleConfirm = () => {
    onSelectionChange(tempSelectedTypes);
    // console.log("Selected Types:", tempSelectedTypes);
    onClose();
  };

  const allResidenciaisSelected = residenciaisTypes.every((t) =>
    tempSelectedTypes.includes(t.id)
  );
  const someResidenciaisSelected = residenciaisTypes.some((t) =>
    tempSelectedTypes.includes(t.id)
  );

  const handleSelectAll = (types: { id: string }[], checked: boolean) => {
    const ids = types.map((t) => t.id);
    if (checked) {
      const updated = [...tempSelectedTypes];
      ids.forEach((id) => {
        if (!updated.includes(id)) updated.push(id);
      });
      setTempSelectedTypes(updated);
    } else {
      setTempSelectedTypes(tempSelectedTypes.filter((id) => !ids.includes(id)));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[80vh] sm:max-w-sm max-w-sm overflow-hidden flex flex-col w-[80%]">
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Tipos de Imóveis</DialogTitle>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6">
          <div className="justify-items-center">
            {/* Residenciais */}
            <div className="border rounded-lg overflow-hidden">
              <div className="py-2 pl-3 border-b flex items-center gap-2 border-0 shadow-none bg-site-primary">
                <Checkbox
                  checked={allResidenciaisSelected}
                  ref={(el) => {
                    if (el)
                      (el as HTMLInputElement).indeterminate =
                        someResidenciaisSelected && !allResidenciaisSelected;
                  }}
                  onCheckedChange={(checked) =>
                    handleSelectAll(residenciaisTypes, checked as boolean)
                  }
                />
                <h3 className="font-medium text-white">Selecionar Todos</h3>
              </div>
              <div className="flex flex-col gap-2 py-3 mr-10">
                {residenciaisTypes.map((type) => (
                  <div
                    key={type.id}
                    className={`flex items-center gap-2 px-3 rounded-lg cursor-pointer transition-colors pr-0 border-0 shadow-none ${
                      tempSelectedTypes.includes(type.id)
                        ? "border  shadow-none"
                        : "hover:bg-gray-50 border border-transparent"
                    }`}
                    onClick={() =>
                      handleTypeChange(
                        type.id,
                        !tempSelectedTypes.includes(type.id)
                      )
                    }
                  >
                    <Checkbox
                      checked={tempSelectedTypes.includes(type.id)}
                      onCheckedChange={(checked) =>
                        handleTypeChange(type.id, checked as boolean)
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                    <span className="text-sm">{type.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="justify-self-center">
            <Button
              onClick={handleConfirm}
              className="order-1 sm:order-2 bg-site-primary hover:bg-site-primary-hover"
            >
              Confirmar Seleção
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
