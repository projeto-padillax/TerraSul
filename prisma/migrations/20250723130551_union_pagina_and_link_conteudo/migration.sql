/*
  Warnings:

  - You are about to drop the `LinkConteudo` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `publicId` to the `Banners` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Chamadas` table without a default value. This is not possible if the table is not empty.
  - Added the required column `publicId` to the `Slides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Banners" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Chamadas" ADD COLUMN     "publicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaginasConteudo" ADD COLUMN     "publicId" TEXT,
ADD COLUMN     "url" TEXT,
ALTER COLUMN "titulo" DROP NOT NULL,
ALTER COLUMN "ordem" DROP NOT NULL,
ALTER COLUMN "conteudo" DROP NOT NULL,
ALTER COLUMN "imagem" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Secao" ADD COLUMN     "publicId" TEXT;

-- AlterTable
ALTER TABLE "Slides" ADD COLUMN     "publicId" TEXT NOT NULL;

-- DropTable
DROP TABLE "LinkConteudo";
