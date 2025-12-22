"use server";

import { prisma } from "../neon/db";
import { MaisAcessado as MaisAcessadoORM } from "@prisma/client";
// import { MaisAcessadoInput } from "@/app/admin/maisAcessados/novo/page";

export async function getAllMaisAcessados(): Promise<MaisAcessadoORM[]> {
  return await prisma.maisAcessado.findMany();
}

export async function findMaisAcessado(
  id: number,
): Promise<MaisAcessadoORM | null> {
  return await prisma.maisAcessado.findUnique({ where: { id } });
}

// export async function createMaisAcessado({ titulo, url, status }: MaisAcessadoInput) {
//   await prisma.maisAcessado.create({
//     data: {
//       titulo,
//       url,
//       status: status === "ativo"
//     },
//   });
// }

export async function activateMaisAcessados(ids: number[]) {
  await Promise.all(
    ids.map((id) =>
      prisma.maisAcessado.update({ where: { id }, data: { status: true } }),
    ),
  );
}

export async function deactivateMaisAcessados(ids: number[]) {
  await Promise.all(
    ids.map((id) =>
      prisma.maisAcessado.update({ where: { id }, data: { status: false } }),
    ),
  );
}

export async function deleteMaisAcessados(ids: number[]) {
  await Promise.all(
    ids.map((id) => prisma.maisAcessado.deleteMany({ where: { id } })),
  );
}

