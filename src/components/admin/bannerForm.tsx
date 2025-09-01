"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { Form } from "@/components/ui/form";
import { Save, ArrowLeft } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Banners as BannerORM } from "@prisma/client";
import { FormFields } from "./formFields";
import { createBanner, updateBanner } from "@/lib/actions/banner";
import { useRouter } from "next/navigation";

const bannerSchema = z.object({
    status: z.boolean(),
    imagem: z.string().url("O banner é obrigatório."),
    titulo: z
        .string()
        .min(1, "Título é obrigatório.")
        .max(100, "Título deve ter no máximo 100 caracteres."),
    subtitulo: z.string().min(1, "Subtítulo é obrigatório."),
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

export type BannerInput = z.infer<typeof bannerSchema>;

interface BannerFormProps {
    banner?: BannerORM; // Opcional - se não existir, é criação
    mode: "create" | "edit";
}

export default function BannerForm({ banner, mode }: BannerFormProps) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [previewImage, setPreviewImage] = useState<string>(
        banner?.imagem ?? ""
    );

    const isEditing = mode === "edit" && banner;

    const form = useForm<BannerInput>({
        resolver: zodResolver(bannerSchema),
        defaultValues: {
            status: banner?.status ?? true,
            imagem: banner?.imagem ?? "",
            titulo: banner?.titulo ?? "",
            subtitulo: banner?.subtitulo ?? "",
            url: banner?.url ?? "",
            publicId: banner?.publicId ?? "",
        },
    });

    const onSubmit = (values: BannerInput) => {
        startTransition(async () => {
            try {
                if (isEditing) {
                    await updateBanner({
                        ...values,
                        id: banner.id,
                    });
                    toast.success("Banner editado com sucesso!");
                } else {
                    const bannerData = {
                        ...values,
                    };
                    await createBanner(bannerData);
                    toast.success("Banner criado com sucesso!");
                }

                router.push("/admin/banners");
            } catch (error) {
                console.error(error);
                const errorMessage = error instanceof Error
                    ? error.message
                    : `Erro ao ${isEditing ? 'editar' : 'criar'} banner`;
                toast.error(errorMessage);
            }
        });
    };

    const handleBack = () => {
        router.push("/admin/banners");
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
                            showImagem
                            showSubtitulo
                            imagemLabel="Banner"
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
    )
}