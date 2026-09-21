import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArquivosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.arquivo.findMany({
      include: {
        paciente: { select: { id: true, nome: true, cpf: true } },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async findByPaciente(pacienteId: string) {
    return this.prisma.arquivo.findMany({
      where: { pacienteId },
      include: {
        paciente: { select: { id: true, nome: true } },
      },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.arquivo.create({
      data,
      include: {
        paciente: { select: { id: true, nome: true } },
      },
    });
  }

  async delete(id: string) {
    return this.prisma.arquivo.delete({
      where: { id },
    });
  }
}

