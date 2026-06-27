import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PerfilUsuario } from '@prisma/client';

@Injectable()
export class UsuariosService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.usuario.findMany({
      where: { ativo: true },
      select: {
        id: true, nome: true, email: true, perfil: true,
        foto: true, ultimoLogin: true, criadoEm: true,
        telefone: true, cpfCnpj: true, tipoContrato: true,
        salarioBase: true, cargaHoraria: true, chavePix: true,
        profissional: { select: { id: true, tipo: true, especialidade: true } },
      },
      orderBy: { nome: 'asc' },
    });
  }

  async findOne(id: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id },
      include: { profissional: true },
    });
    if (!usuario) throw new NotFoundException('Usuário não encontrado');
    const { senha, ...rest } = usuario;
    return rest;
  }

  async create(data: {
    nome: string; email: string; senha: string;
    perfil: PerfilUsuario; foto?: string;
    telefone?: string; cpfCnpj?: string; tipoContrato?: string;
    salarioBase?: number; cargaHoraria?: string; chavePix?: string;
  }) {
    const exists = await this.prisma.usuario.findUnique({ where: { email: data.email } });
    if (exists) throw new ConflictException('E-mail já cadastrado');

    const hash = await bcrypt.hash(data.senha, parseInt(process.env.BCRYPT_ROUNDS || '12'));
    const { senha, ...result } = await this.prisma.usuario.create({
      data: { ...data, senha: hash },
    });
    return result;
  }

  async update(id: string, data: Partial<{ 
    nome: string; foto: string; ativo: boolean;
    telefone: string; cpfCnpj: string; tipoContrato: string;
    salarioBase: number; cargaHoraria: string; chavePix: string;
  }>) {
    await this.findOne(id);
    return this.prisma.usuario.update({ where: { id }, data });
  }

  async changePassword(id: string, novaSenha: string) {
    const hash = await bcrypt.hash(novaSenha, parseInt(process.env.BCRYPT_ROUNDS || '12'));
    await this.prisma.usuario.update({ where: { id }, data: { senha: hash } });
    return { message: 'Senha alterada com sucesso' };
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.usuario.update({ where: { id }, data: { ativo: false } });
  }
}
