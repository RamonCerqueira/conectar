import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FrequenciaService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.frequencia.findMany({
      include: {
        paciente: true,
        agendamento: {
          include: {
            profissional: {
              include: {
                usuario: {
                  select: { nome: true }
                }
              }
            }
          }
        },
      },
    });
  }

  async findByPaciente(pacienteId: string) {
    return this.prisma.frequencia.findMany({
      where: { pacienteId },
      include: {
        agendamento: {
          include: {
            profissional: {
              include: {
                usuario: {
                  select: { nome: true }
                }
              }
            }
          }
        }
      },
      orderBy: { criadoEm: 'desc' }
    });
  }

  async create(data: any) {
    return this.prisma.frequencia.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.frequencia.update({
      where: { id },
      data,
    });
  }
}
