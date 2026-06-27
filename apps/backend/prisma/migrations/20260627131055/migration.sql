-- AlterTable
ALTER TABLE "contratos" ADD COLUMN     "diaVencimento" INTEGER DEFAULT 10,
ADD COLUMN     "gerouFinanceiro" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "qtdParcelas" INTEGER DEFAULT 1,
ADD COLUMN     "valorMensal" DECIMAL(10,2);

-- AlterTable
ALTER TABLE "lancamentos" ADD COLUMN     "contaCaixa" TEXT NOT NULL DEFAULT 'Caixa Geral',
ADD COLUMN     "contratoId" TEXT;

-- AlterTable
ALTER TABLE "pacientes" ADD COLUMN     "modeloCobranca" TEXT NOT NULL DEFAULT 'POR_CONSULTA',
ADD COLUMN     "valorConsulta" DECIMAL(10,2) DEFAULT 150.00;

-- CreateTable
CREATE TABLE "fechamentos_caixa" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "abertoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechadoEm" TIMESTAMP(3),
    "saldoInicial" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "totalDinheiro" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "totalPix" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "totalCartao" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "conferidoDinh" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "diferenca" DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    "justificativa" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ABERTO',

    CONSTRAINT "fechamentos_caixa_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "adiantamentos" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "data" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pago" BOOLEAN NOT NULL DEFAULT false,
    "referenciaMes" TEXT NOT NULL,
    "observacoes" TEXT,

    CONSTRAINT "adiantamentos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "fechamentos_caixa" ADD CONSTRAINT "fechamentos_caixa_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "adiantamentos" ADD CONSTRAINT "adiantamentos_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;
