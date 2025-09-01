"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Save, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { createChamada, updateChamada } from "@/lib/actions/chamada";
import { FormFields } from "@/components/admin/formFields";
import { Chamadas as ChamadaORM } from "@prisma/client";

// Schema unificado
const chamadaSchema = z.object({
    status: z.boolean(),
    imagem: z.string().url("O banner é obrigatório."),
    titulo: z
        .string()
        .min(1, "Título é obrigatório.")
        .max(100, "Título deve ter no máximo 100 caracteres."),
    subtitulo: z
        .string()
        .min(1, "Subtítulo é obrigatório.")
        .max(200, "Subtítulo deve ter no máximo 200 caracteres."),
    ordem: z.number().int().positive().max(999),
    url: z
        .string()
        .min(1, "URL é obrigatória.")
        .url("URL inválida.")
        .refine(
            (url) => url.startsWith("https://"),
            { message: "URL deve começar com https://" }
        ),
    publicId: z.string().min(1, "publicId é obrigatório")
});

export type ChamadaInput = z.infer<typeof chamadaSchema>;

interface ChamadaFormProps {
    chamada?: ChamadaORM; // Opcional - se nao existir, eh criacao
    mode: "create" | "edit";
}

export default function ChamadaForm({ chamada, mode }: ChamadaFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [previewImage, setPreviewImage] = useState<string>(
        chamada?.imagem ?? ""
    );

    const isEditing = mode === "edit" && chamada;

    const form = useForm<ChamadaInput>({
        resolver: zodResolver(chamadaSchema),
        defaultValues: {
            status: chamada?.status ?? true,
            imagem: chamada?.imagem ?? "",
            titulo: chamada?.titulo ?? "",
            subtitulo: chamada?.subtitulo ?? "",
            ordem: chamada?.ordem ?? 1,
            url: chamada?.url ?? "",
            publicId: chamada?.publicId ?? "",
        },
    });

    const onSubmit = (values: ChamadaInput) => {
        startTransition(async () => {
            try {
                if (isEditing) {
                    await updateChamada({
                        ...values,
                        id: chamada.id,
                    });
                    toast.success("Chamada editada com sucesso!");
                } else {
                    const chamadaData = {
                        ...values,
                    };
                    await createChamada(chamadaData);
                    toast.success("Chamada criada com sucesso!");
                }

                router.push("/admin/chamadas");
            } catch (error) {
                console.error(error);
                const errorMessage = error instanceof Error
                    ? error.message
                    : `Erro ao ${isEditing ? 'editar' : 'criar'} chamada`;
                toast.error(errorMessage);
            }
        });
    };

    const handleBack = () => {
        router.push("/admin/chamadas");
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <Card>
                    <CardContent className="p-8 space-y-8">
                        <FormFields
                            form={form}
                            previewImage={previewImage ?? ""}
                            setPreviewImage={setPreviewImage}
                            showOrdenacao
                            showSubtitulo
                            showImagem
                            imagemLabel="Foto"
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