"use client";

import z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Save, ArrowLeft, ImageIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { CldUploadWidget } from "next-cloudinary";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Image from "next/image";
import { updateSecao } from "@/lib/actions/secoes";
import { Secao } from "@prisma/client";

const SecaoZod = z.object({
  sitemap: z.boolean(),
  edicaoTextoFundo: z.boolean(),
  // ordem: z.number().min(0, "Ordem deve ser positiva."),
  titulo: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(100, "Título deve ter no máximo 100 caracteres."),
  descricao: z
    .string()
    .min(1, "Descrição é obrigatória.")
    .max(400, "A descrição deve ter no máximo 400 caracteres."),
  palavrasChave: z
    .string()
    .min(1, "Palavras Chaves são obrigatórias.")
    .max(400, "As palavras chaves deve ter no máximo 400 caracteres."),
  url: z.string(),
  publicId: z.string().optional(),
  imagem: z.string().optional(),
  tituloh1: z.string().optional(),
  textoPagina: z.string().optional(),
});

export type SecaoInput = z.infer<typeof SecaoZod>;

interface SecaoFormProps {
  secao: Secao;
  mode: "edit";
}

export default function SecaoForm({ secao, mode }: SecaoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string>(secao?.imagem ?? "");

  const isEditing = mode === "edit";

  const form = useForm<SecaoInput>({
    resolver: zodResolver(SecaoZod),
    defaultValues: {
      sitemap: secao?.sitemap ?? true,
      edicaoTextoFundo: secao?.edicaoTextoFundo ?? false,
      url: secao?.url ?? "",
      titulo: secao?.titulo ?? "",
      descricao: secao?.descricao ?? "",
      palavrasChave: secao?.palavrasChave ?? "",
      // ordem: secao?.ordem ?? 1,
      imagem: secao?.imagem ?? "",
      publicId: secao?.publicId ?? "",
      tituloh1: secao?.tituloh1 ?? "",
      textoPagina: secao?.textoPagina ?? "",
    },
  });

  const onSubmit = (values: SecaoInput) => {
    startTransition(async () => {
      try {
        // Limpar campos não utilizados baseado no tipo
        const data = { ...values };
        if (isEditing) {
          await updateSecao(secao.id, data);
          toast.success("Página editada com sucesso!");
        }

        router.push("/admin/secoes");
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error ? error.message : `Erro ao editar página`;
        toast.error(errorMessage);
      }
    });
  };

  const handleBack = () => {
    router.push("/admin/secoes");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              {/* All your FormField components */}
              <FormField
                control={form.control}
                name="sitemap"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28">
                      Exibir no Sitemap:
                    </Label>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) =>
                          field.onChange(value === "true")
                        }
                        value={field.value ? "true" : "false"}
                        className="flex items-center space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="true"
                            id="exibir-sitemap-sim"
                          />
                          <Label
                            htmlFor="exibir-sitemap-sim"
                            className="text-gray-700 text-base font-medium cursor-pointer"
                          >
                            Sim
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="false"
                            id="exibir-sitemap-nao"
                          />
                          <Label
                            htmlFor="exibir-sitemap-nao"
                            className="text-gray-700 text-base font-medium cursor-pointer"
                          >
                            Não
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
                  <FormItem className="flex items-center gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28">
                      Título:
                    </Label>
                    <FormControl>
                      <Input
                        placeholder="Digite o título da seção"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="descricao"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                      Descrição da Página:
                    </Label>
                    <FormControl>
                      <Textarea
                        placeholder="Digite a descrição da página para Google/SEO"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="palavrasChave"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                      Palavras Chaves:
                    </Label>
                    <FormControl>
                      <Textarea
                        placeholder="Palavras Chaves minúsculas e separadas por vírgula"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {secao.edicaoTextoFundo && (
                <>
                  <FormField
                    control={form.control}
                    name="imagem"
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-8">
                        <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                          Nova Foto:
                        </Label>
                        <div className="flex-1">
                          <FormControl>
                            <CldUploadWidget
                              options={{
                                clientAllowedFormats: [
                                  "png",
                                  "jpeg",
                                  "jpg",
                                  "webp",
                                ],
                              }}
                              uploadPreset="grupo-souze-unsigned"
                              onSuccess={(result) => {
                                if (
                                  result?.info &&
                                  typeof result.info !== "string"
                                ) {
                                  const url = result.info.secure_url;
                                  const publicId = result.info.public_id;
                                  field.onChange(url);
                                  setPreviewImage(url);
                                  form.setValue("publicId", publicId);
                                }
                              }}
                              onError={(error) => {
                                console.error(
                                  "Cloudinary upload error:",
                                  error
                                );
                              }}
                            >
                              {({ open }: { open: () => void }) => (
                                <div className="relative w-fit">
                                  <button
                                    type="button"
                                    onClick={() => open()}
                                    className="text-sm text-blue-700 font-semibold bg-blue-50 hover:bg-blue-100 
                                 rounded-md px-3 py-1.5 cursor-pointer"
                                  >
                                    Enviar imagem
                                  </button>
                                  <ImageIcon className="absolute right-[-24px] top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                                </div>
                              )}
                            </CldUploadWidget>
                          </FormControl>
                          <p className="text-blue-600 font-medium mt-2 text-sm">
                            (JPG/PNG 1920x750px)
                          </p>
                          {previewImage && (
                            <Image
                              width={300}
                              height={200}
                              src={previewImage}
                              alt="Pré-visualização"
                              className="mt-4 rounded-lg shadow-sm border border-gray-300 max-h-48 object-cover"
                            />
                          )}
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="tituloh1"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28">
                      Título H1:
                    </Label>
                    <FormControl>
                      <Input placeholder="Digite o título H1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="textoPagina"
                render={({ field }) => (
                  <FormItem className="flex items-start gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                      Texto da Página:
                    </Label>
                    <FormControl>
                      <Textarea
                        placeholder="Utilize tags HTML para formatação"
                        className="min-h-[200px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Buttons */}

            <div className="flex gap-4 items-center justify-center">
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
