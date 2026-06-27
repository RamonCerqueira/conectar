import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ProntuariosService {
  constructor(private prisma: PrismaService) {}

  async findByPaciente(pacienteId: string) {
    return this.prisma.prontuario.findMany({
      where: { pacienteId },
      include: { profissional: { include: { usuario: { select: { nome: true, foto: true } } } } },
      orderBy: { data: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.prontuario.create({
      data,
      include: { profissional: { include: { usuario: true } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.prontuario.update({ where: { id }, data });
  }

  async findOne(id: string) {
    return this.prisma.prontuario.findUnique({
      where: { id },
      include: {
        paciente: true,
        profissional: { include: { usuario: true } },
        agendamento: true,
      },
    });
  }
}
