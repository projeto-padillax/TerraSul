"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Save, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";

import { ImoveisCorretor as ImoveisCorretorORM } from "@prisma/client";
import { createEspecial, updateEspecial } from "@/lib/actions/especiais";

import z from "zod";
import { useTransition } from "react";
import { EspecialFormFields } from "./especialFormField";

const especialSchema = z.object({
  status: z.boolean(),
  nomeCliente: z.string().min(1, "Nome é obrigatório."),
  mensagem: z.string().min(1, "Mensagem é obrigatória."),
  corretorId: z.cuid("Corretor é obrigatório"),
  codigosImoveis: z.array(z.string().min(1,"Codigo deve ter no mínimo 1 caractere")).optional(),
});

export type EspecialInput = z.infer<typeof especialSchema>;

type EspecialFormProps = {
  especial?: ImoveisCorretorORM;
  corretores: { id: string; name: string }[];
};

export default function EspecialForm({ especial, corretores }: EspecialFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const isEditing = Boolean(especial);
  const pageTitle = isEditing ? "Editar Seleção Especial" : "Nova Seleção Especial de Imóveis";
  const pageSubtitle = isEditing
    ? `Edite as informações da Seleção Especial ${especial?.nomeCliente}`
    : "Crie uma nova seleção especial";

  const form = useForm<EspecialInput>({
    resolver: zodResolver(especialSchema),
    defaultValues: {
      status: especial?.status ?? true,
      nomeCliente: especial?.nomeCliente ?? "",
      mensagem: especial?.mensagem ?? "",
      corretorId: especial?.corretorId ?? "",
      codigosImoveis: especial?.codigosImoveis ?? [],
    },
  });

  const onSubmit = (values: EspecialInput) => {
  startTransition(async () => {
    try {
      if (isEditing) {
        await updateEspecial({
          ...values,
          id: especial!.id,
          codigosImoveis: values.codigosImoveis ?? [],
        });
        toast.success("Seleção Especial editado com sucesso!");
      } else {
        await createEspecial(values);
        toast.success("Seleção Especial criado com sucesso!");
      }

      router.push("/admin/especiais");
    } catch (error) {
      console.error(error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : `Erro ao ${isEditing ? "editar" : "criar"} seleção especial`;
      toast.error(errorMessage);
    }
  });
};

  const handleBack = () => {
    router.push("/admin/especiais");
  };

  return (
    <main className="py-12">
      <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-10">
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-8 border border-gray-200">
            <h1 className="text-3xl font-semibold text-gray-900 mb-2">{pageTitle}</h1>
            <p className="text-lg text-gray-600">{pageSubtitle}</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <Card>
              <CardContent className="p-8 space-y-8">
                <EspecialFormFields form={form} corretores={corretores} />
              </CardContent>
            </Card>

            <Card className="border border-gray-200 rounded-xl shadow-sm bg-white mt-6">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Button type="submit" size="lg" disabled={isPending}>
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
      </div>
    </main>
  );
}
