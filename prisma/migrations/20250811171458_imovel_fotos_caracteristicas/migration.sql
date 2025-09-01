-- CreateTable
CREATE TABLE "Imovel" (
    "id" TEXT NOT NULL,
    "UF" TEXT,
    "Longitude" TEXT,
    "Latitude" TEXT,
    "Codigo" TEXT,
    "ObsVenda" TEXT,
    "Dormitorios" TEXT,
    "Complemento" TEXT,
    "ValorIptu" TEXT,
    "Numero" TEXT,
    "Cidade" TEXT,
    "AreaPrivativa" TEXT,
    "Suites" TEXT,
    "ValorVenda" TEXT,
    "FotoDestaqueEmpreendimento" TEXT,
    "Status" TEXT,
    "CEP" TEXT,
    "DescricaoWeb" TEXT,
    "ValorCondominio" TEXT,
    "DestaqueWeb" TEXT,
    "VideoDestaque" TEXT,
    "AreaTerreno" TEXT,
    "Vagas" TEXT,
    "TituloSite" TEXT,
    "Bairro" TEXT,
    "AreaTotal" TEXT,
    "Endereco" TEXT,
    "FotoDestaque" TEXT,
    "Descricao" TEXT,
    "GMapsLongitude" TEXT,
    "GMapsLatitude" TEXT,
    "InformacaoVenda" TEXT,
    "CodigoImobiliaria" TEXT,
    "DataHoraAtualizacao" TIMESTAMP(3),
    "ValorLocacao" TEXT,
    "Mobiliado" TEXT,
    "Empreendimento" TEXT,
    "Categoria" TEXT,
    "Lancamento" TEXT,
    "Finalidade" TEXT,

    CONSTRAINT "Imovel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Foto" (
    "id" SERIAL NOT NULL,
    "destaque" TEXT,
    "codigo" TEXT,
    "url" TEXT,
    "urlPequena" TEXT,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "Foto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Caracteristica" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "Caracteristica_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Foto" ADD CONSTRAINT "Foto_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Caracteristica" ADD CONSTRAINT "Caracteristica_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "Imovel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
