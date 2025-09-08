/*
  Warnings:

  - You are about to drop the `video` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "video" DROP CONSTRAINT "video_imovelId_fkey";

-- DropTable
DROP TABLE "video";

-- CreateTable
CREATE TABLE "videos" (
    "id" SERIAL NOT NULL,
    "destaque" TEXT,
    "codigo" TEXT,
    "descricao" TEXT,
    "tipo" TEXT,
    "exibirNoSite" TEXT,
    "video" TEXT,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "videos_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "videos_imovelId_id_idx" ON "videos"("imovelId", "id");

-- AddForeignKey
ALTER TABLE "videos" ADD CONSTRAINT "videos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
