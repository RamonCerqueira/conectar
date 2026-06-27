import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AgendaGateway } from '../websocket/agenda.gateway';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { AgendaQueryDto } from './dto/agenda-query.dto';
import { StatusAgendamento } from '@prisma/client';
import { addWeeks, startOfDay, endOfDay } from 'date-fns';

@Injectable()
export class AgendaService {
  constructor(
    private prisma: PrismaService,
    private gateway: AgendaGateway,
  ) {}

  async create(dto: CreateAgendamentoDto) {
    const { repetirSemanal, semanas, ...dados } = dto;

    // Verificar conflito de sala
    if (dados.salaId) {
      await this.verificarConflito(dados.salaId, dados.data, dados.dataFim);
    }

    // Verificar conflito de profissional
    await this.verificarConflitoProfissional(dados.profissionalId, dados.data, dados.dataFim);

    // Criar agendamento único ou recorrente
    if (repetirSemanal && semanas && semanas > 1) {
      return this.criarRecorrente(dados, semanas);
    }

    const agendamento = await this.prisma.agendamento.create({
      data: {
        ...dados,
        data: new Date(dados.data),
        dataFim: new Date(dados.dataFim),
      },
      include: this.includeRelacoes(),
    });

    // Emitir via WebSocket
    this.gateway.emitNovoAgendamento(agendamento);
    return agendamento;
  }

  async findAll(query: AgendaQueryDto) {
    const { inicio, fim, profissionalId, pacienteId, salaId, status } = query;

    return this.prisma.agendamento.findMany({
      where: {
        ...(inicio && fim && {
          data: {
            gte: new Date(inicio),
            lte: new Date(fim),
          },
        }),
        ...(profissionalId && { profissionalId }),
        ...(pacienteId && { pacienteId }),
        ...(salaId && { salaId }),
        ...(status && { status: status as StatusAgendamento }),
      },
      include: this.includeRelacoes(),
      orderBy: { data: 'asc' },
    });
  }

  async findOne(id: string) {
    const ag = await this.prisma.agendamento.findUnique({
      where: { id },
      include: this.includeRelacoes(),
    });
    if (!ag) throw new NotFoundException('Agendamento não encontrado');
    return ag;
  }

  async update(id: string, dto: UpdateAgendamentoDto) {
    await this.findOne(id);

    // Verificar conflitos se mudou horário
    if (dto.data && dto.dataFim) {
      if (dto.salaId) await this.verificarConflito(dto.salaId, dto.data, dto.dataFim, id);
      if (dto.profissionalId) {
        await this.verificarConflitoProfissional(dto.profissionalId, dto.data, dto.dataFim, id);
      }
    }

    const agendamento = await this.prisma.agendamento.update({
      where: { id },
      data: {
        ...dto,
        ...(dto.data && { data: new Date(dto.data) }),
        ...(dto.dataFim && { dataFim: new Date(dto.dataFim) }),
      },
      include: this.includeRelacoes(),
    });

    this.gateway.emitAgendamentoAtualizado(agendamento);
    return agendamento;
  }

  async updateStatus(id: string, status: string, justificativa?: string) {
    await this.findOne(id);

    const agendamento = await this.prisma.agendamento.update({
      where: { id },
      data: { status: status as StatusAgendamento },
      include: this.includeRelacoes(),
    });

    // Registrar frequência automaticamente
    if (['PRESENTE', 'FALTOU', 'FALTA_JUSTIFICADA', 'CANCELADO', 'REPOSICAO'].includes(status)) {
      await this.prisma.frequencia.upsert({
        where: { agendamentoId: id },
        update: { status: status as StatusAgendamento, justificativa },
        create: {
          agendamentoId: id,
          pacienteId: agendamento.pacienteId,
          status: status as StatusAgendamento,
          justificativa,
        },
      });
    }

    // Atualizar status da sala
    if (status === 'EM_ATENDIMENTO' && agendamento.salaId) {
      await this.prisma.sala.update({
        where: { id: agendamento.salaId },
        data: { status: 'OCUPADA' },
      });
      this.gateway.emitSalaAtualizada({ id: agendamento.salaId, status: 'OCUPADA' });
    } else if (['PRESENTE', 'CANCELADO', 'FALTOU'].includes(status) && agendamento.salaId) {
      await this.prisma.sala.update({
        where: { id: agendamento.salaId },
        data: { status: 'DISPONIVEL' },
      });
      this.gateway.emitSalaAtualizada({ id: agendamento.salaId, status: 'DISPONIVEL' });
    }

    this.gateway.emitAgendamentoAtualizado(agendamento);
    return agendamento;
  }

  async cancelar(id: string) {
    return this.updateStatus(id, 'CANCELADO');
  }

  async verificarDisponibilidade(query: { profissionalId: string; data: string; dataFim: string }) {
    const conflitos = await this.prisma.agendamento.findMany({
      where: {
        profissionalId: query.profissionalId,
        status: { notIn: ['CANCELADO', 'FALTOU'] },
        data: { lt: new Date(query.dataFim) },
        dataFim: { gt: new Date(query.data) },
      },
    });
    return { disponivel: conflitos.length === 0, conflitos };
  }

  // ─── Lista de Espera ──────────────────────────────────────────
  async getListaEspera() {
    return this.prisma.listaEspera.findMany({
      where: { notificado: false },
      orderBy: { criadoEm: 'asc' },
    });
  }

  async addListaEspera(data: any) {
    return this.prisma.listaEspera.create({ data });
  }

  // ─── Bloqueios ─────────────────────────────────────────────────
  async getBloqueios(profissionalId: string) {
    return this.prisma.bloqueioAgenda.findMany({
      where: { profissionalId },
      orderBy: { inicio: 'asc' },
    });
  }

  async createBloqueio(data: any) {
    return this.prisma.bloqueioAgenda.create({
      data: {
        ...data,
        inicio: new Date(data.inicio),
        fim: new Date(data.fim),
      },
    });
  }

  async removeBloqueio(id: string) {
    await this.prisma.bloqueioAgenda.delete({ where: { id } });
  }

  // ─── Privados ─────────────────────────────────────────────────
  private async verificarConflito(salaId: string, data: string, dataFim: string, excludeId?: string) {
    const conflito = await this.prisma.agendamento.findFirst({
      where: {
        salaId,
        status: { notIn: ['CANCELADO', 'FALTOU'] },
        data: { lt: new Date(dataFim) },
        dataFim: { gt: new Date(data) },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    if (conflito) throw new BadRequestException('Sala já ocupada neste horário');
  }

  private async verificarConflitoProfissional(
    profissionalId: string, data: string, dataFim: string, excludeId?: string,
  ) {
    const conflito = await this.prisma.agendamento.findFirst({
      where: {
        profissionalId,
        status: { notIn: ['CANCELADO', 'FALTOU'] },
        data: { lt: new Date(dataFim) },
        dataFim: { gt: new Date(data) },
        ...(excludeId && { id: { not: excludeId } }),
      },
    });
    if (conflito) throw new BadRequestException('Profissional já possui atendimento neste horário');
  }

  private async criarRecorrente(dados: any, semanas: number) {
    const grupoRepeticao = crypto.randomUUID();
    const agendamentos: any[] = [];

    for (let i = 0; i < semanas; i++) {
      const dataBase = new Date(dados.data);
      const dataFimBase = new Date(dados.dataFim);

      agendamentos.push(
        await this.prisma.agendamento.create({
          data: {
            ...dados,
            data: addWeeks(dataBase, i),
            dataFim: addWeeks(dataFimBase, i),
            repetirSemanal: true,
            grupoRepeticao,
          },
        }),
      );
    }

    this.gateway.emitNovoAgendamento({ grupo: grupoRepeticao, quantidade: semanas });
    return agendamentos;
  }

  private includeRelacoes() {
    return {
      paciente: { select: { id: true, nome: true, foto: true } },
      profissional: {
        include: {
          usuario: { select: { id: true, nome: true, foto: true } },
        },
      },
      sala: { select: { id: true, nome: true, cor: true } },
      frequencia: true,
    };
  }
}
