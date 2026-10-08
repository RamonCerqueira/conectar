import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
@Injectable()
export class AvaliacoesService {
  constructor(private prisma: PrismaService) {}
  async findByPaciente(id: string) { return this.prisma.avaliacao.findMany({ where: { pacienteId: id }, include: { tipo: true, profissional: { include: { usuario: { select: { nome: true, foto: true } } } } }, orderBy: { data: 'desc' } }); }
  async create(data: any, usuarioId: string) {
    const profissional = await this.prisma.profissional.findUnique({where:{usuarioId},select:{id:true}});
    if (!profissional) throw new BadRequestException('Vincule o usuário a um profissional para registrar uma avaliação.');
    if (!data.pacienteId || (!data.tipoId && !data.tipo?.trim())) throw new BadRequestException('Selecione o paciente e o tipo de avaliação.');
    return this.prisma.$transaction(async tx => {
      let tipoId = data.tipoId;
      if (!tipoId) {
        const nome = data.tipo.trim();
        const existing = await tx.tipoAvaliacao.findFirst({where:{nome,ativo:true}});
        const tipo = existing || await tx.tipoAvaliacao.create({data:{nome,campos:[]}});
        tipoId = tipo.id;
      }
      return tx.avaliacao.create({data:{pacienteId:data.pacienteId,profissionalId:profissional.id,tipoId,conclusao:data.conclusao,respostas:data.respostas || [],...(data.data ? {data:new Date(data.data)} : {})}, include:{tipo:true}});
    });
  }
  async findTipos() { return this.prisma.tipoAvaliacao.findMany({ where: { ativo: true } }); }
  async createTipo(data: any) { return this.prisma.tipoAvaliacao.create({ data }); }
}
