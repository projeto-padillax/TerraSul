/*
  Warnings:

  - A unique constraint covering the columns `[Codigo]` on the table `imoveis` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "imoveis_Codigo_key" ON "imoveis"("Codigo");

-- CreateIndex
CREATE INDEX "imoveis_Cidade_Status_idx" ON "imoveis"("Cidade", "Status");

-- CreateIndex
CREATE INDEX "imoveis_Bairro_idx" ON "imoveis"("Bairro");

-- CreateIndex
CREATE INDEX "imoveis_Categoria_idx" ON "imoveis"("Categoria");

-- CreateIndex
CREATE INDEX "imoveis_valorVenda_idx" ON "imoveis"("valorVenda");

-- CreateIndex
CREATE INDEX "imoveis_valorLocacao_idx" ON "imoveis"("valorLocacao");

-- CreateIndex
CREATE INDEX "imoveis_dataHoraAtualizacao_idx" ON "imoveis"("dataHoraAtualizacao");

-- CreateIndex
CREATE INDEX "imoveis_Lancamento_idx" ON "imoveis"("Lancamento");

-- CreateIndex
CREATE INDEX "imoveis_Mobiliado_idx" ON "imoveis"("Mobiliado");
