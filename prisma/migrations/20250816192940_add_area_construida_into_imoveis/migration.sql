/*
  Warnings:

  - The `areaTotal` column on the `imoveis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `areaPrivativa` column on the `imoveis` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `areaConstruida` column on the `imoveis` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "imoveis" DROP COLUMN "areaTotal",
ADD COLUMN     "areaTotal" DOUBLE PRECISION,
DROP COLUMN "areaPrivativa",
ADD COLUMN     "areaPrivativa" DOUBLE PRECISION,
DROP COLUMN "areaConstruida",
ADD COLUMN     "areaConstruida" DOUBLE PRECISION;
