// === SERVER ACTIONS ESPECÍFICAS ===

"use server";

import { z } from "zod";
import { revalidatePath } from 'next/cache';
import { prisma } from '../neon/db';
import { deleteCloudinaryImage } from "./cloudinary";

// === AÇÕES PARA PÁGINAS ===

const paginaSchema = z.object({
  titulo: z.string().min(1, "Título é obrigatório.").max(100),
  ordem: z.number().min(0, "Ordem deve ser positiva."),
  conteudo: z.string().optional(),
  imagem: z.string().optional(),
  isOnMenu: z.boolean().default(true),
  status: z.boolean().default(true),
  url: z.url("URL inválida").optional(),
  tipo: z.enum(["pagina", "link"]),
  createdAt: z.date().optional(),
  publicId: z.string().optional(),
});

const idsSchema = z.array(z.number().positive());
const idSchema = z.number().positive();

export type PaginaInput = z.infer<typeof paginaSchema>;

export async function createPagina(data: PaginaInput) {
  try {
    
    const validatedData = paginaSchema.parse(data);

    const pagina = await prisma.paginasConteudo.create({
      data: validatedData
    });

    revalidatePath('/admin/paginas');
    return pagina;
  } catch (error) {
    console.error('Erro ao criar página:', error);
    throw new Error('Erro ao criar página');
  }
}

export async function updatePagina(id: number, data: PaginaInput) {
  const validId = idSchema.parse(id);
  const validatedData = paginaSchema.parse(data);

  const existingPagina = await prisma.paginasConteudo.findUnique({ where: { id: validId } });
  if (!existingPagina) {
    throw new Error(`Página com ID ${validId} não encontrada.`);
  }

  if (
    existingPagina.publicId &&
    existingPagina.publicId !== validatedData.publicId
  ) {
    try {
      await deleteCloudinaryImage(existingPagina.publicId);
    } catch (error) {
      console.error(
        `Erro ao deletar imagem antiga do Cloudinary: ${existingPagina.publicId}`,
        error
      );
    }
  }

  const updatedPagina = await prisma.$transaction(async (tx) => {
    return tx.paginasConteudo.update({
      where: { id: validId },
      data: validatedData,
    });
  });

  revalidatePath("/admin/paginas");
  
  return updatedPagina;
}


export async function activatePaginas(ids: number[]) {
  try {
    await prisma.paginasConteudo.updateMany({
      where: { id: { in: ids } },
      data: { status: true }
    });

    revalidatePath('/admin/paginas');
    
  } catch (error) {
    console.error('Erro ao ativar páginas:', error);
    throw new Error('Erro ao ativar páginas');
  }
}

export async function deactivatePaginas(ids: number[]) {
  try {
    await prisma.paginasConteudo.updateMany({
      where: { id: { in: ids } },
      data: { status: false }
    });

    revalidatePath('/admin/paginas');
    
  } catch (error) {
    console.error('Erro ao desativar páginas:', error);
    throw new Error('Erro ao desativar páginas');
  }
}

export async function deletePaginas(ids: number[]) {
  const validIds = idsSchema.parse(ids);

  // 1. Fetch current pages with publicId
  const paginas = await prisma.paginasConteudo.findMany({
    where: { id: { in: validIds } },
    select: { id: true, publicId: true },
  });

  // 2. Delete images from Cloudinary if publicId exists
  await Promise.all(
    paginas.map(async (pagina) => {
      if (pagina.publicId) {
        try {
          await deleteCloudinaryImage(pagina.publicId);
        } catch (error) {
          console.error(`Erro ao deletar imagem da página ${pagina.id}`, error);
        }
      }
    })
  );

  await prisma.$transaction([
    prisma.paginasConteudo.deleteMany({
      where: { id: { in: validIds } },
    }),
  ]);

  revalidatePath("/admin/paginas");
  
}


export async function getAllPaginasConteudo() {
  try {
    return await prisma.paginasConteudo.findMany({
      orderBy: { ordem: 'asc' }
    });
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    throw new Error('Erro ao buscar páginas');
  }
}

export async function getAllActivesPaginasConteudo() {
  try {
    return await prisma.paginasConteudo.findMany({
      orderBy: { ordem: 'asc' },
      where: { status: true, isOnMenu: true }
    });
  } catch (error) {
    console.error('Erro ao buscar páginas:', error);
    throw new Error('Erro ao buscar páginas');
  }
}

export async function getPaginaById(id: number) {
  try {
    return await prisma.paginasConteudo.findUnique({
      where: { id }
    });
  } catch (error) {
    console.error('Erro ao buscar página:', error);
    throw new Error('Erro ao buscar página');
  }
}

export async function getPaginaByTitle(titulo: string) {
  try {
    return await prisma.paginasConteudo.findFirst({
      where: { titulo: {
        equals: titulo,
        mode: 'insensitive'
      } }
    });
  } catch (error) {
    console.error('Erro ao buscar página:', error);
    throw new Error('Erro ao buscar página');
  }
}
export async function getPaginaByUrl(url: string) {
  try {
    return await prisma.paginasConteudo.findFirst({
      where: { url: {
        equals: url,
        mode: 'insensitive'
      } }
    });
  } catch (error) {
    console.error('Erro ao buscar página:', error);
    throw new Error('Erro ao buscar página');
  }
}