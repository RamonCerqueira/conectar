import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AgendaGateway } from '../websocket/agenda.gateway';
import { StatusSala } from '@prisma/client';

@Injectable()
export class SalasService {
  constructor(private prisma: PrismaService, private gateway: AgendaGateway) {}

  async findAll() {
    const salas = await this.prisma.sala.findMany({
      where: { ativa: true },
      include: {
        profissionais: {
          include: {
            profissional: { include: { usuario: { select: { nome: true } } } }
          }
        },
        alocacoes: {
          where: { ativo: true },
          include: {
            profissional: { include: { usuario: { select: { nome: true } } } }
          }
        },
      },
      orderBy: { nome: 'asc' },
    });

    // For each sala, also fetch today's appointments
    const hoje = new Date();
    const result = await Promise.all(
      salas.map(async (sala) => {
        const agendaHoje = await this.prisma.agendamento.findMany({
          where: {
            salaId: sala.id,
            data: {
              gte: new Date(new Date(hoje).setHours(0, 0, 0, 0)),
              lte: new Date(new Date(hoje).setHours(23, 59, 59, 999)),
            },
          },
          include: {
            paciente: { select: { nome: true } },
            profissional: { include: { usuario: { select: { nome: true } } } },
          },
          orderBy: { data: 'asc' },
        });

        return {
          ...sala,
          agendaHoje: agendaHoje.map((ag) => ({
            id: ag.id,
            horario: new Date(ag.data).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) +
              ' - ' + new Date(ag.dataFim).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
            paciente: ag.paciente.nome,
            profissional: ag.profissional.usuario.nome,
          })),
          // Map alocacoes to a clean shape for the frontend
          alocacoes: sala.alocacoes.map((a) => ({
            id: a.id,
            profissional: a.profissional.usuario.nome,
            profissionalId: a.profissionalId,
            diasSemana: a.diasSemana,
            horarioInicio: a.horarioInicio,
            horarioFim: a.horarioFim,
          })),
        };
      })
    );

    return result;
  }

  async findOne(id: string) {
    const sala = await this.prisma.sala.findUnique({
      where: { id },
      include: {
        profissionais: { include: { profissional: { include: { usuario: true } } } },
        alocacoes: {
          where: { ativo: true },
          include: { profissional: { include: { usuario: { select: { nome: true } } } } }
        },
      }
    });
    if (!sala) throw new NotFoundException('Sala não encontrada');
    return sala;
  }

  async create(data: any) {
    const { alocacoes, agendaHoje, ...salaData } = data;
    return this.prisma.sala.create({ data: salaData });
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const { alocacoes, agendaHoje, ...salaData } = data;
    const sala = await this.prisma.sala.update({ where: { id }, data: salaData });
    this.gateway.emitSalaAtualizada(sala);
    return sala;
  }

  async updateStatus(id: string, status: StatusSala) {
    const sala = await this.prisma.sala.update({ where: { id }, data: { status } });
    this.gateway.emitSalaAtualizada(sala);
    return sala;
  }

  async deleteSala(id: string) {
    await this.findOne(id);
    return this.prisma.sala.update({ where: { id }, data: { ativa: false } });
  }

  // ─── ALOCAÇÕES SEMANAIS ────────────────────────────────────────
  async addAlocacao(salaId: string, data: {
    profissionalId: string;
    diasSemana: string[];
    horarioInicio: string;
    horarioFim: string;
  }) {
    await this.findOne(salaId);
    const alocacao = await this.prisma.salaAlocacao.create({
      data: { salaId, ...data },
      include: { profissional: { include: { usuario: { select: { nome: true } } } } }
    });
    this.gateway.emitSalaAtualizada({ salaId });
    return alocacao;
  }

  async updateAlocacao(salaId: string, alocacaoId: string, data: {
    profissionalId?: string;
    diasSemana?: string[];
    horarioInicio?: string;
    horarioFim?: string;
  }) {
    const alocacao = await this.prisma.salaAlocacao.update({
      where: { id: alocacaoId },
      data,
      include: { profissional: { include: { usuario: { select: { nome: true } } } } }
    });
    this.gateway.emitSalaAtualizada({ salaId });
    return alocacao;
  }

  async deleteAlocacao(salaId: string, alocacaoId: string) {
    return this.prisma.salaAlocacao.update({
      where: { id: alocacaoId },
      data: { ativo: false },
    });
  }

  async getOcupacaoHoje(id: string) {
    const hoje = new Date();
    return this.prisma.agendamento.findMany({
      where: {
        salaId: id,
        data: {
          gte: new Date(new Date(hoje).setHours(0, 0, 0, 0)),
          lte: new Date(new Date(hoje).setHours(23, 59, 59, 999))
        }
      },
      include: {
        paciente: { select: { nome: true } },
        profissional: { include: { usuario: { select: { nome: true } } } }
      },
      orderBy: { data: 'asc' },
    });
  }
}
