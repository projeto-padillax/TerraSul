"use server";

import { z } from "zod";
import { prisma } from "../neon/db";

const enderecoSchema = z.object({
  titulo: z.string().optional(),
  rua: z.string().max(200, "Rua deve ter no máximo 200 caracteres.").optional(),
  bairro: z
    .string()
    .max(100, "Bairro deve ter no máximo 100 caracteres.")
    .optional(),
  cidade: z
    .string()
    .max(100, "Cidade deve ter no máximo 100 caracteres.")
    .optional(),
  estado: z.string().optional(),
  cep: z.string().max(10, "CEP deve ter no máximo 10 caracteres.").optional(),
  linkGoogleMaps: z
    .string()
    .url("URL do Google Maps inválida.")
    .or(z.literal(""))
    .optional(),
  telefone1: z.string().optional(),
  isWhatsApp1: z.boolean().optional(),
  tituloTelefone1: z.string().optional(),
  telefone2: z.string().optional(),
  isWhatsApp2: z.boolean().optional(),
  tituloTelefone2: z.string().optional(),
  telefone3: z.string().optional(),
  isWhatsApp3: z.boolean().optional(),
  tituloTelefone3: z.string().optional(),
});

const configuracaoServerSchema = z.object({
  nomeSite: z
    .string()
    .max(100, "Nome do site deve ter no máximo 100 caracteres.")
    .nullable(),
  CRECI: z
    .string()
    .max(20, "CRECI deve ter no máximo 20 caracteres.")
    .nullable(),
  logoUrl: z.string().url("URL do logo inválida.").nullable().or(z.literal("")),
  facebookUrl: z
    .string()
    .url("URL do Facebook inválida.")
    .nullable()
    .or(z.literal("")),
  instagramUrl: z
    .string()
    .url("URL do Instagram inválida.")
    .nullable()
    .or(z.literal("")),
  youtubeUrl: z
    .string()
    .url("URL do YouTube inválida.")
    .nullable()
    .or(z.literal("")),
  twitterUrl: z
    .string()
    .url("URL do Twitter inválida.")
    .nullable()
    .or(z.literal("")),
  whatsappNumber: z
    .string()
    .nullable(),
  linkedInUrl: z
    .string()
    .url("URL do LinkedIn inválida.")
    .nullable()
    .or(z.literal("")),
  sobreNos: z
    .string()
    .max(2000, "Sobre nós deve ter no máximo 2000 caracteres.")
    .nullable(),
  enderecos: z
    .array(enderecoSchema)
    .max(10, "Máximo de 10 endereços permitidos."),
});

export type configuracaoSchema = z.infer<typeof configuracaoServerSchema>;

export async function getConfiguracaoPagina(): Promise<configuracaoSchema | null> {
  try {
    const record = await prisma.configuracaoPagina.findFirst({
      orderBy: { id: "asc" },
      select: {
        nomeSite: true,
        CRECI: true,
        logoUrl: true,
        facebookUrl: true,
        instagramUrl: true,
        youtubeUrl: true,
        linkedInUrl: true,
        twitterUrl: true,
        whatsappNumber: true,
        sobreNos: true,
        enderecos: {
          select: {
            id: true,
            titulo: true,
            rua: true,
            bairro: true,
            cidade: true,
            estado: true,
            cep: true,
            linkGoogleMaps: true,
            telefone1: true,
            isWhatsApp1: true,
            tituloTelefone1: true,
            telefone2: true,
            isWhatsApp2: true,
            tituloTelefone2: true,
            telefone3: true,
            isWhatsApp3: true,
            tituloTelefone3: true,
          },
        },
      },
    });

    if (!record) return null;

    // Sanitização do retorno (evita valores null/undefined)
    const sanitized: configuracaoSchema = {
      nomeSite: record.nomeSite ?? "",
      CRECI: record.CRECI ?? "",
      logoUrl: record.logoUrl ?? "",
      facebookUrl: record.facebookUrl ?? "",
      instagramUrl: record.instagramUrl ?? "",
      youtubeUrl: record.youtubeUrl ?? "",
      linkedInUrl: record.linkedInUrl ?? "",
      twitterUrl: record.twitterUrl ?? "",
      whatsappNumber: record.whatsappNumber ?? "",
      sobreNos: record.sobreNos ?? "",
      enderecos: record.enderecos.map((endereco) => ({
        titulo: endereco.titulo ?? "",
        rua: endereco.rua ?? "",
        bairro: endereco.bairro ?? "",
        cidade: endereco.cidade ?? "",
        estado: endereco.estado ?? "",
        cep: endereco.cep ?? "",
        linkGoogleMaps: endereco.linkGoogleMaps ?? "",
        telefone1: endereco.telefone1 ?? "",
        isWhatsApp1: endereco.isWhatsApp1 ?? false,
        tituloTelefone1: endereco.tituloTelefone1 ?? "",
        telefone2: endereco.telefone2 ?? "",
        isWhatsApp2: endereco.isWhatsApp2 ?? false,
        tituloTelefone2: endereco.tituloTelefone2 ?? "",
        telefone3: endereco.telefone3 ?? "",
        isWhatsApp3: endereco.isWhatsApp3 ?? false,
        tituloTelefone3: endereco.tituloTelefone3 ?? "",
      })),
    };

    return sanitized;
  } catch (error) {
    console.error("Erro ao buscar configuração da página:", error);
    throw new Error("Erro ao buscar configuração da página");
  }
}

export async function GetEnderecos() {
  try {
    const cfg = await prisma.configuracaoPagina.findFirst({
      orderBy: { id: "asc" },
      select: {
        enderecos: {
          select: {
            id: true,
            titulo: true,
            rua: true,
            bairro: true,
            cidade: true,
            estado: true,
            cep: true,
            linkGoogleMaps: true,
            telefone1: true,
            isWhatsApp1: true,
            tituloTelefone1: true,
            telefone2: true,
            isWhatsApp2: true,
            tituloTelefone2: true,
            telefone3: true,
            isWhatsApp3: true,
            tituloTelefone3: true,
          },
        },
      },
    });

    const enderecos = cfg?.enderecos ?? [];
    return enderecos;
  } catch (error) {
    console.error("Erro ao buscar 'Sobre nós':", error);
    throw new Error("Erro ao buscar 'Sobre nós'");
  }
}

export async function getSobreNos(): Promise<string | null> {
  try {
    const record = await prisma.configuracaoPagina.findFirst({
      orderBy: { id: "asc" },
      select: { sobreNos: true },
    });

    if (!record) return null;

    // Sanitiza: garante string, mesmo se vier null
    return record.sobreNos ?? "";
  } catch (error) {
    console.error("Erro ao buscar 'Sobre nós':", error);
    throw new Error("Erro ao buscar 'Sobre nós'");
  }
}

export async function createConfiguracaoPagina(
  configuracao: Omit<configuracaoSchema, "id">
) {
  try {
    const existingConfig = await prisma.configuracaoPagina.findFirst();
    if (existingConfig) {
      throw new Error("Já existe uma configuração. Use a função de atualizar.");
    }

    const validatedData = configuracaoServerSchema.parse(configuracao);

    await prisma.configuracaoPagina.create({
      data: {
        nomeSite: validatedData.nomeSite ?? "",
        CRECI: validatedData.CRECI ?? "",
        logoUrl: validatedData.logoUrl ?? "",
        facebookUrl: validatedData.facebookUrl ?? "",
        instagramUrl: validatedData.instagramUrl ?? "",
        youtubeUrl: validatedData.youtubeUrl ?? "",
        twitterUrl: validatedData.twitterUrl ?? "",
        whatsappNumber: validatedData.whatsappNumber ?? "",
        linkedInUrl: validatedData.linkedInUrl ?? "",
        sobreNos: validatedData.sobreNos ?? "",
        enderecos: {
          create: validatedData.enderecos.map((endereco) => ({
            titulo: endereco.titulo,
            rua: endereco.rua,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            cep: endereco.cep,
            linkGoogleMaps: endereco.linkGoogleMaps,
            telefone1: endereco.telefone1,
            isWhatsApp1: endereco.isWhatsApp1,
            tituloTelefone1: endereco.tituloTelefone1,
            telefone2: endereco.telefone2,
            isWhatsApp2: endereco.isWhatsApp2,
            tituloTelefone2: endereco.tituloTelefone2,
            telefone3: endereco.telefone3,
            isWhatsApp3: endereco.isWhatsApp3,
            tituloTelefone3: endereco.tituloTelefone3,
          })),
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.message}`);
    }
    console.error("Erro ao criar configuração da página:", error);
    throw new Error("Erro ao criar configuração da página");
  }
}

export async function updateConfiguracaoPagina(
  configuracao: Omit<configuracaoSchema, "id">
) {
  try {
    const existingConfig = await prisma.configuracaoPagina.findFirst();
    if (!existingConfig) {
      throw new Error("Configuração não encontrada");
    }

    const validatedData = configuracaoServerSchema.parse(configuracao);

    // Estratégia: Deletar endereços e telefones antigos e recriar tudo (mais simples)
    await prisma.endereco.deleteMany({
      where: {
        configuracaoId: existingConfig.id,
      },
    });

    await prisma.configuracaoPagina.update({
      where: { id: existingConfig.id },
      data: {
        nomeSite: validatedData.nomeSite ?? "",
        CRECI: validatedData.CRECI ?? "",
        logoUrl: validatedData.logoUrl ?? "",
        facebookUrl: validatedData.facebookUrl ?? "",
        instagramUrl: validatedData.instagramUrl ?? "",
        youtubeUrl: validatedData.youtubeUrl ?? "",
        twitterUrl: validatedData.twitterUrl ?? "",
        whatsappNumber: validatedData.whatsappNumber ?? "",
        linkedInUrl: validatedData.linkedInUrl ?? "",
        sobreNos: validatedData.sobreNos ?? "",
        enderecos: {
          create: validatedData.enderecos.map((endereco) => ({
            titulo: endereco.titulo,
            rua: endereco.rua,
            bairro: endereco.bairro,
            cidade: endereco.cidade,
            estado: endereco.estado,
            cep: endereco.cep,
            linkGoogleMaps: endereco.linkGoogleMaps,
            telefone1: endereco.telefone1,
            isWhatsApp1: endereco.isWhatsApp1,
            tituloTelefone1: endereco.tituloTelefone1,
            telefone2: endereco.telefone2,
            isWhatsApp2: endereco.isWhatsApp2,
            tituloTelefone2: endereco.tituloTelefone2,
            telefone3: endereco.telefone3,
            isWhatsApp3: endereco.isWhatsApp3,
            tituloTelefone3: endereco.tituloTelefone3,
          })),
        },
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Dados inválidos: ${error.message}`);
    }
    console.error("Erro ao atualizar configuração da página:", error);
    throw new Error("Erro ao atualizar configuração da página");
  }

}

export async function getLogo(){
  try {
    const record = await prisma.configuracaoPagina.findFirst({
      orderBy: { id: "asc" },
      select: { logoUrl: true },
    });

    if (!record) return null;

    // Sanitiza: garante string, mesmo se vier null
    return record.logoUrl ?? "";
  } catch (error) {
    console.error("Erro ao buscar logo:", error);
    throw new Error("Erro ao buscar logo");
  }
}
