"use client";

import { use, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface LocationOption {
  cidade: string;
  bairros: string[];
}

interface LocationSelectModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocations: string[];
  onSelectionChange: (locations: string[]) => void;
}

export function LocationSelectModal({
  isOpen,
  onClose,
  selectedLocations,
  onSelectionChange,
}: LocationSelectModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [cidades, setCidades] = useState<LocationOption[]>([]);
  const [tempSelectedLocations, setTempSelectedLocations] = useState<string[]>(
    []
  );
  const [selectedCidade, setSelectedCidade] = useState<string>("");

  useEffect(() => {
    if (isOpen) {
      setTempSelectedLocations(selectedLocations);
      if (selectedLocations.length > 0) {
        setSelectedCidade(selectedLocations[0].split(":")[0] || "");
      }
    }
  }, [isOpen, selectedLocations]);

  useEffect(() => {
    const fetchCidades = async () => {
      try {
        const res = await fetch("/api/vista/cidades");
        if (!res.ok) throw new Error("Erro ao buscar cidades");
        const data = await res.json();
        const cidadesMapeadas = data.cidades.map(
          (item: { cidade: string; bairros: string[] }) => ({
            cidade:
              item.cidade.charAt(0).toUpperCase() +
              item.cidade.slice(1).toLowerCase(),
            bairros: item.bairros,
          })
        );

        const cidadesOrdenadas: LocationOption[] = cidadesMapeadas.sort(
          (a: LocationOption, b: LocationOption) => {
            if (a.cidade.toLowerCase() === "porto alegre") return -1;
            if (b.cidade.toLowerCase() === "porto alegre") return 1;
            return a.cidade.localeCompare(b.cidade);
          }
        );

        setCidades(cidadesOrdenadas);

        // já seleciona porto alegre por padrão se existir
        if (cidadesOrdenadas.length > 0) {
          setSelectedCidade(
            cidadesOrdenadas.find(
              (c) => c.cidade.toLowerCase() === "porto alegre"
            )?.cidade || cidadesOrdenadas[0].cidade
          );
        }
      } catch (error) {
        console.error("Erro ao carregar cidades:", error);
      }
    };
    fetchCidades();
  }, []);

  const handleLocationChange = (locationKey: string, checked: boolean) => {
    if (checked) {
      let novasSelecoes = [...tempSelectedLocations, locationKey];

      if (!locationKey.toLowerCase().includes(":all")) {
        novasSelecoes = novasSelecoes.filter(
          (loc) => !loc.toLowerCase().includes(":all")
        );
      }

      setTempSelectedLocations(novasSelecoes);
    } else {
      setTempSelectedLocations(
        tempSelectedLocations.filter(
          (loc) => loc.toLowerCase() !== locationKey.toLowerCase()
        )
      );
    }
  };

  const handleConfirm = () => {
    if(tempSelectedLocations.length > 0){
      onSelectionChange(tempSelectedLocations);
    }else{
      onSelectionChange([selectedCidade])
    }
    onClose();
  };

  const cidadeAtual = cidades.find((c) => c.cidade === selectedCidade);

  const bairrosFiltrados =
    cidadeAtual?.bairros.filter((bairro) =>
      bairro.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="sm:max-w-4xl max-w-4xl max-h-[80vh] overflow-hidden flex flex-col w-[80%]"
      >
        <DialogHeader className="border-b pb-4">
          <DialogTitle>Localização</DialogTitle>
        </DialogHeader>

        {/* Select de Cidades */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Select
            value={selectedCidade}
            onValueChange={(value) => {
              setSelectedCidade(value);
              setTempSelectedLocations([]);
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma cidade" />
            </SelectTrigger>
            <SelectContent>
              {cidades.map((cidade) => (
                <SelectItem key={cidade.cidade} value={cidade.cidade}>
                  {cidade.cidade}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative mb-4 w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar bairro..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 focus-visible:ring-[0px] text-sm"
            />
          </div>
        </div>

        {/* Search só para bairros */}

        {/* Lista de bairros */}
        {/* Lista de bairros */}
        <div className="flex-1 overflow-y-auto pr-4">
          {cidadeAtual && (
            <>
              {(() => {
                const principais = [
                  "Aberta dos Morros",
                  "Alphaville",
                  "Cavalhada",
                  "Cristal",
                  "Espírito Santo",
                  "Golden Lake",
                  "Guarujá",
                  "Hípica",
                  "Ipanema",
                  "Jardim Isabel",
                  "Menino Deus",
                  "Nonoai",
                  "Pedra Redonda",
                  "Santa Tereza",
                  "Sétimo Céu",
                  "Teresópolis",
                  "Terraville",
                  "Tristeza",
                  "Vila Assunção",
                  "Vila Conceição",
                  "Vila Nova",
                ];

                const principaisFiltrados = principais.filter((bairro) =>
                  bairro.toLowerCase().includes(searchTerm.toLowerCase())
                );

                const outros = bairrosFiltrados
                  .filter((bairro) => !principais.includes(bairro))
                  .sort((a, b) => a.localeCompare(b, "pt-BR"));

                const renderSecao = (titulo: string, lista: string[]) => {
                  if (lista.length === 0) return null;

                  const allKeys = lista.map(
                    (bairro) => `${selectedCidade}:${bairro}`
                  );
                  const selecionados = allKeys.filter((key) =>
                    tempSelectedLocations.some(
                      (loc) => loc.toLowerCase() === key.toLowerCase()
                    )
                  );

                  const allSelected = selecionados.length === allKeys.length;

                  return (
                    <div className="space-y-2">
                      {/* Cabeçalho da seção com checkbox */}
                      <div className="flex items-center gap-2 bg-site-primary text-white px-3 py-2 rounded-md">
                        <Checkbox
                          checked={allSelected}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              // seleciona todos da seção
                              const novos = allKeys.filter(
                                (key) =>
                                  !tempSelectedLocations.some(
                                    (loc) =>
                                      loc.toLowerCase() === key.toLowerCase()
                                  )
                              );
                              setTempSelectedLocations([
                                ...tempSelectedLocations,
                                ...novos,
                              ]);
                            } else {
                              // remove todos da seção
                              setTempSelectedLocations(
                                tempSelectedLocations.filter(
                                  (loc) =>
                                    !lista.some(
                                      (bairro) =>
                                        loc.toLowerCase() ===
                                        `${selectedCidade}:${bairro}`.toLowerCase()
                                    )
                                )
                              );
                            }
                          }}
                          // indeterminate={partiallySelected}
                          className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#4F7DC3] data-[state=checked]:border-white"
                        />
                        <span className="font-medium">{titulo}</span>
                      </div>

                      {/* Lista de bairros */}
                      <div className="columns-1 sm:columns-3 lg:columns-4 gap-4 bg-white p-3 rounded-md">
                        {lista.map((bairro) => {
                          const locationKey = `${selectedCidade}:${bairro}`;
                          return (
                            <div
                              key={bairro}
                              className="break-inside-avoid flex items-center gap-2 mb-2"
                            >
                              <Checkbox
                                id={locationKey}
                                checked={tempSelectedLocations.some(
                                  (loc) =>
                                    loc.toLowerCase() ===
                                    locationKey.toLowerCase()
                                )}
                                onCheckedChange={(checked) =>
                                  handleLocationChange(
                                    locationKey,
                                    checked as boolean
                                  )
                                }
                              />
                              <label
                                htmlFor={locationKey}
                                className="text-sm cursor-pointer"
                              >
                                {bairro}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                };

                return (
                  <>
                    {renderSecao("Principais Bairros", principaisFiltrados)}
                    {outros.length > 0 && renderSecao("Outros Bairros", outros)}
                  </>
                );
              })()}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-center pt-4 border-t">
          <Button
            onClick={handleConfirm}
            className="bg-site-primary hover:bg-site-primary-hover cursor-pointer"
          >
            Confirmar Seleção
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
