"use server";

import { cookies } from "next/headers";
import { prisma } from "../neon/db";
import bcrypt from "bcrypt";
import { SignJWT } from "jose";

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function loginUser({
  login,
  senha,
}: {
  login: string;
  senha: string;
}) {
  const user = await prisma.user.findUnique({ where: { login } });
  if (!user || !user.status) throw new Error("Credenciais inválidas");
  const senhaOk = await bcrypt.compare(senha, user.senha);
  if (!senhaOk) throw new Error("Credenciais inválidas");

  const token = await new SignJWT({
    userId: user.id,
    role: user.perfil,
    name: user.name,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("2h")
    .sign(secret);

  (await cookies()).set("session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 2,
  });
}
