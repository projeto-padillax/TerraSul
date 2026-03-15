-- CreateIndex
CREATE INDEX "Bairro_cidadeId_idx" ON "Bairro"("cidadeId");

-- CreateIndex
CREATE INDEX "Formulario_dataEnvio_idx" ON "Formulario"("dataEnvio");

-- CreateIndex
CREATE INDEX "imoveis_destaqueWeb_Lancamento_Status_idx" ON "imoveis"("destaqueWeb", "Lancamento", "Status");
