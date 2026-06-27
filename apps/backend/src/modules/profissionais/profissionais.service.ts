import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class ProfissionaisService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    const profissionais = await this.prisma.profissional.findMany({
      where: { ativo: true },
      include: {
        usuario: { select: { id: true, nome: true, email: true, foto: true } },
        salas: { include: { sala: { select: { id: true, nome: true } } } },
      },
      orderBy: { usuario: { nome: 'asc' } },
    });

    // Map to a clean shape for the frontend
    return profissionais.map((p) => ({
      id: p.id,
      usuarioId: p.usuarioId,
      nome: p.usuario.nome,
      email: p.usuario.email,
      foto: p.usuario.foto,
      tipo: p.tipo,
      especialidade: p.especialidade,
      especialidades: p.especialidades,
      registro: p.registro,
      orgaoRegistro: p.orgaoRegistro,
      bio: p.bio,
      formacao: p.formacao,
      cor: p.cor,
      ativo: p.ativo,
      telefone: p.telefone,
      cep: p.cep,
      logradouro: p.logradouro,
      numero: p.numero,
      complemento: p.complemento,
      bairro: p.bairro,
      cidade: p.cidade,
      uf: p.uf,
      cpfCnpj: p.cpfCnpj,
      tipoContrato: p.tipoContrato,
      cargaHoraria: p.cargaHoraria,
      salarioBase: p.salarioBase ? Number(p.salarioBase) : null,
      comissaoPorcentagem: p.comissaoPorcentagem ? Number(p.comissaoPorcentagem) : null,
      chavePix: p.chavePix,
      horariosTrabalho: p.horariosTrabalho,
      salas: p.salas.map((s) => s.sala.nome),
    }));
  }

  async findOne(id: string) {
    const prof = await this.prisma.profissional.findUnique({
      where: { id },
      include: {
        usuario: { select: { id: true, nome: true, email: true, foto: true } },
        salas: { include: { sala: true } },
        bloqueios: { where: { fim: { gte: new Date() } }, orderBy: { inicio: 'asc' } },
      },
    });
    if (!prof) throw new NotFoundException('Profissional não encontrado');
    return prof;
  }

  // Create a new professional (creates Usuario + Profissional)
  async create(data: {
    nome: string;
    email: string;
    senha?: string;
    tipo: string;
    especialidade?: string;
    especialidades?: string[];
    registro?: string;
    orgaoRegistro?: string;
    bio?: string;
    formacao?: string;
    cor?: string;
    telefone?: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    uf?: string;
    cpfCnpj?: string;
    tipoContrato?: string;
    cargaHoraria?: string;
    salarioBase?: number;
    comissaoPorcentagem?: number;
    chavePix?: string;
    horariosTrabalho?: any;
  }) {
    // Check if email already exists
    const existing = await this.prisma.usuario.findUnique({ where: { email: data.email } });
    if (existing) throw new ConflictException('Email já cadastrado no sistema.');

    const { nome, email, senha = 'Conectar@2026', tipo, especialidade, especialidades,
      registro, orgaoRegistro, bio, formacao, cor, telefone, cep, logradouro, numero,
      complemento, bairro, cidade, uf, cpfCnpj, tipoContrato, cargaHoraria,
      salarioBase, comissaoPorcentagem, chavePix, horariosTrabalho } = data;

    // Create usuario + profissional in a transaction
    const result = await this.prisma.$transaction(async (tx) => {
      const hash = await bcrypt.hash(senha, 10);

      const usuario = await tx.usuario.create({
        data: {
          nome,
          email,
          senha: hash,
          perfil: 'PSICOLOGO', // Default, can be updated
        },
      });

      const profissional = await tx.profissional.create({
        data: {
          usuarioId: usuario.id,
          tipo: tipo as any,
          especialidade: especialidade || null,
          especialidades: especialidades || [],
          registro: registro || null,
          orgaoRegistro: orgaoRegistro || null,
          bio: bio || null,
          formacao: formacao || null,
          cor: cor || '#7c3aed',
          telefone: telefone || null,
          cep: cep || null,
          logradouro: logradouro || null,
          numero: numero || null,
          complemento: complemento || null,
          bairro: bairro || null,
          cidade: cidade || null,
          uf: uf || null,
          cpfCnpj: cpfCnpj || null,
          tipoContrato: tipoContrato || 'CLT',
          cargaHoraria: cargaHoraria || null,
          salarioBase: salarioBase ? salarioBase : null,
          comissaoPorcentagem: comissaoPorcentagem ? comissaoPorcentagem : null,
          chavePix: chavePix || null,
          horariosTrabalho: horariosTrabalho || null,
        },
        include: {
          usuario: { select: { id: true, nome: true, email: true } },
        },
      });

      return profissional;
    });

    return result;
  }

  async update(id: string, data: any) {
    await this.findOne(id);
    const { nome, email, foto, ...profData } = data;

    // Update usuario name/email if provided
    if (nome || email || foto) {
      const prof = await this.prisma.profissional.findUnique({ where: { id } });
      if (!prof) throw new NotFoundException('Profissional não encontrado');
      await this.prisma.usuario.update({
        where: { id: prof.usuarioId },
        data: { ...(nome ? { nome } : {}), ...(email ? { email } : {}), ...(foto ? { foto } : {}) },
      });
    }

    return this.prisma.profissional.update({ where: { id }, data: profData });
  }

  async getAgenda(id: string, inicio: string, fim: string) {
    return this.prisma.agendamento.findMany({
      where: {
        profissionalId: id,
        data: { gte: new Date(inicio), lte: new Date(fim) },
      },
      include: {
        paciente: { select: { id: true, nome: true, foto: true } },
        sala: true,
        frequencia: true,
      },
      orderBy: { data: 'asc' },
    });
  }
}
