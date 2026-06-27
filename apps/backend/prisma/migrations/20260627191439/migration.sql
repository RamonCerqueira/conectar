/*
  Warnings:

  - You are about to drop the column `data` on the `adiantamentos` table. All the data in the column will be lost.
  - You are about to drop the column `observacoes` on the `adiantamentos` table. All the data in the column will be lost.
  - You are about to drop the column `pago` on the `adiantamentos` table. All the data in the column will be lost.
  - You are about to drop the column `referenciaMes` on the `adiantamentos` table. All the data in the column will be lost.
  - Added the required column `mesReferencia` to the `adiantamentos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "adiantamentos" DROP COLUMN "data",
DROP COLUMN "observacoes",
DROP COLUMN "pago",
DROP COLUMN "referenciaMes",
ADD COLUMN     "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "mesReferencia" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'PENDENTE';

-- AlterTable
ALTER TABLE "contratos" ADD COLUMN     "assinaturaUrl" TEXT;

-- AlterTable
ALTER TABLE "registros_ponto" ADD COLUMN     "fotoAuditoria" TEXT,
ADD COLUMN     "latitude" DOUBLE PRECISION,
ADD COLUMN     "longitude" DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "mensagem_fila" (
    "id" TEXT NOT NULL,
    "destinatario" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mensagem_fila_pkey" PRIMARY KEY ("id")
);
