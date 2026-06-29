import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FinanceiroService {
  constructor(private prisma: PrismaService) {}

  async findAll(query: any) {
    const { tipo, status, inicio, fim, pacienteId } = query;
    return this.prisma.lancamento.findMany({
      where: {
        ...(tipo && { tipo }),
        ...(status && { status }),
        ...(pacienteId && { pacienteId }),
        ...(inicio && fim && { vencimento: { gte: new Date(inicio), lte: new Date(fim) } }),
      },
      include: { paciente: { select: { id: true, nome: true } } },
      orderBy: { vencimento: 'desc' },
    });
  }

  async create(data: any) { return this.prisma.lancamento.create({ data }); }

  async update(id: string, data: any) { return this.prisma.lancamento.update({ where: { id }, data }); }

  async getResumoMes(mes: string) {
    const [ano, m] = mes.split('-').map(Number);
    const inicio = new Date(ano, m - 1, 1);
    const fim = new Date(ano, m, 0, 23, 59, 59);
    const [receitas, despesas] = await Promise.all([
      this.prisma.lancamento.aggregate({ where: { tipo: 'RECEITA', status: 'PAGO', pagamento: { gte: inicio, lte: fim } }, _sum: { valor: true }, _count: true }),
      this.prisma.lancamento.aggregate({ where: { tipo: 'DESPESA', pagamento: { gte: inicio, lte: fim } }, _sum: { valor: true }, _count: true }),
    ]);
    return {
      receita: { total: receitas._sum.valor ? receitas._sum.valor.toNumber() : 0, quantidade: receitas._count },
      despesa: { total: despesas._sum.valor ? despesas._sum.valor.toNumber() : 0, quantidade: despesas._count },
      lucro: (receitas._sum.valor ? receitas._sum.valor.toNumber() : 0) - (despesas._sum.valor ? despesas._sum.valor.toNumber() : 0),
    };
  }

  async getInadimplentes() {
    return this.prisma.lancamento.findMany({
      where: { tipo: 'RECEITA', status: { in: ['PENDENTE', 'ATRASADO'] }, vencimento: { lt: new Date() } },
      include: { paciente: { select: { id: true, nome: true } } },
      orderBy: { vencimento: 'asc' },
    });
  }

  async findMyContracheques(userName: string) {
    return this.prisma.lancamento.findMany({
      where: {
        tipo: 'DESPESA',
        descricao: { contains: userName },
      },
      orderBy: { vencimento: 'desc' },
    });
  }

  // ─── FECHAMENTO DE CAIXA ──────────────────────────────────────────────────

  async getCaixaStatus(usuarioId: string) {
    const caixa = await this.prisma.fechamentoCaixa.findFirst({
      where: { usuarioId, status: 'ABERTO' },
    });

    if (!caixa) return { status: 'FECHADO' };

    // Calcular valores registrados no sistema desde a abertura do caixa
    const lancamentos = await this.prisma.lancamento.findMany({
      where: {
        status: 'PAGO',
        pagamento: { gte: caixa.abertoEm },
      },
    });

    let totalDinheiro = 0;
    let totalPix = 0;
    let totalCartao = 0;

    lancamentos.forEach((l) => {
      const val = Number(l.valor);
      if (l.formaPagamento === 'DINHEIRO') {
        totalDinheiro += val;
      } else if (l.formaPagamento === 'PIX') {
        totalPix += val;
      } else if (['CARTAO_CREDITO', 'CARTAO_DEBITO'].includes(l.formaPagamento || '')) {
        totalCartao += val;
      }
    });

    return {
      status: 'ABERTO',
      caixa,
      totalDinheiro,
      totalPix,
      totalCartao,
    };
  }

  async abrirCaixa(usuarioId: string, saldoInicial: number) {
    const open = await this.prisma.fechamentoCaixa.findFirst({
      where: { usuarioId, status: 'ABERTO' },
    });
    if (open) return open;

    return this.prisma.fechamentoCaixa.create({
      data: {
        usuarioId,
        saldoInicial,
        status: 'ABERTO',
      },
    });
  }

  async fecharCaixa(usuarioId: string, conferidoDinh: number, justificativa?: string) {
    const status = await this.getCaixaStatus(usuarioId);
    if (status.status !== 'ABERTO' || !status.caixa) {
      throw new Error('Não há caixa aberto para este operador.');
    }

    const expectedDinh = status.totalDinheiro;
    const diff = conferidoDinh - expectedDinh;

    return this.prisma.fechamentoCaixa.update({
      where: { id: status.caixa.id },
      data: {
        totalDinheiro: expectedDinh,
        totalPix: status.totalPix,
        totalCartao: status.totalCartao,
        conferidoDinh,
        diferenca: diff,
        justificativa,
        status: 'FECHADO',
        fechadoEm: new Date(),
      },
    });
  }

  async getHistoricoCaixas() {
    return this.prisma.fechamentoCaixa.findMany({
      include: {
        usuario: { select: { id: true, nome: true, email: true } },
      },
      orderBy: { abertoEm: 'desc' },
    });
  }

  async aprovarCaixa(id: string) {
    return this.prisma.fechamentoCaixa.update({
      where: { id },
      data: { status: 'APROVADO' },
    });
  }

  // ─── ADIANTAMENTOS (VALES) ────────────────────────────────────────────────

  async getAdiantamentos(query: any) {
    const { refMes } = query;
    return this.prisma.adiantamento.findMany({
      where: {
        ...(refMes && { mesReferencia: refMes }),
      },
      include: {
        usuario: { select: { id: true, nome: true, email: true } },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async createAdiantamento(data: { usuarioId: string; valor: number; referenciaMes: string; observacoes?: string }) {
    return this.prisma.adiantamento.create({
      data: {
        usuarioId: data.usuarioId,
        valor: data.valor,
        mesReferencia: data.referenciaMes,
        status: 'PENDENTE',
      },
    });
  }

  async deleteAdiantamento(id: string) {
    return this.prisma.adiantamento.delete({
      where: { id },
    });
  }

  // ─── REPASSES / COMISSÕES DE TERAPEUTAS ──────────────────────────────────

  async getRepassesTerapeutas(mes: string) {
    // Pegar o início e fim do mês informado (Ex: "2026-06")
    const [year, month] = mes.split('-').map(Number);
    const start = new Date(year, month - 1, 1);
    const end = new Date(year, month, 0, 23, 59, 59);

    // Buscar agendamentos concluídos (PRESENTE) no mês
    const agendamentos = await this.prisma.agendamento.findMany({
      where: {
        status: 'PRESENTE',
        data: { gte: start, lte: end },
      },
      include: {
        profissional: {
          include: {
            usuario: { select: { nome: true } },
          },
        },
        paciente: {
          select: { id: true, nome: true, valorConsulta: true },
        },
      },
    });

    // Agrupar e calcular repasses
    const repasses: Record<string, {
      profId: string;
      nome: string;
      sessoesAtendidas: number;
      valorFaturado: number;
      comissaoTotal: number;
      chavePix?: string | null;
      jaLancado: boolean;
    }> = {};

    for (const ag of agendamentos) {
      if (!ag.profissional) continue;

      const profId = ag.profissionalId;
      const pct = ag.profissional.comissaoPorcentagem ? Number(ag.profissional.comissaoPorcentagem) : 0;
      const valorSessao = ag.paciente?.valorConsulta ? Number(ag.paciente.valorConsulta) : 150;

      const comissaoSessao = (valorSessao * pct) / 100;

      if (!repasses[profId]) {
        // Verificar se já existe despesa registrada para o repasse deste profissional no mês
        const exists = await this.prisma.lancamento.findFirst({
          where: {
            tipo: 'DESPESA',
            descricao: { contains: `[Repasse PJ] ${ag.profissional.usuario.nome}` },
            referencia: mes,
          },
        });

        repasses[profId] = {
          profId,
          nome: ag.profissional.usuario.nome,
          sessoesAtendidas: 0,
          valorFaturado: 0,
          comissaoTotal: 0,
          chavePix: ag.profissional.chavePix,
          jaLancado: !!exists,
        };
      }

      repasses[profId].sessoesAtendidas += 1;
      repasses[profId].valorFaturado += valorSessao;
      repasses[profId].comissaoTotal += comissaoSessao;
    }

    return Object.values(repasses);
  }

  async lancarRepasse(data: { profId: string; nome: string; comissaoTotal: number; mesReferencia: string }) {
    const { profId, nome, comissaoTotal, mesReferencia } = data;

    // Criar despesa de repasse no caixa
    return this.prisma.lancamento.create({
      data: {
        tipo: 'DESPESA',
        descricao: `[Repasse PJ] ${nome} Ref: ${mesReferencia}`,
        valor: comissaoTotal,
        formaPagamento: 'TRANSFERENCIA',
        status: 'PENDENTE',
        vencimento: new Date(),
        referencia: mesReferencia,
        observacoes: `Comissão mensal de repasses gerada automaticamente baseada nas consultas concluídas no mês ${mesReferencia}.`,
        contaCaixa: 'Caixa Geral',
      },
    });
  }

  async getPrevisaoDRE() {
    const today = new Date();
    const result: any[] = [];

    // Calculate baseline from active contracts
    const activeContracts = await this.prisma.contrato.findMany({
      where: { assinado: true },
    });
    const monthlyContractRevenue = activeContracts.reduce((acc, c) => acc + (c.valorMensal ? Number(c.valorMensal) : 0), 0);

    // Calculate baseline from staff salaries
    const activeStaff = await this.prisma.usuario.findMany({
      where: { ativo: true },
    });
    const monthlyStaffCost = activeStaff.reduce((acc, u) => acc + (u.salarioBase ? Number(u.salarioBase) : 0), 0);

    for (let i = 0; i < 12; i++) {
      const date = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const refMes = `${year}-${month}`;

      // Get lancamentos for this month
      const lancamentos = await this.prisma.lancamento.findMany({
        where: { referencia: refMes },
      });

      let receitas = lancamentos
        .filter((l) => l.tipo === 'RECEITA')
        .reduce((sum, l) => sum + Number(l.valor), 0);

      let despesas = lancamentos
        .filter((l) => l.tipo === 'DESPESA')
        .reduce((sum, l) => sum + Number(l.valor), 0);

      // Fallback to baseline if no lancamentos exist for this month
      if (receitas === 0) {
        receitas = monthlyContractRevenue || 12000; // sensible mock fallback
      }
      if (despesas === 0) {
        despesas = monthlyStaffCost || 8500; // sensible mock fallback
      }

      result.push({
        mes: refMes,
        mesFormatado: date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' }),
        receitas,
        despesas,
        saldo: receitas - despesas,
      });
    }

    return result;
  }
}
