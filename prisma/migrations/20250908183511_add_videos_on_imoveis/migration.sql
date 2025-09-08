-- CreateTable
CREATE TABLE "video" (
    "id" SERIAL NOT NULL,
    "destaque" TEXT,
    "codigo" TEXT,
    "descricao" TEXT,
    "tipo" TEXT,
    "exibirNoSire" TEXT,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "video_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "video_imovelId_id_idx" ON "video"("imovelId", "id");

-- AddForeignKey
ALTER TABLE "video" ADD CONSTRAINT "video_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
