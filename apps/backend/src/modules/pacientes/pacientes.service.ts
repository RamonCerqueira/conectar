import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePacienteDto } from './dto/create-paciente.dto';
import { UpdatePacienteDto } from './dto/update-paciente.dto';
import { ListarPacientesQueryDto } from './dto/listar-pacientes.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PacientesService {
  constructor(private prisma: PrismaService) {}

  async create(dto: CreatePacienteDto) {
    const { responsaveis, diagnosticos, ...dados } = dto;

    return this.prisma.paciente.create({
      data: {
        ...dados,
        dataNascimento: new Date(dados.dataNascimento),
        responsaveis: responsaveis
          ? { create: responsaveis }
          : undefined,
        diagnosticos: diagnosticos
          ? { create: diagnosticos }
          : undefined,
      },
      include: {
        responsaveis: true,
        diagnosticos: true,
      },
    });
  }

  async findAll(query: ListarPacientesQueryDto) {
    const {
      busca,
      status,
      page = 1,
      limit = 20,
      orderBy = 'nome',
    } = query;

    const skip = (page - 1) * limit;

    const where: Prisma.PacienteWhereInput = {
      ativo: true,
      ...(status && { status }),
      ...(busca && {
        OR: [
          { nome: { contains: busca, mode: 'insensitive' } },
          { cpf: { contains: busca } },
          { escola: { contains: busca, mode: 'insensitive' } },
          {
            responsaveis: {
              some: {
                OR: [
                  { nome: { contains: busca, mode: 'insensitive' } },
                  { telefone: { contains: busca } },
                ],
              },
            },
          },
        ],
      }),
    };

    const [pacientes, total] = await Promise.all([
      this.prisma.paciente.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [orderBy]: 'asc' },
        include: {
          responsaveis: {
            where: { isPrincipal: true },
            take: 1,
          },
          diagnosticos: true,
          _count: {
            select: { agendamentos: true, prontuarios: true },
          },
        },
      }),
      this.prisma.paciente.count({ where }),
    ]);

    return {
      data: pacientes,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id },
      include: {
        responsaveis: true,
        diagnosticos: true,
        planosTerapeuticos: {
          include: {
            metas: {
              include: { historicoProgresso: { orderBy: { data: 'desc' }, take: 5 } },
            },
          },
        },
        _count: {
          select: {
            agendamentos: true,
            prontuarios: true,
            arquivos: true,
            laudos: true,
          },
        },
      },
    });

    if (!paciente) {
      throw new NotFoundException(`Paciente ${id} não encontrado`);
    }

    return paciente;
  }

  async update(id: string, dto: UpdatePacienteDto) {
    await this.findOne(id);
    const { responsaveis, diagnosticos, ...dados } = dto;

    return this.prisma.paciente.update({
      where: { id },
      data: {
        ...dados,
        ...(dados.dataNascimento && {
          dataNascimento: new Date(dados.dataNascimento),
        }),
      },
      include: { responsaveis: true, diagnosticos: true },
    });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.paciente.update({
      where: { id },
      data: { ativo: false, status: 'INATIVO' },
    });
  }

  async updateFoto(id: string, caminho: string) {
    return this.prisma.paciente.update({
      where: { id },
      data: { foto: caminho },
    });
  }

  async getProntuarios(id: string) {
    return this.prisma.prontuario.findMany({
      where: { pacienteId: id },
      include: { profissional: { include: { usuario: true } } },
      orderBy: { data: 'desc' },
    });
  }

  async getAgendamentos(id: string) {
    return this.prisma.agendamento.findMany({
      where: { pacienteId: id },
      include: {
        profissional: { include: { usuario: true } },
        sala: true,
        frequencia: true,
      },
      orderBy: { data: 'desc' },
    });
  }

  async getEvolucao(id: string) {
    return this.prisma.evolucao.findMany({
      where: { pacienteId: id },
      orderBy: { data: 'asc' },
    });
  }

  async getFinanceiro(id: string) {
    return this.prisma.lancamento.findMany({
      where: { pacienteId: id },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async getTimeline(id: string) {
    const [prontuarios, avaliacoes, arquivos, laudos] = await Promise.all([
      this.prisma.prontuario.findMany({
        where: { pacienteId: id },
        orderBy: { data: 'desc' },
        take: 10,
        select: { id: true, data: true, observacoes: true, profissionalId: true },
      }),
      this.prisma.avaliacao.findMany({
        where: { pacienteId: id },
        orderBy: { data: 'desc' },
        take: 5,
        include: { tipo: true },
      }),
      this.prisma.arquivo.findMany({
        where: { pacienteId: id },
        orderBy: { criadoEm: 'desc' },
        take: 5,
      }),
      this.prisma.laudo.findMany({
        where: { pacienteId: id },
        orderBy: { criadoEm: 'desc' },
        take: 5,
        include: { modelo: true },
      }),
    ]);

    // Combinar e ordenar por data
    const timeline = [
      ...prontuarios.map(p => ({ tipo: 'prontuario', data: p.data, dados: p })),
      ...avaliacoes.map(a => ({ tipo: 'avaliacao', data: a.data, dados: a })),
      ...arquivos.map(a => ({ tipo: 'arquivo', data: a.criadoEm, dados: a })),
      ...laudos.map(l => ({ tipo: 'laudo', data: l.criadoEm, dados: l })),
    ].sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime());

    return timeline;
  }
}
