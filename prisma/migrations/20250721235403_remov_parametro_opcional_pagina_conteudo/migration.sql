/*
  Warnings:

  - You are about to drop the column `publicId` on the `Banners` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Chamadas` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `PaginasConteudo` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Secao` table. All the data in the column will be lost.
  - You are about to drop the column `publicId` on the `Slides` table. All the data in the column will be lost.
  - Made the column `titulo` on table `PaginasConteudo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ordem` on table `PaginasConteudo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `conteudo` on table `PaginasConteudo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `imagem` on table `PaginasConteudo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Banners" DROP COLUMN "publicId";

-- AlterTable
ALTER TABLE "Chamadas" DROP COLUMN "publicId";

-- AlterTable
ALTER TABLE "PaginasConteudo" DROP COLUMN "publicId",
ALTER COLUMN "titulo" SET NOT NULL,
ALTER COLUMN "ordem" SET NOT NULL,
ALTER COLUMN "conteudo" SET NOT NULL,
ALTER COLUMN "imagem" SET NOT NULL;

-- AlterTable
ALTER TABLE "Secao" DROP COLUMN "publicId";

-- AlterTable
ALTER TABLE "Slides" DROP COLUMN "publicId";
