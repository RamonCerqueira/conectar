import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as fs from 'fs';
import { join } from 'path';

@Injectable()
export class PontoService {
  constructor(private prisma: PrismaService) {}

  private getStartOfDay(date: Date = new Date()): Date {
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    return start;
  }

  private saveBase64Selfie(base64Data: string, usuarioId: string): string {
    try {
      const dir = join(process.cwd(), 'storage/pontos');
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      const base64Image = base64Data.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Image, 'base64');
      const filename = `selfie-${usuarioId}-${Date.now()}.png`;
      const filepath = join(dir, filename);
      fs.writeFileSync(filepath, buffer);
      return `/storage/pontos/${filename}`;
    } catch (e) {
      console.error('Erro ao salvar selfie do ponto:', e);
      return '';
    }
  }

  async baterPonto(
    usuarioId: string,
    latitude?: number,
    longitude?: number,
    fotoAuditoriaBase64?: string,
  ) {
    const now = new Date();
    const startOfToday = this.getStartOfDay(now);
    let fotoUrl: string | null = null;
    if (fotoAuditoriaBase64) {
      fotoUrl = this.saveBase64Selfie(fotoAuditoriaBase64, usuarioId);
    }

    // Encontra ou cria o registro para o dia de hoje
    let registro = await this.prisma.registroPonto.findFirst({
      where: {
        usuarioId,
        data: startOfToday,
      },
    });

    if (!registro) {
      // Primeiro ponto do dia (Entrada)
      registro = await this.prisma.registroPonto.create({
        data: {
          usuarioId,
          data: startOfToday,
          entrada: now,
          status: 'NORMAL',
          latitude,
          longitude,
          fotoAuditoria: fotoUrl,
        },
      });
      return { message: 'Entrada registrada com sucesso!', registro };
    } else if (registro.entrada && !registro.saida) {
      // Segundo ponto do dia (Saída)
      registro = await this.prisma.registroPonto.update({
        where: { id: registro.id },
        data: {
          saida: now,
          latitude,
          longitude,
          fotoAuditoria: fotoUrl || registro.fotoAuditoria,
        },
      });
      return { message: 'Saída registrada com sucesso!', registro };
    } else {
      throw new ConflictException('Você já registrou a entrada e a saída hoje. Solicite um ajuste de ponto se necessário.');
    }
  }

  async getMe(usuarioId: string) {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    return this.prisma.registroPonto.findMany({
      where: {
        usuarioId,
        data: { gte: startOfMonth },
      },
      orderBy: { data: 'desc' },
    });
  }

  async solicitarAjuste(
    usuarioId: string,
    dia: string,
    entradaSol?: string,
    saidaSol?: string,
    justificativa?: string,
  ) {
    const targetDay = new Date(dia + 'T00:00:00');
    
    // Verifica se já existe um registro para o dia
    let registro = await this.prisma.registroPonto.findFirst({
      where: {
        usuarioId,
        data: targetDay,
      },
    });

    const dataUpdate: any = {
      status: 'SOLICITADO',
      justificativa,
      entradaSol: entradaSol ? new Date(entradaSol) : null,
      saidaSol: saidaSol ? new Date(saidaSol) : null,
    };

    if (!registro) {
      // Cria um registro com status de solicitação
      registro = await this.prisma.registroPonto.create({
        data: {
          usuarioId,
          data: targetDay,
          ...dataUpdate,
        },
      });
    } else {
      // Atualiza o registro existente para pendente de aprovação
      registro = await this.prisma.registroPonto.update({
        where: { id: registro.id },
        data: dataUpdate,
      });
    }

    return { message: 'Solicitação de ajuste enviada para análise do administrador.', registro };
  }

  // ─── ADMIN ENDPOINTS ──────────────────────────────────────────────────────

  async adminGetTodos(inicio?: string, fim?: string) {
    const whereClause: any = {};
    if (inicio && fim) {
      whereClause.data = {
        gte: new Date(inicio + 'T00:00:00'),
        lte: new Date(fim + 'T23:59:59'),
      };
    }

    return this.prisma.registroPonto.findMany({
      where: whereClause,
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true,
            tipoContrato: true,
            salarioBase: true,
            cargaHoraria: true,
            horariosTrabalho: true,
          },
        },
      },
      orderBy: [{ data: 'desc' }, { usuario: { nome: 'asc' } }],
    });
  }

  async adminGetSolicitacoes() {
    return this.prisma.registroPonto.findMany({
      where: { status: 'SOLICITADO' },
      include: {
        usuario: {
          select: {
            id: true,
            nome: true,
            email: true,
            perfil: true,
          },
        },
      },
      orderBy: { data: 'desc' },
    });
  }

  async adminAvaliarAjuste(id: string, aprovado: boolean) {
    const registro = await this.prisma.registroPonto.findUnique({
      where: { id },
    });

    if (!registro) throw new NotFoundException('Registro de ponto não encontrado');

    if (aprovado) {
      return this.prisma.registroPonto.update({
        where: { id },
        data: {
          status: 'APROVADO',
          entrada: registro.entradaSol || registro.entrada,
          saida: registro.saidaSol || registro.saida,
        },
      });
    } else {
      return this.prisma.registroPonto.update({
        where: { id },
        data: {
          status: 'REJEITADO',
        },
      });
    }
  }

  async adminUpdateHorarios(
    userId: string,
    horariosTrabalho: any,
    custoValeTransporte?: number,
  ) {
    return this.prisma.usuario.update({
      where: { id: userId },
      data: {
        horariosTrabalho,
        ...(custoValeTransporte !== undefined && { custoValeTransporte }),
      },
    });
  }

  // Feriados CRUD
  async getFeriados() {
    return this.prisma.feriado.findMany({
      orderBy: { data: 'asc' },
    });
  }

  async createFeriado(data: string, descricao: string) {
    const holidayDate = new Date(data + 'T00:00:00');
    
    const exists = await this.prisma.feriado.findUnique({
      where: { data: holidayDate },
    });
    if (exists) throw new ConflictException('Feriado já cadastrado nesta data');

    return this.prisma.feriado.create({
      data: {
        data: holidayDate,
        descricao,
      },
    });
  }

  async deleteFeriado(id: string) {
    return this.prisma.feriado.delete({
      where: { id },
    });
  }

  // Payout/Release transport fees directly to ledger expenses
  async adminLancarTransporte(data: {
    mesReferencia: string; // Ex: "06/2026"
    diasUteis: number;
    colaboradorIds: string[];
  }) {
    const { mesReferencia, diasUteis, colaboradorIds } = data;
    const launchedExpenses: any[] = [];

    for (const colabId of colaboradorIds) {
      const colab = await this.prisma.usuario.findUnique({
        where: { id: colabId },
      });

      if (colab && colab.tipoContrato === 'CLT') {
        const custoVTDiario = colab.custoValeTransporte ? Number(colab.custoValeTransporte) : 10;
        const totalPagar = custoVTDiario * diasUteis;

        if (totalPagar > 0) {
          const despesa = await this.prisma.lancamento.create({
            data: {
              tipo: 'DESPESA',
              descricao: `[Vale Transporte] Liberação Ref: ${mesReferencia} - ${colab.nome}`,
              valor: totalPagar,
              formaPagamento: 'TRANSFERENCIA',
              status: 'PENDENTE',
              vencimento: new Date(),
              observacoes: `Liberação de VT: ${diasUteis} dias úteis calculados a R$ ${custoVTDiario.toFixed(2)}/dia.`,
            },
          });
          launchedExpenses.push(despesa);
        }
      }
    }

    return {
      message: `${launchedExpenses.length} lançamentos de Vale-Transporte gerados com sucesso no financeiro.`,
      lançamentos: launchedExpenses,
    };
  }
}
