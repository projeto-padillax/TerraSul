"use server";

import { z } from "zod";
import { prisma } from "../neon/db";
import {
  tipoFormulario,
  OrigemFormulario,
  InteresseFormulario,
  Formulario,
} from "@prisma/client";
import { sendEmailFormulario } from "../mail/sendEmail";

const formularioServerSchema = z.object({
  tipo: z.enum(tipoFormulario),
  nome: z.string().min(1, "Nome é obrigatório"),
  email: z.email("Email inválido"),
  telefone: z.string().min(8, "Telefone é obrigatório"),
  urlRespondida: z.url("URL inválida"),
  origem: z.enum(OrigemFormulario).optional(),
  interesse: z.enum(InteresseFormulario).optional(),
  turnoVisita: z.string().optional(),
  DataVisita: z.coerce.date().optional(),
  codigoImovel: z.string().optional(),
  mensagem: z.string().optional(),
  condominio: z.string().optional(),
  assunto: z.string().optional(),
  valorDesejado: z.number().positive().optional(),
});

const idsSchema = z.array(z.cuid());


export type FormularioInput = z.infer<typeof formularioServerSchema>;

export type FormularioPlain = Omit<
  Formulario,
  "dataEnvio" | "DataVisita" | "valorDesejado"
> & {
  dataEnvio: string;
  DataVisita: string | null;
  valorDesejado: number | null;
};

export async function getAllFormularios(): Promise<FormularioPlain[]> {
  const leads = await prisma.formulario.findMany({
    orderBy: { dataEnvio: "desc" },
  });

  return leads.map((f) => ({
    ...f,
    dataEnvio: f.dataEnvio.toISOString(),
    DataVisita: f.DataVisita ? f.DataVisita.toISOString() : null,
    valorDesejado: f.valorDesejado ? Number(f.valorDesejado) : null,
  }));
}

export async function findFormulario(id: string): Promise<Formulario | null> {
  return await prisma.formulario.findUnique({
    where: { id },
  });
}

export async function createFormulario(input: FormularioInput, codigoCorretor?: string): Promise<void> {
  const validated = formularioServerSchema.parse(input);

  await prisma.formulario.create({
    data: {
      tipo: validated.tipo,
      nome: validated.nome,
      email: validated.email,
      telefone: validated.telefone,
      urlRespondida: validated.urlRespondida,
      origem: validated.origem ?? "ORGANICO",
      interesse: validated.interesse,
      turnoVisita: validated.turnoVisita,
      DataVisita: validated.DataVisita,
      codigoImovel: validated.codigoImovel,
      mensagem: validated.mensagem,
      condominio: validated.condominio,
      assunto: validated.assunto,
      valorDesejado: validated.valorDesejado,
    },
  });

  if (codigoCorretor == "78" || codigoCorretor == undefined){
    await sendEmailFormulario(validated,true)
  }
  else{
    await sendEmailFormulario(validated,false);
  }
}

export async function deleteFormularios(ids: string[]): Promise<void> {
  const validIds = idsSchema.parse(ids);
  await prisma.formulario.deleteMany({
    where: { id: { in: validIds } },
  });
}
