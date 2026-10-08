import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from '../../../prisma/prisma.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService, private prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.get('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    if (payload.perfil === 'PAIS') {
      const parent = await this.prisma.responsavel.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, nome: true, ativoPortal: true } });
      if (!parent?.ativoPortal) throw new UnauthorizedException('Acesso ao portal desativado.');
      return { id: parent.id, email: parent.email, nome: parent.nome, perfil: 'PAIS' };
    }
    const user = await this.prisma.usuario.findUnique({ where: { id: payload.sub }, select: { id: true, email: true, nome: true, perfil: true, ativo: true } });
    if (!user?.ativo) throw new UnauthorizedException('Conta desativada.');
    return { id: user.id, email: user.email, nome: user.nome, perfil: user.perfil };
  }
}
