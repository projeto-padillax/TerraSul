-- CreateEnum
CREATE TYPE "tipoFormulario" AS ENUM ('WHATSAPP', 'FINANCIAMENTO', 'INFORMACOES', 'CONTATO', 'VISITA', 'ANUNCIEIMOVEL', 'ADMIMOVEL', 'ADMCONDOMINIO');

-- CreateEnum
CREATE TYPE "InteresseFormulario" AS ENUM ('VENDA', 'LOCACAO');

-- CreateEnum
CREATE TYPE "OrigemFormulario" AS ENUM ('ORGANICO', 'YOUTUBE', 'META', 'LINKEDIN', 'INSTAGRAM', 'FACEBOOK', 'GOOGLE');

-- CreateEnum
CREATE TYPE "PerfilUsuario" AS ENUM ('ADMIN', 'CORRETOR', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "ImoveisCorretor" (
    "id" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "nomeCliente" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "codigosImoveis" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "corretorId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImoveisCorretor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Corretor" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "CRECI" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Corretor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "perfil" "PerfilUsuario" NOT NULL,
    "telefone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Banners" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Slides" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL,

    CONSTRAINT "Slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chamadas" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "subtitulo" TEXT NOT NULL,
    "imagem" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "ordem" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Chamadas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MaisAcessado" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "MaisAcessado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaginasConteudo" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "conteudo" TEXT,
    "imagem" TEXT,
    "publicId" TEXT,
    "url" TEXT,
    "tipo" TEXT NOT NULL,
    "isOnMenu" BOOLEAN NOT NULL DEFAULT true,
    "status" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaginasConteudo_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Secao" (
    "id" SERIAL NOT NULL,
    "titulo" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sitemap" BOOLEAN NOT NULL DEFAULT true,
    "edicaoTextoFundo" BOOLEAN NOT NULL DEFAULT false,
    "descricao" TEXT NOT NULL,
    "palavrasChave" TEXT NOT NULL,
    "tituloh1" TEXT,
    "textoPagina" TEXT,
    "imagem" TEXT,
    "publicId" TEXT,

    CONSTRAINT "Secao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConfiguracaoPagina" (
    "id" SERIAL NOT NULL,
    "nomeSite" TEXT,
    "CRECI" TEXT,
    "logoUrl" TEXT,
    "facebookUrl" TEXT,
    "instagramUrl" TEXT,
    "youtubeUrl" TEXT,
    "twitterUrl" TEXT,
    "whatsappNumber" TEXT,
    "linkedInUrl" TEXT,
    "sobreNos" TEXT,

    CONSTRAINT "ConfiguracaoPagina_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endereco" (
    "id" SERIAL NOT NULL,
    "rua" TEXT,
    "bairro" TEXT,
    "cidade" TEXT,
    "estado" TEXT,
    "cep" TEXT,
    "linkGoogleMaps" TEXT,
    "telefone1" TEXT,
    "isWhatsApp1" BOOLEAN,
    "tituloTelefone1" TEXT,
    "telefone2" TEXT,
    "isWhatsApp2" BOOLEAN,
    "tituloTelefone2" TEXT,
    "telefone3" TEXT,
    "isWhatsApp3" BOOLEAN,
    "tituloTelefone3" TEXT,
    "configuracaoId" INTEGER NOT NULL,

    CONSTRAINT "Endereco_pkey" PRIMARY KEY ("id")
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
    "valorDesejado" DECIMAL(65,30),

    CONSTRAINT "Formulario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imoveis" (
    "id" TEXT NOT NULL,
    "Codigo" TEXT,
    "valorIptu" TEXT,
    "valorCondominio" TEXT,
    "Categoria" TEXT,
    "Bairro" TEXT,
    "gMapsLatitude" TEXT,
    "gMapsLongitude" TEXT,
    "Cidade" TEXT,
    "valorVenda" INTEGER,
    "valorLocacao" INTEGER,
    "Dormitorios" TEXT,
    "Suites" TEXT,
    "Vagas" TEXT,
    "areaTotal" DOUBLE PRECISION,
    "areaTerreno" DOUBLE PRECISION,
    "Descricao" TEXT,
    "dataHoraAtualizacao" TIMESTAMP(3),
    "Lancamento" TEXT,
    "Status" TEXT,
    "Empreendimento" TEXT,
    "Endereco" TEXT,
    "Numero" TEXT,
    "Complemento" TEXT,
    "UF" TEXT,
    "CEP" TEXT,
    "destaqueWeb" TEXT,
    "fotoDestaque" TEXT,
    "Latitude" TEXT,
    "Longitude" TEXT,
    "fotoDestaqueEmpreendimento" TEXT,
    "videoDestaque" TEXT,

    CONSTRAINT "imoveis_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fotos" (
    "id" SERIAL NOT NULL,
    "destaque" TEXT,
    "codigo" TEXT,
    "url" TEXT,
    "urlPequena" TEXT,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "fotos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "caracteristicas" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "caracteristicas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "infraestrutura" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "imovelId" TEXT NOT NULL,

    CONSTRAINT "infraestrutura_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cidade" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,

    CONSTRAINT "Cidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bairro" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "cidadeId" INTEGER NOT NULL,

    CONSTRAINT "Bairro_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Corretor_CRECI_key" ON "Corretor"("CRECI");

-- CreateIndex
CREATE UNIQUE INDEX "User_login_key" ON "User"("login");

-- CreateIndex
CREATE UNIQUE INDEX "ConfiguracaoPagina_CRECI_key" ON "ConfiguracaoPagina"("CRECI");

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
CREATE INDEX "fotos_imovelId_id_idx" ON "fotos"("imovelId", "id");

-- CreateIndex
CREATE INDEX "caracteristicas_imovelId_idx" ON "caracteristicas"("imovelId");

-- CreateIndex
CREATE INDEX "caracteristicas_nome_valor_idx" ON "caracteristicas"("nome", "valor");

-- CreateIndex
CREATE INDEX "infraestrutura_imovelId_idx" ON "infraestrutura"("imovelId");

-- CreateIndex
CREATE INDEX "infraestrutura_nome_valor_idx" ON "infraestrutura"("nome", "valor");

-- CreateIndex
CREATE UNIQUE INDEX "Cidade_nome_key" ON "Cidade"("nome");

-- AddForeignKey
ALTER TABLE "ImoveisCorretor" ADD CONSTRAINT "ImoveisCorretor_corretorId_fkey" FOREIGN KEY ("corretorId") REFERENCES "Corretor"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endereco" ADD CONSTRAINT "Endereco_configuracaoId_fkey" FOREIGN KEY ("configuracaoId") REFERENCES "ConfiguracaoPagina"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fotos" ADD CONSTRAINT "fotos_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "caracteristicas" ADD CONSTRAINT "caracteristicas_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "infraestrutura" ADD CONSTRAINT "infraestrutura_imovelId_fkey" FOREIGN KEY ("imovelId") REFERENCES "imoveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bairro" ADD CONSTRAINT "Bairro_cidadeId_fkey" FOREIGN KEY ("cidadeId") REFERENCES "Cidade"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
