/*
  Warnings:

  - Added the required column `atuacaoLocacao` to the `Corretor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `atuacaoVenda` to the `Corretor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigo` to the `Corretor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoAgencia` to the `Corretor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `codigoEquipe` to the `Corretor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `foto` to the `Corretor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `nomeAgencia` to the `Corretor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imovelId` to the `ImoveisCorretor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Corretor" ADD COLUMN     "atuacaoLocacao" TEXT NOT NULL,
ADD COLUMN     "atuacaoVenda" TEXT NOT NULL,
ADD COLUMN     "codigo" TEXT NOT NULL,
ADD COLUMN     "codigoAgencia" TEXT NOT NULL,
ADD COLUMN     "codigoEquipe" TEXT NOT NULL,
ADD COLUMN     "foto" TEXT NOT NULL,
ADD COLUMN     "nomeAgencia" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ImoveisCorretor" ADD COLUMN     "imovelId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "ImoveisCorretor" ADD CONSTRAINT "ImoveisCorretor_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
