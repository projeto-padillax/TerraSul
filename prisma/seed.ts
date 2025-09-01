import { PrismaClient, PerfilUsuario } from "@prisma/client";
import { Secoes } from "./secoes";
const prisma = new PrismaClient();
import bcrypt from "bcrypt";

async function main() {
  const senha = await bcrypt.hash('samurai', 10);
  // superadmin
  await prisma.user.create({
    data: {
      name: "Danton",
      perfil: PerfilUsuario.SUPERADMIN,
      email: "Danton@prisma.io",
      telefone: "555191808322",
      login: "danton",
      senha: senha,
    },
  });

  const secoes = Secoes;

  await prisma.secao.createMany({
    data: secoes
  })
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
