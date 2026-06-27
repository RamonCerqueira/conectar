import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PerfilUsuario } from '@prisma/client';
import { PERFIS_KEY } from '../decorators/perfis.decorator';

@Injectable()
export class PerfisGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const perfisRequeridos = this.reflector.getAllAndOverride<PerfilUsuario[]>(PERFIS_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!perfisRequeridos || perfisRequeridos.length === 0) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      throw new ForbiddenException('Acesso negado: Usuário não autenticado');
    }

    const temPerfil = perfisRequeridos.includes(user.perfil);
    if (!temPerfil) {
      throw new ForbiddenException('Acesso negado: Perfil insuficiente para esta operação');
    }

    return true;
  }
}
