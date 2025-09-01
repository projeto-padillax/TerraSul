/*
  Warnings:

  - You are about to drop the column `CEP` on the `ConfiguracaoPagina` table. All the data in the column will be lost.
  - You are about to drop the column `bairro` on the `ConfiguracaoPagina` table. All the data in the column will be lost.
  - You are about to drop the column `cidade` on the `ConfiguracaoPagina` table. All the data in the column will be lost.
  - You are about to drop the column `endereco` on the `ConfiguracaoPagina` table. All the data in the column will be lost.
  - You are about to drop the column `estado` on the `ConfiguracaoPagina` table. All the data in the column will be lost.
  - You are about to drop the column `linkGoogleMaps` on the `ConfiguracaoPagina` table. All the data in the column will be lost.
  - You are about to drop the column `telefone` on the `ConfiguracaoPagina` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ConfiguracaoPagina" DROP COLUMN "CEP",
DROP COLUMN "bairro",
DROP COLUMN "cidade",
DROP COLUMN "endereco",
DROP COLUMN "estado",
DROP COLUMN "linkGoogleMaps",
DROP COLUMN "telefone";

-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "rua" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "linkGoogleMaps" TEXT,
    "telefone1" TEXT,
    "isWhatsApp1" BOOLEAN,
    "telefone2" TEXT,
    "isWhatsApp2" BOOLEAN,
    "telefone3" TEXT,
    "isWhatsApp3" BOOLEAN,
    "configuracaoId" INTEGER NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_configuracaoId_fkey" FOREIGN KEY ("configuracaoId") REFERENCES "ConfiguracaoPagina"("id") ON DELETE CASCADE ON UPDATE CASCADE;
