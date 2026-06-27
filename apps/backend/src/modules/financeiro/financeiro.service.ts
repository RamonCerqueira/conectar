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
}
