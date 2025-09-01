"use server";

import { z } from "zod";
import { prisma } from "../neon/db";
import { Corretor as CorretorORM } from "@prisma/client";
import { CorretorInput } from "@/components/admin/corretorForm";

const corretoreserverSchema = z.object({
    status: z.boolean(),
    name: z
        .string()
        .min(1, "Nome é obrigatório.")
        .max(100, "Nome deve ter no máximo 100 caracteres."),
    email: z
        .string().check(z.email()).refine((email) => email.endsWith(".com") || email.endsWith(".br"), {
            message: "Email invalido",
        }),
    telefone: z
        .string()
        .min(1, "Telefone é obrigatório.")
        .max(15, "Telefone deve ter no máximo 15 caracteres."),
    CRECI: z
        .string()
        .min(1, "CRECI é obrigatório.")
        .max(11, "CRECI deve ter no máximo 11 caracteres."),
});

const idsSchema = z.array(z.cuid());
const idSchema = z.cuid();

export async function getAllCorretores(): Promise<CorretorORM[]> {
    return await prisma.corretor.findMany();
}

export async function findCorretor(id: string): Promise<CorretorORM | null> {
    // Validar ID
    const validId = idSchema.parse(id);
    return await prisma.corretor.findUnique({ where: { id: validId } });
}

export async function createCorretor({
    name,
    email,
    telefone,
    CRECI,
    status,
}: CorretorInput) {
    const validatedData = corretoreserverSchema.parse({
        name,
        email,
        telefone,
        CRECI,
        status,
    });

    await prisma.corretor.create({
        data: {
            name: validatedData.name,
            email: validatedData.email,
            telefone: validatedData.telefone,
            CRECI: validatedData.CRECI,
            status: validatedData.status,
        },
    });
}

export async function updateCorretor(corretor: Omit<CorretorORM, "createdAt">) {
    const { id, ...corretorWithoutId } = corretor;

    // Validar ID
    const validId = idSchema.parse(id);

    // Validar dados do corretor
    const validatedData = corretoreserverSchema.parse({
        ...corretorWithoutId,
    });

    await prisma.corretor.update({
        where: { id: validId },
        data: validatedData,
    });
}

export async function activateCorretores(ids: string[]) {
    // Validar IDs
    const validIds = idsSchema.parse(ids);

    await prisma.$transaction(
        validIds.map((id) =>
            prisma.corretor.update({ where: { id }, data: { status: true } })
        )
    );
}

export async function deactivateCorretores(ids: string[]) {
    // Validar IDs
    const validIds = idsSchema.parse(ids);

    await prisma.$transaction(
        validIds.map((id) =>
            prisma.corretor.update({ where: { id }, data: { status: false } })
        )
    );
}

export async function deleteCorretores(ids: string[]) {
    // Validar IDs
    const validIds = idsSchema.parse(ids);

    await Promise.all(
        validIds.map((id) => prisma.corretor.deleteMany({ where: { id } }))
    );
}

export async function getCorretoresAtivosParaSelect(): Promise<{ id: string; name: string }[]> {
  const corretores = await prisma.corretor.findMany({
    where: { status: true },
    select: { id: true, name: true },
  });

  return corretores;
}