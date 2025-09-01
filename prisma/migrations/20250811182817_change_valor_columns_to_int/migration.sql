/*
  Warnings:

  - You are about to drop the `Caracteristica` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Foto` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Imovel` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Caracteristica" DROP CONSTRAINT "Caracteristica_imovelId_fkey";

-- DropForeignKey
ALTER TABLE "Foto" DROP CONSTRAINT "Foto_imovelId_fkey";

-- DropTable
DROP TABLE "Caracteristica";

-- DropTable
DROP TABLE "Foto";

-- DropTable
DROP TABLE "Imovel";

-- CreateTable
CREATE TABLE "imoveis" (
    "id" TEXT NOT NULL,
    "Codigo" TEXT,
    "valorIptu" TEXT,
    "valorCondominio" TEXT,
    "Categoria" TEXT,
    "informacaoVenda" TEXT,
    "obsVenda" TEXT,
    "areaTerreno" TEXT,
    "Bairro" TEXT,
    "gMapsLatitude" TEXT,
    "gMapsLongitude" TEXT,
    "descricaoWeb" TEXT,
    "Cidade" TEXT NOT NULL,
    "valorVenda" INTEGER,
    "valorLocacao" INTEGER,
    "Dormitorios" TEXT,
    "Suites" TEXT,
    "Vagas" TEXT,
    "areaTotal" TEXT,
    "areaPrivativa" TEXT,
    "Descricao" TEXT,
    "dataHoraAtualizacao" TIMESTAMP(3),
    "Lancamento" TEXT,
    "Finalidade" TEXT,
    "Status" TEXT,
    "Empreendimento" TEXT,
    "Endereco" TEXT,
    "Numero" TEXT,
    "Complemento" TEXT,
    "UF" TEXT,
    "CEP" TEXT,
    "destaqueWeb" TEXT,
    "fotoDestaque" TEXT,
    "Latitude" TEXT,
    "Longitude" TEXT,
    "tituloSite" TEXT,
    "fotoDestaqueEmpreendimento" TEXT,
    "videoDestaque" TEXT,
    "Mobiliado" TEXT,

    CONSTRAINT "imoveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos" (
    "id" SERIAL NOT NULL,
    "destaque" TEXT,
    "codigo" TEXT,
    "url" TEXT,
    "urlPequena" TEXT,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristicas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "caracteristicas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fotos" ADD CONSTRAINT "fotos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicas" ADD CONSTRAINT "caracteristicas_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
