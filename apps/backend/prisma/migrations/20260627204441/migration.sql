-- CreateTable
CREATE TABLE "chatbot_passos" (
    "id" TEXT NOT NULL,
    "ordem" INTEGER NOT NULL,
    "pergunta" TEXT NOT NULL,
    "campoChave" TEXT NOT NULL,
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chatbot_passos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "triagem_leads" (
    "id" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "nomeCrianca" TEXT,
    "idade" TEXT,
    "queixa" TEXT,
    "periodo" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "criadoEm" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizadoEm" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "triagem_leads_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "chatbot_passos_ordem_key" ON "chatbot_passos"("ordem");
