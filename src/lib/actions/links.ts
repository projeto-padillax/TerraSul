"use server";

import { z } from "zod";
import { prisma } from "../neon/db";
import { MaisAcessado } from "@prisma/client";

// Schema para validação no servidor
const maisAcessadoServerSchema = z.object({
  status: z.boolean().default(true),
  titulo: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(100, "Título deve ter no máximo 100 caracteres.")
    .trim(),
  url: z
    .string()
    .min(1, "URL é obrigatória.")
    .url("URL inválida.")
    .refine((url) => url.startsWith("https://"), {
      message: "URL deve começar com https://",
    }),
});

// Schemas para validação de IDs
const idsSchema = z
  .array(z.number().positive())
  .min(1, "Pelo menos um ID é necessário.");
const idSchema = z.number().positive("ID deve ser um número positivo.");

// Tipos derivados dos schemas
export type MaisAcessadoInput = z.infer<typeof maisAcessadoServerSchema>;
export type MaisAcessadoUpdate = Partial<MaisAcessadoInput> & { id: number };

export async function getAllMaisAcessados(
  onlyActive = false
): Promise<MaisAcessado[]> {
  //o parametro diz seu vai retornar apenas os ativos ou todos
  const whereClause = onlyActive ? { status: true } : {};

  return await prisma.maisAcessado.findMany({
    where: whereClause,
    orderBy: { id: "desc" },
  });
}

export async function findMaisAcessado(
  id: number
): Promise<MaisAcessado | null> {
  const validId = idSchema.parse(id);

  return await prisma.maisAcessado.findUnique({
    where: { id: validId },
  });
}

export async function createMaisAcessado(
  data: MaisAcessadoInput
): Promise<MaisAcessado> {
  const validatedData = maisAcessadoServerSchema.parse(data);

  return await prisma.maisAcessado.create({
    data: validatedData,
  });
}

export async function updateMaisAcessado({
  id,
  ...data
}: MaisAcessadoUpdate): Promise<MaisAcessado> {
  const validId = idSchema.parse(id);
  const validatedData = maisAcessadoServerSchema.partial().parse(data);

  return await prisma.maisAcessado.update({
    where: { id: validId },
    data: validatedData,
  });
}

export async function activateMaisAcessados(ids: number[]): Promise<void> {
  const validIds = idsSchema.parse(ids);

  await prisma.maisAcessado.updateMany({
    where: { id: { in: validIds } },
    data: { status: true },
  });
}

export async function deactivateMaisAcessados(ids: number[]): Promise<void> {
  const validIds = idsSchema.parse(ids);

  await prisma.maisAcessado.updateMany({
    where: { id: { in: validIds } },
    data: { status: false },
  });
}

export async function deleteMaisAcessados(ids: number[]): Promise<void> {
  const validIds = idsSchema.parse(ids);

  await prisma.maisAcessado.deleteMany({
    where: { id: { in: validIds } },
  });
}
