import { Module } from '@nestjs/common';
import { PlanoTerapeuticoController } from './plano-terapeutico.controller';
import { PlanoTerapeuticoService } from './plano-terapeutico.service';
@Module({ controllers: [PlanoTerapeuticoController], providers: [PlanoTerapeuticoService], exports: [PlanoTerapeuticoService] })
export class PlanoTerapeuticoModule {}
