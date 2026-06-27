import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.auditLog.findMany({
      orderBy: { criadoEm: 'desc' },
      include: { usuario: true },
    });
  }

  async findByUsuario(usuarioId: string) {
    return this.prisma.auditLog.findMany({
      where: { usuarioId },
      orderBy: { criadoEm: 'desc' },
    });
  }

  async create(data: any) {
    return this.prisma.auditLog.create({ data });
  }
}
