/*
  Warnings:

  - Made the column `subtitulo` on table `Banners` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Banners" ALTER COLUMN "subtitulo" SET NOT NULL;
