import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class PlanoTerapeuticoService {
  constructor(private prisma: PrismaService) {}
  async findByPaciente(id: string) { return this.prisma.planoTerapeutico.findMany({ where: { pacienteId: id, ativo: true }, include: { metas: { include: { historicoProgresso: { orderBy: { data: 'desc' }, take: 5 } } } } }); }
  async create(data: any) { return this.prisma.planoTerapeutico.create({ data }); }
  async updateMeta(id: string, progresso: number, nota?: string) {
    await this.prisma.historicoProgresso.create({ data: { metaId: id, progresso, nota } });
    return this.prisma.metaTerapeutica.update({ where: { id }, data: { progresso, status: progresso >= 100 ? 'CONCLUIDO' : 'EM_ANDAMENTO' } });
  }
  async addMeta(data: any) { return this.prisma.metaTerapeutica.create({ data }); }
}
