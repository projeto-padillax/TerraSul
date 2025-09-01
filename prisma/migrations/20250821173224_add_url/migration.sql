/*
  Warnings:

  - Added the required column `url` to the `Secao` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Secao" ADD COLUMN     "url" TEXT NOT NULL;
