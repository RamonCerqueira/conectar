import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LaudosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.laudo.findMany({
      include: {
        paciente: true,
        modelo: true,
      },
    });
  }

  async findByPaciente(pacienteId: string) {
    return this.prisma.laudo.findMany({
      where: { pacienteId },
      include: { modelo: true },
    });
  }

  async create(data: any) {
    return this.prisma.laudo.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.laudo.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.laudo.delete({
      where: { id },
    });
  }

  // Modelos
  async findAllModelos() {
    return this.prisma.modeloLaudo.findMany({
      where: { ativo: true },
    });
  }

  async createModelo(data: any) {
    return this.prisma.modeloLaudo.create({ data });
  }
}
