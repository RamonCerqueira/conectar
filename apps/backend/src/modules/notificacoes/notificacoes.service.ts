import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificacoesService {
  constructor(private prisma: PrismaService) {}

  async findByUsuario(usuarioId: string) {
    return this.prisma.notificacao.findMany({
      where: { usuarioId },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.notificacao.create({ data });
  }

  async markAsRead(id: string) {
    return this.prisma.notificacao.update({
      where: { id },
      data: { lida: true },
    });
  }

  async markAllAsRead(usuarioId: string) {
    return this.prisma.notificacao.updateMany({
      where: { usuarioId, lida: false },
      data: { lida: true },
    });
  }
}
