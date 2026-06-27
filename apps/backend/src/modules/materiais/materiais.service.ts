import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class MateriaisService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.material.findMany({
      where: { ativo: true },
    });
  }

  async create(data: any) {
    return this.prisma.material.create({ data });
  }

  async update(id: string, data: any) {
    return this.prisma.material.update({
      where: { id },
      data,
    });
  }

  async delete(id: string) {
    return this.prisma.material.update({
      where: { id },
      data: { ativo: false },
    });
  }
}
