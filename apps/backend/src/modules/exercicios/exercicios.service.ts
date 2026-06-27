import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ExerciciosService {
  constructor(private prisma: PrismaService) {}

  async findByPaciente(pacienteId: string) {
    return this.prisma.exercicioCasa.findMany({
      where: { pacienteId },
    });
  }

  async create(data: any) {
    return this.prisma.exercicioCasa.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.exercicioCasa.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.exercicioCasa.delete({
      where: { id },
    });
  }
}
