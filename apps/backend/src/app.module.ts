import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule } from '@nestjs/throttler';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';

import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { PacientesModule } from './modules/pacientes/pacientes.module';
import { ProfissionaisModule } from './modules/profissionais/profissionais.module';
import { SalasModule } from './modules/salas/salas.module';
import { AgendaModule } from './modules/agenda/agenda.module';
import { ProntuariosModule } from './modules/prontuarios/prontuarios.module';
import { AvaliacoesModule } from './modules/avaliacoes/avaliacoes.module';
import { PlanoTerapeuticoModule } from './modules/plano-terapeutico/plano-terapeutico.module';
import { FrequenciaModule } from './modules/frequencia/frequencia.module';
import { FinanceiroModule } from './modules/financeiro/financeiro.module';
import { ContratosModule } from './modules/contratos/contratos.module';
import { ArquivosModule } from './modules/arquivos/arquivos.module';
import { LaudosModule } from './modules/laudos/laudos.module';
import { RelatoriosModule } from './modules/relatorios/relatorios.module';
import { ComunicacaoModule } from './modules/comunicacao/comunicacao.module';
import { EscolarModule } from './modules/escolar/escolar.module';
import { ExerciciosModule } from './modules/exercicios/exercicios.module';
import { NotificacoesModule } from './modules/notificacoes/notificacoes.module';
import { AuditModule } from './modules/audit/audit.module';
import { IaModule } from './modules/ia/ia.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { MateriaisModule } from './modules/materiais/materiais.module';
import { WebsocketModule } from './modules/websocket/websocket.module';
import { PontoModule } from './modules/ponto/ponto.module';

@Module({
  imports: [
    // ─── Configuração ─────────────────────────────────────────
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env.local', '.env'],
    }),

    // ─── Rate Limiting ────────────────────────────────────────
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 20,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 100,
      },
    ]),

    // ─── Eventos ─────────────────────────────────────────────
    EventEmitterModule.forRoot(),

    // ─── Agendamentos Cron ────────────────────────────────────
    ScheduleModule.forRoot(),

    // ─── Filas BullMQ ─────────────────────────────────────────
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
      },
    }),

    // ─── Core ─────────────────────────────────────────────────
    PrismaModule,
    WebsocketModule,

    // ─── Módulos ──────────────────────────────────────────────
    AuthModule,
    UsuariosModule,
    DashboardModule,
    PacientesModule,
    ProfissionaisModule,
    SalasModule,
    AgendaModule,
    ProntuariosModule,
    AvaliacoesModule,
    PlanoTerapeuticoModule,
    FrequenciaModule,
    FinanceiroModule,
    ContratosModule,
    ArquivosModule,
    LaudosModule,
    RelatoriosModule,
    ComunicacaoModule,
    EscolarModule,
    ExerciciosModule,
    NotificacoesModule,
    AuditModule,
    IaModule,
    MateriaisModule,
    PontoModule,
  ],
})
export class AppModule {}
