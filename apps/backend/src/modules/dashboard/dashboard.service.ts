import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { startOfDay, endOfDay, startOfMonth, endOfMonth, subMonths } from 'date-fns';

@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  async getDashboard() {
    const hoje = new Date();
    const inicioHoje = startOfDay(hoje);
    const fimHoje = endOfDay(hoje);
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);

    const [
      atendimentosHoje,
      faltasHoje,
      cancelamentosHoje,
      novoPacientesMes,
      totalPacientesAtivos,
      aguardandoAvaliacao,
      pagamentosPendentes,
      evolucaoFinanceira,
      ocupacaoProfissionais,
    ] = await Promise.all([
      // Atendimentos de hoje
      this.prisma.agendamento.count({
        where: {
          data: { gte: inicioHoje, lte: fimHoje },
          status: { in: ['CONFIRMADO', 'PRESENTE', 'EM_ATENDIMENTO', 'AGENDADO'] },
        },
      }),

      // Faltas hoje
      this.prisma.agendamento.count({
        where: {
          data: { gte: inicioHoje, lte: fimHoje },
          status: 'FALTOU',
        },
      }),

      // Cancelamentos hoje
      this.prisma.agendamento.count({
        where: {
          data: { gte: inicioHoje, lte: fimHoje },
          status: 'CANCELADO',
        },
      }),

      // Novos pacientes no mês
      this.prisma.paciente.count({
        where: {
          criadoEm: { gte: inicioMes, lte: fimMes },
        },
      }),

      // Total de pacientes ativos
      this.prisma.paciente.count({
        where: { status: 'ATIVO' },
      }),

      // Aguardando avaliação
      this.prisma.paciente.count({
        where: { status: 'LISTA_ESPERA' },
      }),

      // Pagamentos pendentes
      this.prisma.lancamento.aggregate({
        where: {
          tipo: 'RECEITA',
          status: { in: ['PENDENTE', 'ATRASADO'] },
        },
        _sum: { valor: true },
        _count: true,
      }),

      // Evolução financeira (6 meses)
      this.getEvolucaoFinanceira(),

      // Ocupação dos profissionais hoje
      this.getOcupacaoProfissionais(inicioHoje, fimHoje),
    ]);

    return {
      atendimentosHoje,
      faltasHoje,
      cancelamentosHoje,
      novoPacientesMes,
      totalPacientesAtivos,
      aguardandoAvaliacao,
      pagamentosPendentes: {
        total: pagamentosPendentes._sum.valor ? pagamentosPendentes._sum.valor.toNumber() : 0,
        quantidade: pagamentosPendentes._count,
      },
      evolucaoFinanceira,
      ocupacaoProfissionais,
    };
  }

  async getAgendamentosHoje() {
    const hoje = new Date();
    return this.prisma.agendamento.findMany({
      where: {
        data: { gte: startOfDay(hoje), lte: endOfDay(hoje) },
      },
      include: {
        paciente: { select: { id: true, nome: true, foto: true } },
        profissional: {
          include: { usuario: { select: { nome: true, foto: true } } },
        },
        sala: { select: { id: true, nome: true } },
        frequencia: true,
      },
      orderBy: { data: 'asc' },
    });
  }

  async getAlertas() {
    const hoje = new Date();
    const alertas: any[] = [];

    // Pagamentos atrasados
    const atrasados = await this.prisma.lancamento.count({
      where: { tipo: 'RECEITA', status: 'ATRASADO' },
    });
    if (atrasados > 0) {
      alertas.push({
        tipo: 'warning',
        mensagem: `${atrasados} pagamento(s) atrasado(s)`,
        url: '/financeiro?status=ATRASADO',
      });
    }

    // Pacientes com muitas faltas (3+)
    // Verificação simplificada — pode ser aprimorada com CTE SQL
    alertas.push({
      tipo: 'info',
      mensagem: 'Verificar pacientes com faltas consecutivas',
      url: '/frequencia',
    });

    return alertas;
  }

  async getAniversariantes() {
    const hoje = new Date();
    const mes = hoje.getMonth() + 1;
    const dia = hoje.getDate();

    // Aniversariantes do dia (comparação de mês e dia sem ano)
    return this.prisma.$queryRaw`
      SELECT id, nome, foto, "dataNascimento"
      FROM pacientes
      WHERE EXTRACT(MONTH FROM "dataNascimento") = ${mes}
        AND EXTRACT(DAY FROM "dataNascimento") = ${dia}
        AND ativo = true
      LIMIT 10
    `;
  }

  async getResumoFinanceiro() {
    const hoje = new Date();
    const inicioMes = startOfMonth(hoje);
    const fimMes = endOfMonth(hoje);

    const [receitas, despesas] = await Promise.all([
      this.prisma.lancamento.aggregate({
        where: {
          tipo: 'RECEITA',
          status: 'PAGO',
          pagamento: { gte: inicioMes, lte: fimMes },
        },
        _sum: { valor: true },
      }),
      this.prisma.lancamento.aggregate({
        where: {
          tipo: 'DESPESA',
          pagamento: { gte: inicioMes, lte: fimMes },
        },
        _sum: { valor: true },
      }),
    ]);

    const receitaTotal = receitas._sum.valor ? receitas._sum.valor.toNumber() : 0;
    const despesaTotal = despesas._sum.valor ? despesas._sum.valor.toNumber() : 0;

    return {
      receita: receitaTotal,
      despesa: despesaTotal,
      lucro: receitaTotal - despesaTotal,
      margem: receitaTotal > 0 ? ((receitaTotal - despesaTotal) / receitaTotal) * 100 : 0,
    };
  }

  private async getEvolucaoFinanceira() {
    const meses: Array<{ mes: string; receita: number; despesa: number }> = [];
    for (let i = 5; i >= 0; i--) {
      const data = subMonths(new Date(), i);
      const inicio = startOfMonth(data);
      const fim = endOfMonth(data);

      const [receitas, despesas] = await Promise.all([
        this.prisma.lancamento.aggregate({
          where: { tipo: 'RECEITA', status: 'PAGO', pagamento: { gte: inicio, lte: fim } },
          _sum: { valor: true },
        }),
        this.prisma.lancamento.aggregate({
          where: { tipo: 'DESPESA', pagamento: { gte: inicio, lte: fim } },
          _sum: { valor: true },
        }),
      ]);

      meses.push({
        mes: data.toLocaleString('pt-BR', { month: 'short' }),
        receita: receitas._sum.valor ? receitas._sum.valor.toNumber() : 0,
        despesa: despesas._sum.valor ? despesas._sum.valor.toNumber() : 0,
      });
    }
    return meses;
  }

  private async getOcupacaoProfissionais(inicio: Date, fim: Date) {
    const profissionais = await this.prisma.profissional.findMany({
      where: { ativo: true },
      include: {
        usuario: { select: { nome: true } },
        agendamentos: {
          where: { data: { gte: inicio, lte: fim } },
          select: { id: true, status: true },
        },
      },
    });

    return profissionais.map((prof) => ({
      id: prof.id,
      nome: prof.usuario.nome,
      especialidade: prof.tipo,
      totalHoje: prof.agendamentos.length,
      presentes: prof.agendamentos.filter((a) => a.status === 'PRESENTE').length,
    }));
  }
}
