import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContratosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.contrato.findMany({
      include: { paciente: true },
    });
  }

  async findByPaciente(pacienteId: string) {
    return this.prisma.contrato.findMany({
      where: { pacienteId },
    });
  }

  async create(data: any) {
    return this.prisma.contrato.create({ data });
  }

  async sign(id: string) {
    return this.prisma.contrato.update({
      where: { id },
      data: {
        assinado: true,
        assinadoEm: new Date(),
      },
    });
  }

  async delete(id: string) {
    return this.prisma.contrato.delete({
      where: { id },
    });
  }
}
