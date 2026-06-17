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
import { after } from "next/server";
import { sendLeadToCrm, type CrmLead } from "../crm/client";

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

  // 1. Persistir primeiro: o id gerado aqui é o submission_id (chave de idempotência).
  const registro = await prisma.formulario.create({
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

  // 2. Encaminhar ao CRM em background (não bloqueia a resposta ao lead).
  //    Só os formulários cobertos pelo contrato do webhook.
  const lead = buildCrmLead(validated, registro.id);
  if (lead) {
    after(() => sendLeadToCrm(lead));
  }

  if (codigoCorretor == "78" || codigoCorretor == undefined){
    await sendEmailFormulario(validated,true)
  }
  else{
    await sendEmailFormulario(validated,false);
  }
}

/**
 * Mapeia um Formulario persistido para o payload do webhook do CRM.
 * Retorna null para tipos que não fazem parte do contrato (ex. FINANCIAMENTO,
 * VISITA), que não devem ser encaminhados.
 */
function buildCrmLead(input: FormularioInput, submissionId: string): CrmLead | null {
  const base = {
    submission_id: submissionId,
    name: input.nome,
    phone: input.telefone,
    email: input.email,
  };

  switch (input.tipo) {
    case "WHATSAPP":
      return {
        ...base,
        source: "whatsapp_btn",
        // opcional: só no botão dentro da página de um imóvel
        ...(input.codigoImovel ? { property_code: input.codigoImovel } : {}),
      };
    case "INFORMACOES":
      return {
        ...base,
        source: "mais_info",
        property_code: input.codigoImovel ?? "",
      };
    case "CONTATO":
      return {
        ...base,
        source: "contato",
        subject: input.assunto ?? "",
        message: input.mensagem ?? "",
      };
    default:
      return null;
  }
}

export async function deleteFormularios(ids: string[]): Promise<void> {
  const validIds = idsSchema.parse(ids);
  await prisma.formulario.deleteMany({
    where: { id: { in: validIds } },
  });
}
