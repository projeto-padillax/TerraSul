/*
  Warnings:

  - You are about to drop the column `exibirNoSire` on the `video` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "video" DROP COLUMN "exibirNoSire",
ADD COLUMN     "exibirNoSite" TEXT;
