import { PaymentDocumentsController } from './payment-documents.controller';
import { Module } from '@nestjs/common';
import { FinanceiroController } from './financeiro.controller';
import { FinanceiroService } from './financeiro.service';
@Module({ controllers: [PaymentDocumentsController, FinanceiroController], providers: [FinanceiroService], exports: [FinanceiroService] })
export class FinanceiroModule {}
