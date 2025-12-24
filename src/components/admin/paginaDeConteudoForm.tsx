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
import { PaginasConteudo } from "@prisma/client";
import { useRouter } from "next/navigation";
import { createPagina, updatePagina } from "@/lib/actions/contentPages";
import { CldUploadWidget } from "next-cloudinary";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import Image from "next/image";

const PaginaDeConteudo = z.object({
  status: z.boolean(),
  tipo: z.enum(["pagina", "link"]),
  isOnMenu: z.boolean(),
  ordem: z.number().min(0, "Ordem deve ser positiva."),
  imagem: z.string().optional(),
  titulo: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(100, "Título deve ter no máximo 100 caracteres."),
  url: z.string().optional(),
  publicId: z.string().optional(),
  conteudo: z.string().optional(),
});

export type PaginaDeConteudoInput = z.infer<typeof PaginaDeConteudo>;

interface PaginaDeConteudoFormProps {
  paginaDeConteudo?: PaginasConteudo;
  mode: "create" | "edit";
}

export default function PaginaDeConteudoForm({
  paginaDeConteudo,
  mode,
}: PaginaDeConteudoFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [previewImage, setPreviewImage] = useState<string>(
    paginaDeConteudo?.imagem ?? "",
  );

  const isEditing = mode === "edit" && paginaDeConteudo;

  const form = useForm<PaginaDeConteudoInput>({
    resolver: zodResolver(PaginaDeConteudo),
    defaultValues: {
      status: paginaDeConteudo?.status ?? true,
      tipo: (paginaDeConteudo?.tipo as "pagina" | "link") ?? "pagina",
      isOnMenu: paginaDeConteudo?.isOnMenu ?? true,
      ordem: paginaDeConteudo?.ordem ?? 1,
      imagem: paginaDeConteudo?.imagem ?? "",
      titulo: paginaDeConteudo?.titulo ?? "",
      url: paginaDeConteudo?.url ?? "",
      publicId: paginaDeConteudo?.publicId ?? "",
      conteudo: paginaDeConteudo?.conteudo ?? "",
    },
  });

  const tipoPagina = form.watch("tipo");

  const formatPageUrl = (titulo: string) => {
    return `pagina/${slugify(titulo)}`;
  };

  function slugify(text: string): string {
    return text
      .normalize("NFD") // separa acentos das letras
      .replace(/[\u0300-\u036f]/g, "") // remove acentos
      .replace(/[^a-zA-Z0-9\s-]/g, "") // remove caracteres especiais
      .trim() // remove espaços no início e fim
      .replace(/\s+/g, "-"); // troca espaços por hífens
  }

  const onSubmit = (values: PaginaDeConteudoInput) => {
    startTransition(async () => {
      try {
        // Limpar campos não utilizados baseado no tipo
        const dataToSubmit = { ...values };
        if (values.tipo === "link") {
          delete dataToSubmit.imagem;
          delete dataToSubmit.publicId;
          delete dataToSubmit.conteudo;
        } else {
          dataToSubmit.url = formatPageUrl(values.titulo);
        }

        if (isEditing) {
          await updatePagina(paginaDeConteudo.id, dataToSubmit);
          toast.success("Página editada com sucesso!");
        } else {
          await createPagina(dataToSubmit);
          toast.success("Página criada com sucesso!" + dataToSubmit.url);
        }

        router.push("/admin/paginas");
      } catch (error) {
        console.error(error);
        const errorMessage =
          error instanceof Error
            ? error.message
            : `Erro ao ${isEditing ? "editar" : "criar"} página`;
        toast.error(errorMessage);
      }
    });
  };

  const handleBack = () => {
    router.push("/admin/paginas");
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardContent className="p-8 space-y-8">
            <div className="space-y-6">
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28">
                      Status:
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
                          <RadioGroupItem value="true" id="status-ativo" />
                          <Label
                            htmlFor="status-ativo"
                            className="text-gray-700 text-base font-medium cursor-pointer"
                          >
                            Ativo
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="status-inativo" />
                          <Label
                            htmlFor="status-inativo"
                            className="text-gray-700 text-base font-medium cursor-pointer"
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

              {/* Tipo Radio Group */}
              <FormField
                control={form.control}
                name="tipo"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28">
                      Tipo:
                    </Label>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        value={field.value}
                        className="flex items-center space-x-6"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="pagina" id="tipo-pagina" />
                          <Label
                            htmlFor="tipo-pagina"
                            className="text-gray-700 text-base font-medium cursor-pointer"
                          >
                            Página
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="link" id="tipo-link" />
                          <Label
                            htmlFor="tipo-link"
                            className="text-gray-700 text-base font-medium cursor-pointer"
                          >
                            Link no Menu
                          </Label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* IsOnMenu Radio Group */}
              <FormField
                control={form.control}
                name="isOnMenu"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-8">
                    <Label className="text-gray-900 font-medium text-lg w-28">
                      No Menu:
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
                          <RadioGroupItem value="true" id="menu-sim" />
                          <Label
                            htmlFor="menu-sim"
                            className="text-gray-700 text-base font-medium cursor-pointer"
                          >
                            Sim
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="menu-nao" />
                          <Label
                            htmlFor="menu-nao"
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
            </div>

            {/* Ordem */}
            <FormField
              control={form.control}
              name="ordem"
              render={({ field }) => (
                <FormItem className="flex items-center gap-8">
                  <Label className="text-gray-900 font-medium text-lg w-28">
                    Ordem:
                  </Label>
                  <FormControl>
                    <select
                      value={field.value?.toString() ?? ""}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      className="border border-gray-300 rounded-md px-3 py-2 w-[80px]"
                    >
                      {Array.from({ length: 20 }, (_, i) => i + 1).map(
                        (num) => (
                          <option key={num} value={num}>
                            {num}
                          </option>
                        ),
                      )}
                    </select>
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
                    <Input placeholder="Digite o título do link" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Campos condicionais baseados no tipo */}
            {tipoPagina === "pagina" ? (
              <>
                {/* Imagem - Apenas para página */}
                <FormField
                  control={form.control}
                  name="imagem"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-8">
                      <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                        Imagem:
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
                              console.error("Cloudinary upload error:", error);
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

                {/* Título */}
                {/* <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <Label className="text-gray-900 font-medium text-lg w-28">
                        Título:
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="Digite o título da página"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Conteúdo - Apenas para página */}
                <FormField
                  control={form.control}
                  name="conteudo"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-8">
                      <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                        Conteúdo:
                      </Label>
                      <FormControl>
                        <Textarea
                          placeholder="Digite o conteúdo da página"
                          className="min-h-[200px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            ) : (
              <>
                {/* Título */}
                {/* <FormField
                  control={form.control}
                  name="titulo"
                  render={({ field }) => (
                    <FormItem className="flex items-center gap-8">
                      <Label className="text-gray-900 font-medium text-lg w-28">
                        Título:
                      </Label>
                      <FormControl>
                        <Input
                          placeholder="Digite o título do link"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* URL - Apenas para link */}
                <FormField
                  control={form.control}
                  name="url"
                  render={({ field }) => (
                    <FormItem className="flex items-start gap-8">
                      <div className="w-28">
                        <Label className="text-gray-900 font-medium text-lg">
                          URL:
                        </Label>
                        <p className="text-blue-600 font-medium mt-1 text-sm">
                          (com https://)
                        </p>
                      </div>
                      <FormControl>
                        <Textarea
                          placeholder="Digite a URL de destino"
                          className="min-h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </>
            )}

            {/* Hidden field for publicId */}
            <input type="hidden" {...form.register("publicId")} />
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
