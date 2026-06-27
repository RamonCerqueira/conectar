-- AlterTable
ALTER TABLE "usuarios" ADD COLUMN     "cargaHoraria" TEXT,
ADD COLUMN     "chavePix" TEXT,
ADD COLUMN     "cpfCnpj" TEXT,
ADD COLUMN     "salarioBase" DECIMAL(10,2),
ADD COLUMN     "telefone" TEXT,
ADD COLUMN     "tipoContrato" TEXT DEFAULT 'CLT';
