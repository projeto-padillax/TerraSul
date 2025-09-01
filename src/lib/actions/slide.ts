"use server"

import { z } from "zod";
import { prisma } from "../neon/db";
import { Slides as SlideORM } from "@prisma/client";
import { deleteCloudinaryImage } from "./cloudinary";

// Schema para validação no servidor
const slideServerSchema = z.object({
    titulo: z
        .string()
        .min(1, "Título é obrigatório.")
        .max(100, "Título deve ter no máximo 100 caracteres."),
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

export type slideSchema = z.infer<typeof slideServerSchema>

export async function getAllSlides(): Promise<SlideORM[]> {
    try {
        return await prisma.slides.findMany({
            orderBy: { ordem: 'asc' }
        })
    } catch (error) {
        console.error("Erro ao buscar slides:", error);
        throw new Error("Erro ao buscar slides");
    }
}

export async function getFirstSlides(): Promise<SlideORM|null> {
    try {
        return await prisma.slides.findFirst({
            orderBy: { ordem: 'asc' }
        })
    } catch (error) {
        console.error("Erro ao buscar slides:", error);
        throw new Error("Erro ao buscar slides");
    }
}

export async function findSlide(id: number): Promise<SlideORM | null> {
    try {
        const validId = idSchema.parse(id);
        return await prisma.slides.findUnique({ where: { id: validId } })
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("ID inválido");
        }
        console.error("Erro ao buscar slide:", error);
        throw new Error("Erro ao buscar slide");
    }
}

export async function createSlide({ titulo, ordem, imagem, url, status, publicId }: slideSchema) {
    try {
        // Validar dados de entrada
        const validatedData = slideServerSchema.parse({
            titulo,
            ordem,
            url,
            status,
            imagem,
            publicId
        });

        await prisma.slides.create({
            data: {
                titulo: validatedData.titulo,
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
        console.error("Erro ao criar slide:", error);
        throw new Error("Erro ao criar slide");
    }
}

export async function updateSlide(slide: Omit<SlideORM, "createdAt">) {
    try {
        const { id, ...slideWithoutId } = slide;
        const validId = idSchema.parse(id);

        const validatedData = slideServerSchema.parse(slideWithoutId);

        const existingSlide = await prisma.slides.findUnique({ where: { id: validId } });
        if (!existingSlide) {
            throw new Error(`Slide com ID ${validId} não encontrado.`);
        }

        if (
            existingSlide.publicId &&
            existingSlide.publicId !== validatedData.publicId
        ) {
            try {
                await deleteCloudinaryImage(existingSlide.publicId);
            } catch (error) {
                console.error(`Failed to delete old Cloudinary image: ${existingSlide.publicId}`, error);
            }
        }

        return await prisma.$transaction(async (tx) => {
            return tx.slides.update({
                where: { id: validId },
                data: validatedData,
            });
        });

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error(`Dados inválidos: ${error.message}`);
        }

        console.error("Erro ao atualizar slide:", error);
        throw new Error("Erro ao atualizar slide.");
    }
}

export async function activateSlides(ids: number[]) {
    try {
        const validIds = idsSchema.parse(ids);

        await prisma.$transaction(
            validIds.map(id => prisma.slides.update({ where: { id }, data: { status: true } }))
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("IDs inválidos");
        }
        console.error("Erro ao ativar slides:", error);
        throw new Error("Erro ao ativar slides");
    }
}

export async function deactivateSlides(ids: number[]) {
    try {
        const validIds = idsSchema.parse(ids);

        await prisma.$transaction(
            validIds.map(id => prisma.slides.update({ where: { id }, data: { status: false } }))
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("IDs inválidos");
        }
        console.error("Erro ao desativar slides:", error);
        throw new Error("Erro ao desativar slides");
    }
}

export async function deleteSlides(ids: number[]) {
    try {
        const validIds = idsSchema.parse(ids);

        const slides = await prisma.slides.findMany({
            where: { id: { in: validIds } },
            select: { id: true, publicId: true },
        });

        await Promise.all(
            slides.map(async (slide) => {
                if (slide.publicId) {
                    try {
                        await deleteCloudinaryImage(slide.publicId);
                    } catch (error) {
                        console.error(`Failed to delete image for slide ${slide.id}`, error);
                    }
                }
            })
        );

        await prisma.$transaction([
            prisma.slides.deleteMany({
                where: { id: { in: validIds } },
            }),
        ]);

    } catch (error) {
        if (error instanceof z.ZodError) {
            throw new Error("IDs inválidos");
        }
        console.error("Erro ao deletar slides:", error);
        throw new Error("Erro ao deletar slides");
    }
}