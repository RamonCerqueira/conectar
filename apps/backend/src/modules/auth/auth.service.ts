import {
  Injectable,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async login(dto: LoginDto) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { email: dto.email },
      include: { profissional: true },
    });

    if (!usuario || !usuario.ativo) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const senhaValida = await bcrypt.compare(dto.password, usuario.senha);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Atualiza último login
    await this.prisma.usuario.update({
      where: { id: usuario.id },
      data: { ultimoLogin: new Date() },
    });

    const tokens = await this.generateTokens(usuario.id, usuario.email, usuario.perfil);

    return {
      ...tokens,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        perfil: usuario.perfil,
        foto: usuario.foto,
        profissionalId: usuario.profissional?.id,
      },
    };
  }

  async loginResponsavel(dto: LoginDto) {
    const responsavel = await this.prisma.responsavel.findFirst({
      where: { email: dto.email, ativoPortal: true },
      include: { paciente: true },
    });

    if (!responsavel || !responsavel.senhaPortal) {
      throw new UnauthorizedException('Credenciais de portal inválidas');
    }

    const senhaValida = await bcrypt.compare(dto.password, responsavel.senhaPortal);
    if (!senhaValida) {
      throw new UnauthorizedException('Credenciais de portal inválidas');
    }

    const tokens = await this.generateTokens(responsavel.id, responsavel.email!, 'PAIS');

    return {
      ...tokens,
      responsavel: {
        id: responsavel.id,
        nome: responsavel.nome,
        email: responsavel.email,
        perfil: 'PAIS',
        pacienteId: responsavel.pacienteId,
        pacienteNome: responsavel.paciente.nome,
      },
    };
  }

  async refreshTokens(token: string) {
    if (!token) {
      throw new UnauthorizedException('Refresh token não encontrado');
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token },
      include: { usuario: true },
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      throw new UnauthorizedException('Token expirado ou inválido');
    }

    // Rotação de refresh token (invalida o antigo)
    await this.prisma.refreshToken.delete({ where: { token } });

    return this.generateTokens(
      storedToken.usuario.id,
      storedToken.usuario.email,
      storedToken.usuario.perfil as any,
    );
  }

  async logout(token: string, usuarioId: string) {
    if (token) {
      await this.prisma.refreshToken
        .delete({ where: { token } })
        .catch(() => {}); // Ignora se já foi deletado
    }

    // Log de auditoria
    await this.prisma.auditLog.create({
      data: {
        usuarioId,
        acao: 'LOGOUT',
        recurso: 'auth',
      },
    });
  }

  async getProfile(usuarioId: string) {
    const usuario = await this.prisma.usuario.findUnique({
      where: { id: usuarioId },
      include: {
        profissional: {
          include: { salas: { include: { sala: true } } },
        },
      },
    });

    if (!usuario) throw new NotFoundException('Usuário não encontrado');

    const { senha, ...result } = usuario;
    return result;
  }

  private async generateTokens(
    usuarioId: string,
    email: string,
    perfil: string,
  ) {
    const payload = { sub: usuarioId, email, perfil };

    const [accessToken, refreshTokenRaw] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.get('JWT_SECRET'),
        expiresIn: this.config.get('JWT_EXPIRES_IN', '15m'),
      }),
      uuidv4(),
    ]);

    // Salva refresh token no banco
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenRaw,
        usuarioId,
        expiresAt,
      },
    });

    return { accessToken, refreshToken: refreshTokenRaw };
  }
}
