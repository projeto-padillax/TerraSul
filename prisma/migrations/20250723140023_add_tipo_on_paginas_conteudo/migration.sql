/*
  Warnings:

  - Added the required column `tipo` to the `PaginasConteudo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PaginasConteudo" ADD COLUMN     "tipo" TEXT NOT NULL;
