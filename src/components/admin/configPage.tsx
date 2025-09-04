"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "@radix-ui/react-label";
import {
  createConfiguracaoPagina,
  updateConfiguracaoPagina,
} from "@/lib/actions/config";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const enderecoSchema = z.object({
  rua: z.string().optional(),
  bairro: z.string().optional(),
  cidade: z.string().optional(),
  estado: z.string().optional(),
  cep: z.string().optional(),
  linkGoogleMaps: z.string().url().optional().or(z.literal("")),
  telefone1: z
    .string()
    .regex(/^[0-9]*$/, { message: "O telefone deve conter apenas numeros" })
    .max(11, { message: "O telefone deve ter no máximo 11 dígitos" })
    .optional(),
  isWhatsApp1: z.boolean().optional(),
  telefone2: z
    .string()
    .regex(/^[0-9]*$/, { message: "O telefone deve conter apenas numeros" })
    .max(11, { message: "O telefone deve ter no máximo 11 dígitos" })
    .optional(),
  tituloTelefone1: z.string().optional(),
  isWhatsApp2: z.boolean().optional(),
  tituloTelefone2: z.string().optional(),
  telefone3: z
    .string()
    .regex(/^[0-9]*$/, { message: "O telefone deve conter apenas numeros" })
    .max(11, { message: "O telefone deve ter no máximo 11 dígitos" })
    .optional(),
  isWhatsApp3: z.boolean().optional(),
  tituloTelefone3: z.string().optional(),
});

const siteConfigSchema = z.object({
  nomeSite: z.string().nullable(),
  CRECI: z.string().nullable(),
  sobreNos: z.string().nullable(),
  logoUrl: z.string().nullable(),
  linkedInUrl: z
    .string()
    .url("URL do LinkedIn inválida.")
    .nullable()
    .or(z.literal("")),
  facebookUrl: z
    .string()
    .url("URL do Facebook inválida.")
    .nullable()
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .url("URL do Instagram inválida.")
    .nullable()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .url("URL do YouTube inválida.")
    .nullable()
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("URL do Twitter inválida.")
    .nullable()
    .or(z.literal("")),
  whatsappNumber: z
    .string()
    .nullable(),
  enderecos: z.array(enderecoSchema),
});

type SiteConfigSchema = z.infer<typeof siteConfigSchema>;

export default function SiteConfigForm({
  defaultValues,
}: {
  defaultValues?: SiteConfigSchema;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<SiteConfigSchema>({
    resolver: zodResolver(siteConfigSchema),
    defaultValues: defaultValues || {
      nomeSite: "",
      CRECI: "",
      sobreNos: "",
      logoUrl: "",
      linkedInUrl: "",
      facebookUrl: "",
      instagramUrl: "",
      youtubeUrl: "",
      twitterUrl: "",
      whatsappNumber: "",
      enderecos: [
        {
          rua: "",
          bairro: "",
          cidade: "",
          estado: "",
          cep: "",
          linkGoogleMaps: "",
          telefone1: "",
          isWhatsApp1: false,
          tituloTelefone1: "",
          telefone2: "",
          isWhatsApp2: false,
          tituloTelefone2: "",
          telefone3: "",
          isWhatsApp3: false,
          tituloTelefone3: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "enderecos",
  });

  const onSubmit = (values: SiteConfigSchema) => {
    startTransition(async () => {
      if (!defaultValues) {
        await createConfiguracaoPagina(values);
        toast.success("Página Criada com sucesso!");
        router.push("/admin");
        return;
      }
      await updateConfiguracaoPagina(values);
      toast.success("Página editada com sucesso!");
      router.push("/admin");
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card className="mb-6">
          <CardContent className="p-6 space-y-4">
            <FormField
              control={form.control}
              name="nomeSite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do Site</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="CRECI"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CRECI</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="sobreNos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sobre Nós</FormLabel>
                  <FormControl>
                    <Textarea {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Logo URL</FormLabel>
                  <FormControl>
                    <Input {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-gray-900 border-b pb-2">
                Redes Sociais
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://facebook.com/suaimobiliaria"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://instagram.com/suaimobiliaria"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="youtubeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>YouTube</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://youtube.com/@suaimobiliaria"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="linkedInUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>LinkedIn</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://linkedin.com/company/suaimobiliaria"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="twitterUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Twitter/X</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="https://twitter.com/suaimobiliaria"
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Endereços */}
        {fields.map((field, index) => (
          <Card key={field.id} className="mb-6">
            <CardContent className="p-6 space-y-4">
              <h2 className="text-lg font-semibold">Endereço {index + 1}</h2>

              <FormField
                control={form.control}
                name={`enderecos.${index}.rua`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rua</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-2 gap-4">
                {(["bairro", "cidade", "estado", "cep"] as const).map((key) => (
                  <FormField
                    key={key}
                    control={form.control}
                    name={`enderecos.${index}.${key}`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{key.toUpperCase()}</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                ))}
              </div>

              <FormField
                control={form.control}
                name={`enderecos.${index}.linkGoogleMaps`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Google Maps</FormLabel>
                    <FormControl>
                      <Input {...field} value={field.value ?? ""} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={`enderecos.${index}.telefone1`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone 1</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`enderecos.${index}.isWhatsApp1`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value ? "whatsapp" : "telefone"}
                            onValueChange={(value) =>
                              field.onChange(value === "whatsapp")
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="whatsapp"
                                id="whatsapp"
                                className="scale-110"
                              />
                              <Label
                                htmlFor="whatsapp"
                                className="text-gray-700 text-base font-medium"
                              >
                                Whatsapp
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="telefone"
                                id="telefone"
                                className="scale-110"
                              />
                              <Label
                                htmlFor="telefone"
                                className="text-gray-700 text-base font-medium"
                              >
                                Telefone
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`enderecos.${index}.tituloTelefone1`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titulo Telefone 1</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={`enderecos.${index}.telefone2`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone 2</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`enderecos.${index}.isWhatsApp2`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value ? "whatsapp" : "telefone"}
                            onValueChange={(value) =>
                              field.onChange(value === "whatsapp")
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="whatsapp"
                                id="whatsapp"
                                className="scale-110"
                              />
                              <Label
                                htmlFor="whatsapp"
                                className="text-gray-700 text-base font-medium"
                              >
                                Whatsapp
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="telefone"
                                id="telefone"
                                className="scale-110"
                              />
                              <Label
                                htmlFor="telefone"
                                className="text-gray-700 text-base font-medium"
                              >
                                Telefone
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`enderecos.${index}.tituloTelefone2`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titulo Telefone 2</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name={`enderecos.${index}.telefone3`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone 3</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`enderecos.${index}.isWhatsApp3`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo</FormLabel>
                        <FormControl>
                          <RadioGroup
                            value={field.value ? "whatsapp" : "telefone"}
                            onValueChange={(value) =>
                              field.onChange(value === "whatsapp")
                            }
                            className="flex gap-6"
                          >
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="whatsapp"
                                id="whatsapp"
                                className="scale-110"
                              />
                              <Label
                                htmlFor="whatsapp"
                                className="text-gray-700 text-base font-medium"
                              >
                                Whatsapp
                              </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <RadioGroupItem
                                value="telefone"
                                id="telefone"
                                className="scale-110"
                              />
                              <Label
                                htmlFor="telefone"
                                className="text-gray-700 text-base font-medium"
                              >
                                Telefone
                              </Label>
                            </div>
                          </RadioGroup>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`enderecos.${index}.tituloTelefone3`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Titulo Telefone 3</FormLabel>
                        <FormControl>
                          <Input {...field} value={field.value ?? ""} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                type="button"
                variant="secondary"
                onClick={() => remove(index)}
                className="mt-4 cursor-pointer"
              >
                Remover Endereço
              </Button>
            </CardContent>
          </Card>
        ))}
        <div className="justify-self-center ">
          <Button
            className="mr-8 cursor-pointer"
            type="button"
            variant="outline"
            onClick={() =>
              append({
                rua: "",
                bairro: "",
                cidade: "",
                estado: "",
                cep: "",
                linkGoogleMaps: "",
                telefone1: "",
                isWhatsApp1: false,
                tituloTelefone1: "",
                telefone2: "",
                isWhatsApp2: false,
                tituloTelefone2: "",
                telefone3: "",
                isWhatsApp3: false,
                tituloTelefone3: "",
              })
            }
          >
            Adicionar Endereço
          </Button>

          <Button
            type="submit"
            className="mt-6 cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Salvando..." : "Salvar Configurações"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
