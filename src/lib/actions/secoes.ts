"use server";

import { z } from "zod";
import { revalidatePath } from "next/cache";
import { prisma } from "../neon/db";
import { deleteCloudinaryImage } from "./cloudinary";

// === SCHEMA DE VALIDAÇÃO ===
const secaoSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório").max(100),
  descricao: z.string().min(1, "Descrição é obrigatória"),
  palavrasChave: z.string().min(1, "Palavras-chave são obrigatórias"),
  tituloh1: z.string().optional(),
  textoPagina: z.string().optional(),
  imagem: z.string().optional(),
  publicId: z.string().optional(),
  sitemap: z.boolean().default(true),
  edicaoTextoFundo: z.boolean().default(false),
});

const idSchema = z.number().positive();
export type SecaoInput = z.infer<typeof secaoSchema>;

// === FUNÇÃO DE ATUALIZAÇÃO ===
export async function updateSecao(id: number, data: SecaoInput) {
  const validId = idSchema.parse(id);
  const validatedData = secaoSchema.parse(data);

  const existingSecao = await prisma.secao.findUnique({ where: { id: validId } });
  if (!existingSecao) {
    throw new Error(`Seção com ID ${validId} não encontrada.`);
  }

  // Deleta imagem antiga caso o publicId tenha mudado
  if (existingSecao.publicId && existingSecao.publicId !== validatedData.publicId) {
    try {
      await deleteCloudinaryImage(existingSecao.publicId);
    } catch (error) {
      console.error(
        `Erro ao deletar imagem antiga do Cloudinary: ${existingSecao.publicId}`,
        error
      );
    }
  }

  // Atualiza a seção dentro de uma transação
  const updatedSecao = await prisma.$transaction(async (tx) => {
    return tx.secao.update({
      where: { id: validId },
      data: validatedData,
    });
  });

  // Revalida path da página admin correspondente
  revalidatePath("/admin/secoes");

  return updatedSecao;
}

export async function getAllSecoes() {
  try {
    const secoes = await prisma.secao.findMany({
      orderBy: {
        id: "asc", // opcional, ordena pelo ID
      },
    });

    return secoes;
  } catch (error) {
    console.error("Erro ao buscar seções:", error);
    throw new Error("Não foi possível buscar as seções");
  }
}

export async function getSecao(id: number) {
  try {
    return await prisma.secao.findUnique({ where: { id } });
  } catch (error) {
    console.error("Erro ao buscar seções:", error);
    throw new Error("Não foi possível buscar as seções");
  }
}