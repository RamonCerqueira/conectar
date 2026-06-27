import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EscolarService {
  constructor(private prisma: PrismaService) {}

  async findContatosByPaciente(pacienteId: string) {
    return this.prisma.contatoEscolar.findMany({
      where: { pacienteId },
      include: {
        reunioes: true,
        relatorios: true,
      },
    });
  }

  async createContato(data: any) {
    return this.prisma.contatoEscolar.create({ data });
  }

  async createReuniao(data: any) {
    return this.prisma.reuniaoEscolar.create({ data });
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
