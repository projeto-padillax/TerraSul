/*
  Warnings:

  - You are about to drop the column `areaPrivativa` on the `imoveis` table. All the data in the column will be lost.
  - The `areaTerreno` column on the `imoveis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "areaPrivativa",
DROP COLUMN "areaTerreno",
ADD COLUMN     "areaTerreno" DOUBLE PRECISION;
