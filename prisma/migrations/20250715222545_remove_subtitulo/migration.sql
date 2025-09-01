/*
  Warnings:

  - The values [LOCACAO] on the enum `InteresseFormulario` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `subTitulo` on the `Chamadas` table. All the data in the column will be lost.
  - Added the required column `subtitulo` to the `Chamadas` table without a default value. This is not possible if the table is not empty.
  - Made the column `imagem` on table `Chamadas` required. This step will fail if there are existing NULL values in that column.
  - Made the column `url` on table `Chamadas` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "InteresseFormulario_new" AS ENUM ('VENDA');
ALTER TABLE "Formulario" ALTER COLUMN "interesse" TYPE "InteresseFormulario_new" USING ("interesse"::text::"InteresseFormulario_new");
ALTER TYPE "InteresseFormulario" RENAME TO "InteresseFormulario_old";
ALTER TYPE "InteresseFormulario_new" RENAME TO "InteresseFormulario";
DROP TYPE "InteresseFormulario_old";
COMMIT;

-- AlterTable
ALTER TABLE "Chamadas" DROP COLUMN "subTitulo",
ADD COLUMN     "subtitulo" TEXT NOT NULL,
ALTER COLUMN "imagem" SET NOT NULL,
ALTER COLUMN "url" SET NOT NULL;
