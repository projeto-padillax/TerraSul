"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTransition } from "react";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Save, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MaisAcessado } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { createMaisAcessado, updateMaisAcessado } from "@/lib/actions/links";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";

const maisAcessadoSchema = z.object({
  status: z.boolean(),
  titulo: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(100, "Título deve ter no máximo 100 caracteres."),
  url: z
    .string()
    .min(1, "URL é obrigatória.")
    .url("URL inválida.")
    .refine((url) => url.startsWith("https://"), {
      message: "URL deve começar com https://",
    }),
});

export type MaisAcessadoInput = z.infer<typeof maisAcessadoSchema>;

interface MaisAcessadoFormProps {
  maisAcessado?: MaisAcessado; // Opcional - se não existir, é criação
  mode: "create" | "edit";
}

export default function MaisAcessadoForm({
  maisAcessado,
  mode,
}: MaisAcessadoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = mode === "edit" && maisAcessado;

  const form = useForm<MaisAcessadoInput>({
    resolver: zodResolver(maisAcessadoSchema),
    defaultValues: {
      status: maisAcessado?.status ?? true,
      titulo: maisAcessado?.titulo ?? "",
      url: maisAcessado?.url ?? "",
    },
  });

  const onSubmit = (values: MaisAcessadoInput) => {
    startTransition(async () => {
      try {
        if (isEditing) {
          await updateMaisAcessado({
            ...values,
            id: maisAcessado.id,
          });
          toast.success("Link editado com sucesso!");
        } else {
          const maisAcessadoData = {
            ...values,
          };
          await createMaisAcessado(maisAcessadoData);
          toast.success("Link criado com sucesso!");
        }

        router.push("/admin/links");
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Erro ao ${isEditing ? "editar" : "criar"} link`;
        toast.error(errorMessage);
      }
    });
  };

  const handleBack = () => {
    router.push("/admin/links");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-8 space-y-8">
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Site *</FormLabel>
                  <FormControl>
                    <RadioGroup
                      value={field.value ? "ativo" : "inativo"}
                      onValueChange={(value) =>
                        field.onChange(value === "ativo")
                      }
                      className="flex gap-6"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="ativo"
                          id="ativo"
                          className="scale-110"
                        />
                        <Label
                          htmlFor="ativo"
                          className="text-gray-700 text-base font-medium"
                        >
                          Ativo
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem
                          value="inativo"
                          id="inativo"
                          className="scale-110"
                        />
                        <Label
                          htmlFor="inativo"
                          className="text-gray-700 text-base font-medium"
                        >
                          Inativo
                        </Label>
                      </div>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="titulo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Site *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Imobiliária Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Site *</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: Imobiliária Silva" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Buttons */}
        <Card className="border border-gray-200 rounded-xl shadow-sm bg-white mt-6">
          <CardContent className="p-6">
            <div className="flex gap-4">
              <Button
                type="submit"
                size="lg"
                disabled={isPending}
                className="cursor-pointer"
              >
                {isPending ? (
                  <>
                    <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    {isEditing ? "Salvando..." : "Criando..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {isEditing ? "Salvar" : "Criar"}
                  </>
                )}
              </Button>
              <Button
                type="button"
                className="cursor-pointer"
                variant="outline"
                onClick={handleBack}
                size="lg"
                disabled={isPending}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Voltar
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </Form>
  );
}
