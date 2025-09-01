/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[login]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `login` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `perfil` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `senha` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "tipoFormulario" AS ENUM ('WHATSAPP', 'FINANCIAMENTO', 'INFORMACOES', 'CONTATO', 'VISITA', 'ANUNCIEIMOVEL', 'ADMIMOVEL', 'ADMCONDOMINIO');

-- CreateEnum
CREATE TYPE "InteresseFormulario" AS ENUM ('VENDA', 'LOCACAO');

-- CreateEnum
CREATE TYPE "OrigemFormulario" AS ENUM ('ORGANICO', 'YOUTUBE', 'META', 'LINKEDIN', 'INSTAGRAM', 'FACEBOOK', 'GOOGLE');

-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ADMIN', 'CORRETOR', 'SUPERADMIN');

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ADD COLUMN     "login" TEXT NOT NULL,
ADD COLUMN     "perfil" "PerfilUsuario" NOT NULL,
ADD COLUMN     "senha" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- CreateTable
CREATE TABLE "Corretor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "CRECI" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Corretor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BannerHome" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "subTitulo" TEXT,
    "imagemUrl" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "BannerHome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SlidesHome" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "SlidesHome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChamadasHome" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "subTitulo" TEXT,
    "imagemUrl" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "ChamadasHome_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaisAcessador" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MaisAcessador_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaginasConteudo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT,
    "ordem" INTEGER,
    "conteudo" TEXT,
    "imagemUrl" TEXT,
    "isOnMenu" BOOLEAN NOT NULL DEFAULT true,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaginasConteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LinkConteudo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LinkConteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secao" (
    "id" SERIAL NOT NULL,
    "tituloMetadado" TEXT,
    "isOnSiteMap" BOOLEAN NOT NULL DEFAULT true,
    "ordemSiteMap" INTEGER,
    "descricao" TEXT,
    "palavrasChaves" TEXT,
    "tituloH1" TEXT,
    "textoPagina" TEXT,
    "imagemUrl" TEXT,

    CONSTRAINT "Secao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracaoPagina" (
    "id" SERIAL NOT NULL,
    "nomeSite" TEXT,
    "CRECI" TEXT,
    "logoUrl" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "twitterUrl" TEXT,
    "whatsappNumber" TEXT,
    "linkedInUrl" TEXT,
    "sobreNos" TEXT,
    "endereco" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "CEP" TEXT,
    "linkGoogleMaps" TEXT,
    "telefone" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "ConfiguracaoPagina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "formulario" (
    "id" TEXT NOT NULL,
    "tipo" "tipoFormulario" NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "urlRespondida" TEXT NOT NULL,
    "origem" "OrigemFormulario" NOT NULL DEFAULT 'ORGANICO',
    "interesse" "InteresseFormulario",
    "dataEnvio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "turnoVisita" TEXT,
    "DataVisita" TIMESTAMP(3),
    "codigoImovel" TEXT,
    "mensagem" TEXT,
    "condominio" TEXT,
    "assunto" TEXT,

    CONSTRAINT "formulario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Corretor_CRECI_key" ON "Corretor"("CRECI");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracaoPagina_CRECI_key" ON "ConfiguracaoPagina"("CRECI");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");
