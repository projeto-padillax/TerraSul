"use server"

import { z } from "zod";
import { prisma } from "../neon/db";
import { Chamadas as ChamadaORM } from "@prisma/client";
import { deleteCloudinaryImage } from "./cloudinary";

// Schema para validação no servidor
const chamadaServerSchema = z.object({
    titulo: z
        .string()
        .min(1, "Título é obrigatório.")
        .max(100, "Título deve ter no máximo 100 caracteres."),
    subtitulo: z
        .string()
        .min(1, "Subtítulo é obrigatório.")
        .max(200, "Subtítulo deve ter no máximo 200 caracteres."),
    ordem: z
        .number()
        .int("Ordem deve ser um número inteiro.")
        .positive("Ordem deve ser um número positivo."),
    imagem: z.string().min(1, "Imagem é obrigatória."),
    url: z
        .string()
        .min(1, "URL é obrigatória.")
        .url("URL inválida.")
        .refine(
            (url) => url.startsWith("https://"),
            { message: "URL deve começar com https://" }
        ),
    status: z.boolean(),
    publicId: z.string().min(1, "publicId é obrigatório."),
});

const idsSchema = z.array(z.number().positive());
const idSchema = z.number().positive();

export type chamadaSchema = z.infer<typeof chamadaServerSchema>

export async function getAllChamadas(): Promise<ChamadaORM[]> {
    try {
        return await prisma.chamadas.findMany({
            orderBy: { ordem: 'asc' },
            where: { status: true },
        })
    } catch (error) {
        console.error("Erro ao buscar chamadas:", error);
        throw new Error("Erro ao buscar chamadas");
    }
}

export async function findChamada(id: number): Promise<ChamadaORM | null> {
    try {
        const validId = idSchema.parse(id);
        return await prisma.chamadas.findUnique({ where: { id: validId } })
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("ID inválido");
        }
        console.error("Erro ao buscar chamada:", error);
        throw new Error("Erro ao buscar chamada");
    }
}

export async function createChamada({ titulo, subtitulo, ordem, imagem, url, status, publicId }: chamadaSchema) {
    try {
        // Validar dados de entrada
        const validatedData = chamadaServerSchema.parse({
            titulo,
            subtitulo,
            ordem,
            url,
            status,
            imagem,
            publicId
        });

        await prisma.chamadas.create({
            data: {
                titulo: validatedData.titulo,
                subtitulo: validatedData.subtitulo,
                ordem: validatedData.ordem,
                imagem: validatedData.imagem,
                url: validatedData.url,
                status: validatedData.status,
                publicId: validatedData.publicId
            },
        });
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Dados inválidos: ${error.message}`);
        }
        console.error("Erro ao criar chamada:", error);
        throw new Error("Erro ao criar chamada");
    }
}

export async function updateChamada(chamada: Omit<ChamadaORM, "createdAt">) {
    try {
        const { id, ...chamadaWithoutId } = chamada;
        const validId = idSchema.parse(id);

        const validatedData = chamadaServerSchema.parse(chamadaWithoutId);

        const existingChamada = await prisma.chamadas.findUnique({ where: { id: validId } });
        if (!existingChamada) {
            throw new Error(`Chamada com ID ${validId} não encontrado.`);
        }


        if (
            existingChamada.publicId &&
            existingChamada.publicId !== validatedData.publicId
        ) {
            try {
                await deleteCloudinaryImage(existingChamada.publicId);
            } catch (error) {
                console.error(`Failed to delete old Cloudinary image: ${existingChamada.publicId}`, error);
            }
        }

        return await prisma.$transaction(async (tx) => {
            return tx.chamadas.update({
                where: { id: validId },
                data: validatedData,
            });
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Dados inválidos: ${error.message}`);
        }

        console.error("Erro ao atualizar chamada:", error);
        throw new Error("Erro ao atualizar chamada.");
    }
}

export async function activateChamadas(ids: number[]) {
    try {
        const validIds = idsSchema.parse(ids);

        await prisma.$transaction(
            validIds.map(id => prisma.chamadas.update({ where: { id }, data: { status: true } }))
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("IDs inválidos");
        }
        console.error("Erro ao ativar chamadas:", error);
        throw new Error("Erro ao ativar chamadas");
    }
}

export async function deactivateChamadas(ids: number[]) {
    try {
        const validIds = idsSchema.parse(ids);

        await prisma.$transaction(
            validIds.map(id => prisma.chamadas.update({ where: { id }, data: { status: false } }))
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("IDs inválidos");
        }
        console.error("Erro ao desativar chamadas:", error);
        throw new Error("Erro ao desativar chamadas");
    }
}

export async function deleteChamadas(ids: number[]) {
    try {
        const validIds = idsSchema.parse(ids);

        const chamadas = await prisma.chamadas.findMany({
            where: { id: { in: validIds } },
            select: { id: true, publicId: true },
        });

        await Promise.all(
            chamadas.map(async (chamada) => {
                if (chamada.publicId) {
                    try {
                        await deleteCloudinaryImage(chamada.publicId);
                    } catch (error) {
                        console.error(`Failed to delete image for chamada ${chamada.id}`, error);
                    }
                }
            })
        );

        await prisma.$transaction([
            prisma.chamadas.deleteMany({
                where: { id: { in: validIds } },
            }),
        ]);

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("IDs inválidos");
        }
        console.error("Erro ao deletar chamadas:", error);
        throw new Error("Erro ao deletar chamadas");
    }
}