import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ArquivosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.arquivo.findMany({
      include: { paciente: true },
    });
  }

  async findByPaciente(pacienteId: string) {
    return this.prisma.arquivo.findMany({
      where: { pacienteId },
    });
  }

  async create(data: any) {
    return this.prisma.arquivo.create({ data });
  }

  async delete(id: string) {
    return this.prisma.arquivo.delete({
      where: { id },
    });
  }
}
