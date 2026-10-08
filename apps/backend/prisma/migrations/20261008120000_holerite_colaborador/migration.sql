ALTER TABLE "lancamentos" ADD COLUMN "colaboradorId" TEXT;
CREATE INDEX "lancamentos_colaboradorId_idx" ON "lancamentos"("colaboradorId");
ALTER TABLE "lancamentos" ADD CONSTRAINT "lancamentos_colaboradorId_fkey" FOREIGN KEY ("colaboradorId") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "mensagem_fila" ADD COLUMN "canal" TEXT NOT NULL DEFAULT 'WHATSAPP';
