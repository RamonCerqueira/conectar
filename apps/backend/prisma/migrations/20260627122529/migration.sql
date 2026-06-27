-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "custoValeTransporte" DECIMAL(10,2) DEFAULT 10.00,
ADD COLUMN     "horariosTrabalho" JSONB;

-- CreateTable
CREATE TABLE "registros_ponto" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "entrada" TIMESTAMP(3),
    "saida" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'NORMAL',
    "justificativa" TEXT,
    "entradaSol" TIMESTAMP(3),
    "saidaSol" TIMESTAMP(3),
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "registros_ponto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feriados" (
    "id" TEXT NOT NULL,
    "data" TIMESTAMP(3) NOT NULL,
    "descricao" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feriados_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "registros_ponto_usuarioId_idx" ON "registros_ponto"("usuarioId");

-- CreateIndex
CREATE INDEX "registros_ponto_data_idx" ON "registros_ponto"("data");

-- CreateIndex
CREATE UNIQUE INDEX "feriados_data_key" ON "feriados"("data");

-- AddForeignKey
ALTER TABLE "registros_ponto" ADD CONSTRAINT "registros_ponto_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
