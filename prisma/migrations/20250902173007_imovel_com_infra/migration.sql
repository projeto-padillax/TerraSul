-- CreateTable
CREATE TABLE "infraestrutura" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "infraestrutura_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "infraestrutura_imovelId_idx" ON "infraestrutura"("imovelId");

-- CreateIndex
CREATE INDEX "infraestrutura_nome_valor_idx" ON "infraestrutura"("nome", "valor");

-- AddForeignKey
ALTER TABLE "infraestrutura" ADD CONSTRAINT "infraestrutura_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
