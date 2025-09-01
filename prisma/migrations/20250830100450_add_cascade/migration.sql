-- DropForeignKey
ALTER TABLE "caracteristicas" DROP CONSTRAINT "caracteristicas_imovelId_fkey";

-- DropForeignKey
ALTER TABLE "fotos" DROP CONSTRAINT "fotos_imovelId_fkey";

-- AddForeignKey
ALTER TABLE "fotos" ADD CONSTRAINT "fotos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicas" ADD CONSTRAINT "caracteristicas_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
