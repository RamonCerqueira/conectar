import { Injectable, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class ProntuariosService {
  constructor(private prisma: PrismaService) {}

  async findByPaciente(pacienteId: string) {
    return this.prisma.prontuario.findMany({
      where: { pacienteId },
      include: {
        profissional: {
          include: { usuario: { select: { nome: true, foto: true } } },
        },
      },
      orderBy: { data: "desc" },
    });
  }

  async create(data: any, usuarioId: string) {
    const profissional = await this.prisma.profissional.findUnique({
      where: { usuarioId },
      select: { id: true },
    });
    if (!profissional)
      throw new BadRequestException(
        "O usuário precisa estar vinculado a um profissional para registrar uma evolução.",
      );
    const {
      pacienteId,
      agendamentoId,
      data: dataSessao,
      queixaPrincipal,
      objetivosSessao,
      atividadesRealizadas,
      resultados,
      comportamento,
      orientacoesPais,
      proximaMeta,
      observacoes,
      dadosExtra,
    } = data;
    if (!pacienteId) throw new BadRequestException("Selecione um paciente.");
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: pacienteId },
      select: { id: true },
    });
    if (!paciente) throw new BadRequestException("Paciente não encontrado.");
    if (dataSessao && !Number.isFinite(new Date(dataSessao).getTime())) throw new BadRequestException("Data da sessão inválida.");
    const values = {
      pacienteId,
      profissionalId: profissional.id,
      agendamentoId,
      queixaPrincipal,
      objetivosSessao,
      atividadesRealizadas,
      resultados,
      comportamento,
      orientacoesPais,
      proximaMeta,
      observacoes,
      dadosExtra,
      ...(dataSessao ? { data: new Date(dataSessao) } : {}),
    };
    return this.prisma.prontuario.create({
      data: values,
      include: { profissional: { include: { usuario: { select: { id: true, nome: true, foto: true } } } } },
    });
  }

  async update(id: string, data: any) {
    return this.prisma.prontuario.update({ where: { id }, data });
  }

  async findOne(id: string) {
    return this.prisma.prontuario.findUnique({
      where: { id },
      include: {
        paciente: true,
        profissional: { include: { usuario: { select: { id: true, nome: true, foto: true } } } },
        agendamento: true,
      },
    });
  }
}
