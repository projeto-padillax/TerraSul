"use server";

import { z } from "zod";
import { prisma } from "../neon/db";
import { User as UserORM } from "@prisma/client";
import bcrypt from "bcrypt";
import { UserInput } from "@/components/admin/userForm";
import { getSession } from "../auth/session";

const userserverSchema = z.object({
    status: z.boolean(),
    name: z
        .string()
        .min(1, "Nome é obrigatório.")
        .max(100, "Nome deve ter no máximo 100 caracteres."),
    email: z
        .string().check(z.email()).refine((email) => email.toLowerCase().endsWith(".com") || email.endsWith(".br"), {
            message: "Email invalido",
        }),
    telefone: z
        .string()
        .min(1, "Telefone é obrigatório.")
        .max(15, "Telefone deve ter no máximo 15 caracteres."),
    login: z.
        string()
        .min(1, "Login é obrigatório.")
        .max(11, "Login deve ter no máximo 11 caracteres."),

    perfil: z.enum({
        "ADMIN": "ADMIN",
        "CORRETOR": "CORRETOR",
        "SUPERADMIN": "SUPERADMIN",
    },
        {
            message: "Perfil deve ser ADMIN, CORRETOR ou SUPERADMIN.",
        }
    ),
    senha: z.string().min(6, "Senha deve ter ao menos 6 caracteres."),
});

const idsSchema = z.array(z.cuid());
const idSchema = z.cuid();

export async function getAllUsers(): Promise<UserORM[]> {
    return await prisma.user.findMany();
}

export async function findUser(id: string): Promise<UserORM | null> {
    // Validar ID
    const validId = idSchema.parse(id);
    return await prisma.user.findUnique({ where: { id: validId } });
}

const updateUserSchema = userserverSchema.partial().extend({
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres").optional()
});

export async function createUser({
    name,
    email,
    telefone,
    perfil,
    status = true,
    login,
    senha
}: UserInput) {
    const validatedData = userserverSchema.parse({
        name,
        email,
        telefone,
        perfil,
        status,
        login,
        senha
    });

    const hashedPassword = await bcrypt.hash(validatedData.senha, 10);

    await prisma.user.create({
        data: {
            name: validatedData.name,
            email: validatedData.email,
            telefone: validatedData.telefone,
            perfil: validatedData.perfil,
            status: validatedData.status,
            login: validatedData.login,
            senha: hashedPassword,
        },
    });
}

export async function updateUser(User: Omit<UserORM, "createdAt">) {
    const session = await getSession();

    if (!session) {
        throw new Error("Sessão inválida ou expirada.");
    }

    const { id, ...UserWithoutId } = User;

    // Validar ID
    const validId = idSchema.parse(id);

    const userToUpdate = await prisma.user.findUnique({
        where: { id: validId },
        select: { perfil: true },
    });

    if (!userToUpdate) {
        throw new Error("Usuário não encontrado.");
    }

    if (
        userToUpdate.perfil === "SUPERADMIN" &&
        session.role !== "SUPERADMIN"
    ) {
        throw new Error("Apenas SUPERADMINs podem editar usuários SUPERADMIN.");
    }

    const validatedData = updateUserSchema.parse({
        ...UserWithoutId,
    });

    if (validatedData.senha) {
        validatedData.senha = await bcrypt.hash(validatedData.senha, 10);
    }

    await prisma.user.update({
        where: { id: validId },
        data: validatedData,
    });
}

export async function activateUsers(ids: string[]) {
    // Validar IDs
    const validIds = idsSchema.parse(ids);

    await prisma.$transaction(
        validIds.map((id) =>
            prisma.user.update({ where: { id }, data: { status: true } })
        )
    );
}

export async function deactivateUsers(ids: string[]) {
    const session = await getSession();

    if (!session) {
        throw new Error("Sessão inválida ou expirada.");
    }

    const validIds = idsSchema.parse(ids);

    for (const id of validIds) {
        const userToDeactivate = await prisma.user.findUnique({
            where: { id },
            select: { perfil: true },
        });

        if (!userToDeactivate) continue;

        if (
            userToDeactivate.perfil === "SUPERADMIN" &&
            session.role !== "SUPERADMIN"
        ) {
            throw new Error("Apenas SUPERADMINs podem desativar outros SUPERADMINs.");
        }
    }

    await prisma.$transaction(
        validIds.map((id) =>
            prisma.user.update({ where: { id }, data: { status: false } })
        )
    );
}

export async function deleteUsers(ids: string[]) {
    const session = await getSession();

    if (!session) {
        throw new Error("Sessão inválida ou expirada");
    }

    const validIds = idsSchema.parse(ids);

    for (const id of validIds) {
        const userToDelete = await prisma.user.findUnique({
            where: { id },
            select: { perfil: true },
        });

        if (!userToDelete) continue;

        if (
            userToDelete.perfil === "SUPERADMIN" &&
            session.role !== "SUPERADMIN"
        ) {
            throw new Error("Não autorizado para remover um SUPERADMIN");
        }
    }

    await prisma.user.deleteMany({
        where: {
            id: { in: validIds },
        },
    });
}
