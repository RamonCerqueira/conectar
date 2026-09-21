import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EscolarService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contatoEscolar.findMany({
      include: {
        paciente: {
          select: { id: true, nome: true, cpf: true, dataNascimento: true },
        },
        reunioes: {
          orderBy: { data: 'desc' },
        },
        relatorios: {
          orderBy: { criadoEm: 'desc' },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async findContatosByPaciente(pacienteId: string) {
    return this.prisma.contatoEscolar.findMany({
      where: { pacienteId },
      include: {
        paciente: {
          select: { id: true, nome: true },
        },
        reunioes: {
          orderBy: { data: 'desc' },
        },
        relatorios: {
          orderBy: { criadoEm: 'desc' },
        },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async createContato(data: any) {
    return this.prisma.contatoEscolar.create({
      data,
      include: {
        paciente: { select: { id: true, nome: true } },
        reunioes: true,
        relatorios: true,
      },
    });
  }

  async deleteContato(id: string) {
    // Excluir reuniões e relatórios vinculados antes
    await this.prisma.reuniaoEscolar.deleteMany({ where: { contatoId: id } });
    await this.prisma.relatorioEscolar.deleteMany({ where: { contatoId: id } });
    return this.prisma.contatoEscolar.delete({
      where: { id },
    });
  }

  async createReuniao(data: any) {
    return this.prisma.reuniaoEscolar.create({
      data: {
        ...data,
        data: data.data ? new Date(data.data) : new Date(),
      },
    });
  }

  async deleteReuniao(id: string) {
    return this.prisma.reuniaoEscolar.delete({
      where: { id },
    });
  }

  async createRelatorio(data: any) {
    return this.prisma.relatorioEscolar.create({ data });
  }

  async sendRelatorio(id: string) {
    return this.prisma.relatorioEscolar.update({
      where: { id },
      data: {
        enviado: true,
        enviadoEm: new Date(),
      },
    });
  }
}

