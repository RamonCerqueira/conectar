import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RelatoriosService {
  constructor(private prisma: PrismaService) {}

  async getPacientesReport() {
    const total = await this.prisma.paciente.count();
    const porStatus = await this.prisma.paciente.groupBy({
      by: ['status'],
      _count: { id: true },
    });
    const porSexo = await this.prisma.paciente.groupBy({
      by: ['sexo'],
      _count: { id: true },
    });

    return { total, porStatus, porSexo };
  }

  async getFinanceiroReport(de?: Date, ate?: Date) {
    const whereClause: any = {};
    if (de || ate) {
      whereClause.vencimento = {};
      if (de) whereClause.vencimento.gte = de;
      if (ate) whereClause.vencimento.lte = ate;
    }

    const lancamentos = await this.prisma.lancamento.findMany({
      where: whereClause,
    });

    const totalReceitas = lancamentos
      .filter((l) => l.tipo === 'RECEITA' && l.status === 'PAGO')
      .reduce((sum, l) => sum + Number(l.valor), 0);

    const totalDespesas = lancamentos
      .filter((l) => l.tipo === 'DESPESA' && l.status === 'PAGO')
      .reduce((sum, l) => sum + Number(l.valor), 0);

    const pendenteReceitas = lancamentos
      .filter((l) => l.tipo === 'RECEITA' && l.status === 'PENDENTE')
      .reduce((sum, l) => sum + Number(l.valor), 0);

    return {
      totalReceitas,
      totalDespesas,
      saldo: totalReceitas - totalDespesas,
      pendenteReceitas,
    };
  }

  async getAtendimentosReport(de?: Date, ate?: Date) {
    const whereClause: any = {};
    if (de || ate) {
      whereClause.data = {};
      if (de) whereClause.data.gte = de;
      if (ate) whereClause.data.lte = ate;
    }

    const agendamentos = await this.prisma.agendamento.findMany({
      where: whereClause,
    });

    const total = agendamentos.length;
    const porStatus = agendamentos.reduce((acc: any, curr) => {
      acc[curr.status] = (acc[curr.status] || 0) + 1;
      return acc;
    }, {});

    return { total, porStatus };
  }
}
