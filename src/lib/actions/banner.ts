"use server";

import { z } from "zod";
import { prisma } from "../neon/db";
import { Banners as BannerORM } from "@prisma/client";
import { BannerInput } from "@/components/admin/bannerForm";
import { deleteCloudinaryImage } from "./cloudinary";

// Schema para validação no servidor
const bannerServerSchema = z.object({
  status: z.boolean(),
  titulo: z
    .string()
    .min(1, "Título é obrigatório.")
    .max(100, "Título deve ter no máximo 100 caracteres."),
  subtitulo: z
    .string()
    .min(1, "Subtítulo é obrigatório.")
    .max(200, "Subtítulo deve ter no máximo 200 caracteres."),
  url: z
    .string()
    .min(1, "URL é obrigatória.")
    .url("URL inválida.")
    .refine((url) => url.startsWith("https://"), {
      message: "URL deve começar com https://",
    }),
  imagem: z.string().min(1, "Imagem é obrigatória."),
  publicId: z.string().min(1, "publicId é obrigatório."),
});

const idsSchema = z.array(z.number().positive());
const idSchema = z.number().positive();

export async function getAllBanners(): Promise<BannerORM[]> {
  return await prisma.banners.findMany();
}

export async function findBanner(id: number): Promise<BannerORM | null> {
  // Validar ID
  const validId = idSchema.parse(id);
  return await prisma.banners.findUnique({ where: { id: validId } });
}

export async function createBanner({
  titulo,
  subtitulo,
  imagem,
  url,
  status,
  publicId
}: BannerInput) {
  // Validar dados de entrada
  const validatedData = bannerServerSchema.parse({
    titulo,
    subtitulo,
    url,
    status,
    imagem,
    publicId
  });

  await prisma.banners.create({
    data: {
      titulo: validatedData.titulo,
      subtitulo: validatedData.subtitulo,
      url: validatedData.url,
      imagem: validatedData.imagem,
      status: validatedData.status,
      publicId: validatedData.publicId
    },
  });
}

export async function updateBanner(banner: Omit<BannerORM, "createdAt">) {
  const { id, ...bannerWithoutId } = banner;
  const validId = idSchema.parse(id);
  const validatedData = bannerServerSchema.parse(bannerWithoutId);

  const existingBanner = await prisma.banners.findUnique({ where: { id: validId } });
  if (!existingBanner) {
    throw new Error(`Banner with ID ${validId} not found.`);
  }

  if (
    existingBanner.publicId &&
    existingBanner.publicId !== validatedData.publicId
  ) {
    try {
      await deleteCloudinaryImage(existingBanner.publicId);
    } catch (error) {
      console.error(`Failed to delete old Cloudinary image: ${existingBanner.publicId}`, error);
    }
  }

  return await prisma.$transaction(async (tx) => {
    return tx.banners.update({
      where: { id: validId },
      data: validatedData,
    });
  });
}

export async function activateBanners(ids: number[]) {
  // Validar IDs
  const validIds = idsSchema.parse(ids);

  await prisma.$transaction(
    validIds.map((id) =>
      prisma.banners.update({ where: { id }, data: { status: true } })
    )
  );
}

export async function deactivateBanners(ids: number[]) {
  // Validar IDs
  const validIds = idsSchema.parse(ids);

  await prisma.$transaction(
    validIds.map((id) =>
      prisma.banners.update({ where: { id }, data: { status: false } })
    )
  );
}

export async function deleteBanners(ids: number[]) {
  const validIds = idsSchema.parse(ids);

  const banners = await prisma.banners.findMany({
    where: { id: { in: validIds } },
    select: { id: true, publicId: true },
  });

  await Promise.all(
    banners.map(async (banner) => {
      if (banner.publicId) {
        try {
          await deleteCloudinaryImage(banner.publicId);
        } catch (error) {
          console.error(`Failed to delete image for banner ${banner.id}`, error);
        }
      }
    })
  );

  await prisma.$transaction([
    prisma.banners.deleteMany({
      where: { id: { in: validIds } },
    }),
  ]);
}

export async function getRandomBannerImage(): Promise<{
  imagem: string;
  titulo: string;
  subtitulo: string;
  url: string;
}> {
  const banners = await prisma.banners.findMany({
    where: { status: true }, // Remova essa linha se quiser qualquer banner, ativo ou não
    select: { imagem: true,
      titulo: true,
      subtitulo: true,
      url: true,
     },
  });

  const randomIndex = Math.floor(Math.random() * banners.length);
  return banners[randomIndex];
}