/*
  Warnings:

  - Added the required column `publicId` to the `Banners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Chamadas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Slides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banners" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Chamadas" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaginasConteudo" ADD COLUMN     "publicId" TEXT;

-- AlterTable
ALTER TABLE "Secao" ADD COLUMN     "publicId" TEXT;

-- AlterTable
ALTER TABLE "Slides" ADD COLUMN     "publicId" TEXT NOT NULL;
