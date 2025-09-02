/*
  Warnings:

  - You are about to drop the column `finalidade` on the `Formulario` table. All the data in the column will be lost.
  - You are about to drop the column `Finalidade` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `Mobiliado` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `areaConstruida` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `descricaoWeb` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `informacaoVenda` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `obsVenda` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the column `tituloSite` on the `imoveis` table. All the data in the column will be lost.
  - You are about to drop the `Finalidade` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropIndex
DROP INDEX "imoveis_Mobiliado_idx";

-- AlterTable
ALTER TABLE "Formulario" DROP COLUMN "finalidade";

-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "Finalidade",
DROP COLUMN "Mobiliado",
DROP COLUMN "areaConstruida",
DROP COLUMN "descricaoWeb",
DROP COLUMN "informacaoVenda",
DROP COLUMN "obsVenda",
DROP COLUMN "tituloSite";

-- DropTable
DROP TABLE "Finalidade";
