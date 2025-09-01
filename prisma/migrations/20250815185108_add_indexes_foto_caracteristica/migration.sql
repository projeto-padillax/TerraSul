-- CreateIndex
CREATE INDEX "caracteristicas_imovelId_idx" ON "caracteristicas"("imovelId");

-- CreateIndex
CREATE INDEX "caracteristicas_nome_valor_idx" ON "caracteristicas"("nome", "valor");

-- CreateIndex
CREATE INDEX "fotos_imovelId_id_idx" ON "fotos"("imovelId", "id");
