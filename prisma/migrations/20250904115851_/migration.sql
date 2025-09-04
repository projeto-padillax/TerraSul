-- AlterTable
ALTER TABLE "imoveis" ADD COLUMN     "corretorId" TEXT;

-- CreateTable
CREATE TABLE "CorretorExterno" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "nomeAgencia" TEXT NOT NULL,
    "codigo" TEXT NOT NULL,
    "codigoAgencia" TEXT NOT NULL,
    "codigoEquipe" TEXT NOT NULL,
    "foto" TEXT NOT NULL,
    "atuacaoLocacao" TEXT NOT NULL,
    "atuacaoVenda" TEXT NOT NULL,
    "CRECI" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CorretorExterno_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CorretorExterno_CRECI_key" ON "CorretorExterno"("CRECI");

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "CorretorExterno"("id") ON DELETE SET NULL ON UPDATE CASCADE;
