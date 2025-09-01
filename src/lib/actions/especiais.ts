"use server";
import { ImoveisCorretor as ImoveisCorretorORM } from "@prisma/client";

import z from "zod";
import { prisma } from "../neon/db";
import { EspecialInput } from "@/components/admin/especialForm";

const especialServerSchema = z.object({
    status: z.boolean(),
    nomeCliente: z
        .string()
        .min(1, "Nome é obrigatório.")
        .max(40, "Nome deve ter no máximo 40 caracteres."),
    mensagem: z
        .string()
        .min(1, "Mensagem é obrigatório")
        .max(150, "Mensagem deve ter no máximo 150 caracteres"),
    corretorId: z
        .cuid("Id do corretor invalida"),
    codigosImoveis: z.array(z.string()).optional(),
})

const idsSchema = z.array(z.cuid());
const idSchema = z.cuid();

export async function getAllEspeciais() {
  return await prisma.imoveisCorretor.findMany({
    include: {
      corretor: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
}

export async function findEspecial(id: string): Promise<ImoveisCorretorORM | null> {
    // Validar ID
    const validId = idSchema.parse(id);
    return await prisma.imoveisCorretor.findUnique({ where: { id: validId } });
}

export async function createEspecial({
    status,
    nomeCliente,
    mensagem,
    corretorId,
    codigosImoveis,
}: EspecialInput) {
    const validatedData = especialServerSchema.parse({
        status,
        nomeCliente,
        mensagem,
        corretorId,
        codigosImoveis
    });
    await prisma.imoveisCorretor.create({
        data: {
            status: validatedData.status,
            nomeCliente: validatedData.nomeCliente,
            mensagem: validatedData.mensagem,
            corretorId: validatedData.corretorId,
            codigosImoveis: validatedData.codigosImoveis ?? [],
        },
    });
}

export async function updateEspecial(especial: Omit<ImoveisCorretorORM, "createdAt">) {
    const { id, ...especialWithoutId } = especial;

    // Validar ID
    const validId = idSchema.parse(id);

    // Validar dados do especial
    const validatedData = especialServerSchema.parse({
        ...especialWithoutId,
    });

    await prisma.imoveisCorretor.update({
        where: { id: validId },
        data: validatedData,
    });
}

export async function activateEspeciais(ids: string[]) {
    // Validar IDs
    const validIds = idsSchema.parse(ids);

    await prisma.$transaction(
        validIds.map((id) =>
            prisma.imoveisCorretor.update({ where: { id }, data: { status: true } })
        )
    );
}

export async function deactivateEspeciais(ids: string[]) {
    // Validar IDs
    const validIds = idsSchema.parse(ids);

    await prisma.$transaction(
        validIds.map((id) =>
            prisma.imoveisCorretor.update({ where: { id }, data: { status: false } })
        )
    );
}

export async function deleteEspeciais(ids: string[]) {
    // Validar IDs
    const validIds = idsSchema.parse(ids);

    await Promise.all(
        validIds.map((id) => prisma.imoveisCorretor.deleteMany({ where: { id } }))
    );
}


