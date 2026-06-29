-- AlterTable
ALTER TABLE "exercicios_casa" ADD COLUMN     "observacaoResponsavel" TEXT;

-- AlterTable
ALTER TABLE "refresh_tokens" ADD COLUMN     "responsavelId" TEXT,
ALTER COLUMN "usuarioId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "refresh_tokens" ADD CONSTRAINT "refresh_tokens_responsavelId_fkey" FOREIGN KEY ("responsavelId") REFERENCES "responsaveis"("id") ON DELETE CASCADE ON UPDATE CASCADE;
