import { Injectable, ExecutionContext, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector, private prisma: PrismaService) {
    super();
  }

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;
    const allowed = await super.canActivate(context);
    const req = context.switchToHttp().getRequest();
    if (req.user?.perfil !== 'PAIS') {
      const path = (req.path as string).replace(/^\/api/, '').replace(/\/$/, '');
      if (path.startsWith('/usuarios') && !['ADMINISTRADOR', 'DIRETOR'].includes(req.user.perfil)) {
        const own = path === `/usuarios/${req.user.id}`;
        const ownPassword = path === `/usuarios/${req.user.id}/senha`;
        if (own && req.method === 'GET') return true;
        if (own && req.method === 'PUT' && Object.keys(req.body || {}).every(key => ['nome', 'foto'].includes(key))) return true;
        if (ownPassword && req.method === 'PUT') return true;
        throw new ForbiddenException('Somente a administração pode gerenciar outras contas.');
      }
      return Boolean(allowed);
    }
    const parent = await this.prisma.responsavel.findUnique({ where: { id: req.user.id }, select: { pacienteId: true, ativoPortal: true } });
    if (!parent?.ativoPortal) throw new ForbiddenException('Acesso ao portal desativado.');
    const path = (req.path as string).replace(/^\/api/, '').replace(/\/$/, '');
    if (path === '/auth/logout') return true;
    if (req.method === 'GET') {
      if (path === '/profissionais') return true;
      const patientRoute = path.match(/^\/pacientes\/([^/]+)(?:\/(agendamentos|financeiro|evolucao))?$/);
      const clinicalRoute = path.match(/^\/(prontuarios|exercicios|arquivos|plano-terapeutico)\/paciente\/([^/]+)$/);
      const requested = patientRoute?.[1] || clinicalRoute?.[2];
      if (requested === parent.pacienteId) return true;
    }
    if (req.method === 'POST' && path === '/agenda' && req.body?.pacienteId === parent.pacienteId) return true;
    const confirmation = path.match(/^\/agenda\/([^/]+)\/status$/);
    if (req.method === 'PATCH' && confirmation && req.body?.status === 'CONFIRMADO' && Object.keys(req.body).length === 1) {
      const item = await this.prisma.agendamento.findUnique({ where: { id: confirmation[1] }, select: { pacienteId: true, status: true } });
      if (item?.pacienteId === parent.pacienteId && ['AGENDADO', 'CONFIRMADO'].includes(item.status)) return true;
    }
    const exercise = path.match(/^\/exercicios\/([^/]+)$/);
    if (req.method === 'PUT' && exercise) {
      const item = await this.prisma.exercicioCasa.findUnique({ where: { id: exercise[1] }, select: { pacienteId: true } });
      if (item?.pacienteId === parent.pacienteId && Object.keys(req.body || {}).every(key => ['realizado', 'observacaoResponsavel'].includes(key)) && typeof req.body.realizado === 'boolean' && (req.body.observacaoResponsavel === undefined || typeof req.body.observacaoResponsavel === 'string')) return true;
    }
    throw new ForbiddenException('Este acesso é restrito aos dados da sua criança.');
  }

  handleRequest(err: any, user: any) {
    if (err || !user) {
      throw err || new UnauthorizedException('Acesso não autorizado');
    }
    return user;
  }
}
