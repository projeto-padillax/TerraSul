"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2, Plus } from "lucide-react";
import {
  FieldValues,
  Path,
  UseFormReturn,
  useFieldArray,
  ArrayPath,
} from "react-hook-form";

type EspecialFormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  corretores: { id: string; name: string }[];
};

export function EspecialFormFields<T extends FieldValues>({
  form,
  corretores,
}: EspecialFormFieldsProps<T>) {
  // Correção principal: declarar "name" com o tipo correto
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "codigosImoveis" as ArrayPath<T>,
  });

  return (
    <>
      {/* Status */}
      <FormField
        control={form.control}
        name={"status" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex items-center gap-8">
            <Label className="text-gray-900 font-medium text-lg w-28">Status:</Label>
            <FormControl>
              <RadioGroup
                value={field.value ? "ativo" : "inativo"}
                onValueChange={(value) => field.onChange(value === "ativo")}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="ativo" id="ativo" className="scale-110" />
                  <Label htmlFor="ativo" className="text-gray-700 text-base font-medium">
                    Ativo
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="inativo" id="inativo" className="scale-110" />
                  <Label htmlFor="inativo" className="text-gray-700 text-base font-medium">
                    Inativo
                  </Label>
                </div>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Corretor */}
      <FormField
        control={form.control}
        name={"corretorId" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex items-center gap-8">
            <Label className="text-gray-900 font-medium text-lg w-28">Corretor:</Label>
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um corretor" />
                </SelectTrigger>
                <SelectContent>
                  {corretores.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Nome do cliente */}
      <FormField
        control={form.control}
        name={"nomeCliente" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex items-center gap-8">
            <Label className="text-gray-900 font-medium text-lg w-28">Cliente:</Label>
            <FormControl>
              <Input placeholder="Digite o nome do cliente" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Mensagem */}
      <FormField
        control={form.control}
        name={"mensagem" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex items-center gap-8">
            <Label className="text-gray-900 font-medium text-lg w-28">Mensagem:</Label>
            <FormControl>
              <Input placeholder="Digite a mensagem" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Códigos dos imóveis */}
      <div className="flex items-start gap-8">
        <Label className="text-gray-900 font-medium text-lg w-28 mt-2">Imóveis:</Label>
        <div className="space-y-2 flex-1">
          {fields.map((field, index) => (
            <FormField
              key={field.id}
              control={form.control}
              name={`codigosImoveis.${index}` as Path<T>}
              render={({ field }) => (
                <FormItem className="flex gap-2 items-center">
                  <FormControl>
                    <Input {...field} placeholder={`Código #${index + 1}`} />
                  </FormControl>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => remove(index)}
                    size="icon"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <FormMessage />
                </FormItem>
              )}
            />
          ))}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            onClick={() => append("" as any)}
            className="mt-2"
          >
            <Plus className="h-4 w-4 mr-1" />
            Adicionar código
          </Button>
        </div>
      </div>
    </>
  );
}
