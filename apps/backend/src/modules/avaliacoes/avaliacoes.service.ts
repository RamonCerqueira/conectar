import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class AvaliacoesService {
  constructor(private prisma: PrismaService) {}
  async findByPaciente(id: string) { return this.prisma.avaliacao.findMany({ where: { pacienteId: id }, include: { tipo: true, profissional: { include: { usuario: true } } }, orderBy: { data: 'desc' } }); }
  async create(data: any) { return this.prisma.avaliacao.create({ data }); }
  async findTipos() { return this.prisma.tipoAvaliacao.findMany({ where: { ativo: true } }); }
  async createTipo(data: any) { return this.prisma.tipoAvaliacao.create({ data }); }
}
