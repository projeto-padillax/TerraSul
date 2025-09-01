/*
  Warnings:

  - You are about to drop the column `subTitulo` on the `Banners` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Banners" DROP COLUMN "subTitulo",
ADD COLUMN     "subtitulo" TEXT;
