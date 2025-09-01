/*
  Warnings:

  - You are about to drop the `formulario` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "formulario";

-- CreateTable
CREATE TABLE "ImoveisCorretor" (
    "id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "nomeCliente" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "codigosImoveis" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "corretorId" TEXT NOT NULL,

    CONSTRAINT "ImoveisCorretor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Formulario" (
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

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ImoveisCorretor" ADD CONSTRAINT "ImoveisCorretor_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
