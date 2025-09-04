"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ImageIcon } from "lucide-react"
import {
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form"
import { FieldValues, Path, PathValue, UseFormReturn } from "react-hook-form/dist/types"
import { CldUploadWidget } from "next-cloudinary"
import Image from "next/image"

type FormFieldsProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  previewImage: string;
  setPreviewImage: (url: string) => void;
  showOrdenacao?: boolean;
  showImagem?: boolean;
  imagemLabel?: string;
  showSubtitulo?: boolean;
};

export function FormFields<T extends FieldValues>({
  form,
  previewImage,
  setPreviewImage,
  showOrdenacao = false,
  showImagem = false,
  imagemLabel = "Imagem",
  showSubtitulo = false,
}: FormFieldsProps<T>) {
  return (
    <>
      {/* Status - SEMPRE */}
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

      {/* Ordem - OPCIONAL */}
      {showOrdenacao && (
        <FormField
          control={form.control}
          name={"ordem" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex items-center gap-8">
              <Label className="text-gray-900 font-medium text-lg w-28">Ordem:</Label>
              <FormControl>
                <select
                  value={field.value?.toString() ?? ""}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  className="border border-gray-300 rounded-md px-3 py-2 w-[80px]"
                >
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {showImagem && (
        <FormField
          control={form.control}
          name={"imagem" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex items-start gap-8">
              <Label className="text-gray-900 font-medium text-lg w-28 mt-2">
                {imagemLabel}:
              </Label>
              <div className="flex-1">
                <FormControl>
                  <CldUploadWidget
                    options={{ clientAllowedFormats: ['png', 'jpeg', 'jpg', 'webp'] }}
                    uploadPreset="terrasul-unsigned"
                    onSuccess={(result) => {
                      if (result?.info && typeof result.info !== "string") {
                        const url = result.info.secure_url;
                        const publicId = result.info.public_id;
                        field.onChange(url);
                        setPreviewImage(url);

                        form.setValue("publicId" as Path<T>, publicId as PathValue<T, Path<T>>);
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
      )}

      {/* Título - SEMPRE */}
      <FormField
        control={form.control}
        name={"titulo" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex items-center gap-8">
            <Label className="text-gray-900 font-medium text-lg w-28">Título:</Label>
            <FormControl>
              <Input
                placeholder="Digite o título"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Subtítulo - OPCIONAL */}
      {showSubtitulo && (
        <FormField
          control={form.control}
          name={"subtitulo" as Path<T>}
          render={({ field }) => (
            <FormItem className="flex items-center gap-8">
              <Label className="text-gray-900 font-medium text-lg w-28">Subtítulo:</Label>
              <FormControl>
                <Input
                  placeholder="Digite o subtítulo"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* URL - SEMPRE */}
      <FormField
        control={form.control}
        name={"url" as Path<T>}
        render={({ field }) => (
          <FormItem className="flex items-start gap-8">
            <div className="w-28">
              <Label className="text-gray-900 font-medium text-lg">URL:</Label>
              <p className="text-blue-600 font-medium mt-1 text-sm">(com https://)</p>
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

      {/* Hidden field for publicId */}
      <input
        type="hidden"
        {...form.register("publicId" as Path<T>)}
      />
    </>
  )
}
