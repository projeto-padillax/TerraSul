/*
  Warnings:

  - You are about to drop the column `imagemUrl` on the `Chamadas` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Chamadas` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `LinkConteudo` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `MaisAcessado` table. All the data in the column will be lost.
  - You are about to drop the column `imagemUrl` on the `PaginasConteudo` table. All the data in the column will be lost.
  - You are about to drop the column `imagemUrl` on the `Secao` table. All the data in the column will be lost.
  - You are about to drop the column `imagemUrl` on the `Slides` table. All the data in the column will be lost.
  - You are about to drop the column `link` on the `Slides` table. All the data in the column will be lost.
  - Added the required column `url` to the `LinkConteudo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `MaisAcessado` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagem` to the `Slides` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `Slides` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Chamadas" DROP COLUMN "imagemUrl",
DROP COLUMN "link",
ADD COLUMN     "imagem" TEXT,
ADD COLUMN     "url" TEXT;

-- AlterTable
ALTER TABLE "LinkConteudo" DROP COLUMN "link",
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "MaisAcessado" DROP COLUMN "link",
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "PaginasConteudo" DROP COLUMN "imagemUrl",
ADD COLUMN     "imagem" TEXT;

-- AlterTable
ALTER TABLE "Secao" DROP COLUMN "imagemUrl",
ADD COLUMN     "imagem" TEXT;

-- AlterTable
ALTER TABLE "Slides" DROP COLUMN "imagemUrl",
DROP COLUMN "link",
ADD COLUMN     "imagem" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
