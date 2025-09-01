/*
  Warnings:

  - You are about to drop the column `isOnSiteMap` on the `Secao` table. All the data in the column will be lost.
  - You are about to drop the column `ordemSiteMap` on the `Secao` table. All the data in the column will be lost.
  - You are about to drop the column `palavrasChaves` on the `Secao` table. All the data in the column will be lost.
  - You are about to drop the column `tituloH1` on the `Secao` table. All the data in the column will be lost.
  - You are about to drop the column `tituloMetadado` on the `Secao` table. All the data in the column will be lost.
  - Added the required column `palavrasChave` to the `Secao` table without a default value. This is not possible if the table is not empty.
  - Added the required column `titulo` to the `Secao` table without a default value. This is not possible if the table is not empty.
  - Made the column `descricao` on table `Secao` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Secao" DROP COLUMN "isOnSiteMap",
DROP COLUMN "ordemSiteMap",
DROP COLUMN "palavrasChaves",
DROP COLUMN "tituloH1",
DROP COLUMN "tituloMetadado",
ADD COLUMN     "edicaoTextoFundo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "palavrasChave" TEXT NOT NULL,
ADD COLUMN     "sitemap" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "titulo" TEXT NOT NULL,
ADD COLUMN     "tituloh1" TEXT,
ALTER COLUMN "descricao" SET NOT NULL;
