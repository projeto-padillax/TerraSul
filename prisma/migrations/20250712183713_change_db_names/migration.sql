/*
  Warnings:

  - You are about to drop the `BannerHome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ChamadasHome` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `MaisAcessador` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `SlidesHome` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "BannerHome";

-- DropTable
DROP TABLE "ChamadasHome";

-- DropTable
DROP TABLE "MaisAcessador";

-- DropTable
DROP TABLE "SlidesHome";

-- CreateTable
CREATE TABLE "Banners" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "subTitulo" TEXT,
    "imagem" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slides" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagemUrl" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "Slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chamadas" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "subTitulo" TEXT,
    "imagemUrl" TEXT,
    "link" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "Chamadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaisAcessado" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MaisAcessado_pkey" PRIMARY KEY ("id")
);
