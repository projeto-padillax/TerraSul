/*
  Warnings:

  - You are about to drop the column `codigo` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `descricao` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `exibirNoSite` on the `videos` table. All the data in the column will be lost.
  - You are about to drop the column `tipo` on the `videos` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "videos" DROP COLUMN "codigo",
DROP COLUMN "descricao",
DROP COLUMN "exibirNoSite",
DROP COLUMN "tipo";
