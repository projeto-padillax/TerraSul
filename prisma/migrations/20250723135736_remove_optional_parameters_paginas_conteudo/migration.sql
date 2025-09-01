/*
  Warnings:

  - Made the column `titulo` on table `PaginasConteudo` required. This step will fail if there are existing NULL values in that column.
  - Made the column `ordem` on table `PaginasConteudo` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "PaginasConteudo" ALTER COLUMN "titulo" SET NOT NULL,
ALTER COLUMN "ordem" SET NOT NULL;
