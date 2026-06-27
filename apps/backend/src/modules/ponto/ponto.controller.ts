import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { PontoService } from './ponto.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('ponto')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ponto')
export class PontoController {
  constructor(private readonly service: PontoService) {}

  @Post('bater')
  @ApiOperation({ summary: 'Registrar entrada ou saída de ponto' })
  baterPonto(@CurrentUser() user: any) {
    return this.service.baterPonto(user.id);
  }

  @Get('me')
  @ApiOperation({ summary: 'Listar meus registros de ponto do mês atual' })
  getMe(@CurrentUser() user: any) {
    return this.service.getMe(user.id);
  }

  @Post('solicitar-ajuste')
  @ApiOperation({ summary: 'Solicitar ajuste/correção de ponto com justificativa' })
  solicitarAjuste(
    @CurrentUser() user: any,
    @Body() body: { dia: string; entradaSol?: string; saidaSol?: string; justificativa?: string },
  ) {
    return this.service.solicitarAjuste(
      user.id,
      body.dia,
      body.entradaSol,
      body.saidaSol,
      body.justificativa,
    );
  }

  // ─── ADMIN ENDPOINTS ──────────────────────────────────────────────────────

  @Get('admin/todos')
  @ApiOperation({ summary: 'Ver todos os pontos de funcionários (Admin)' })
  adminGetTodos(
    @CurrentUser() user: any,
    @Query('inicio') inicio?: string,
    @Query('fim') fim?: string,
  ) {
    this.checkAdmin(user);
    return this.service.adminGetTodos(inicio, fim);
  }

  @Get('admin/solicitacoes')
  @ApiOperation({ summary: 'Ver solicitações de ajuste pendentes (Admin)' })
  adminGetSolicitacoes(@CurrentUser() user: any) {
    this.checkAdmin(user);
    return this.service.adminGetSolicitacoes();
  }

  @Post('admin/avaliar-ajuste/:id')
  @ApiOperation({ summary: 'Aprovar ou rejeitar solicitação de ajuste (Admin)' })
  adminAvaliarAjuste(
    @CurrentUser() user: any,
    @Param('id') id: string,
    @Body() body: { aprovado: boolean },
  ) {
    this.checkAdmin(user);
    return this.service.adminAvaliarAjuste(id, body.aprovado);
  }

  @Put('admin/usuario/:userId/horarios')
  @ApiOperation({ summary: 'Atualizar horário de trabalho e custo de VT do funcionário (Admin)' })
  adminUpdateHorarios(
    @CurrentUser() user: any,
    @Param('userId') userId: string,
    @Body() body: { horariosTrabalho: any; custoValeTransporte?: number },
  ) {
    this.checkAdmin(user);
    return this.service.adminUpdateHorarios(userId, body.horariosTrabalho, body.custoValeTransporte);
  }

  @Get('admin/feriados')
  @ApiOperation({ summary: 'Listar feriados cadastrados' })
  adminGetFeriados(@CurrentUser() user: any) {
    this.checkAdmin(user);
    return this.service.getFeriados();
  }

  @Post('admin/feriados')
  @ApiOperation({ summary: 'Cadastrar novo feriado (Admin)' })
  adminCreateFeriado(
    @CurrentUser() user: any,
    @Body() body: { data: string; descricao: string },
  ) {
    this.checkAdmin(user);
    return this.service.createFeriado(body.data, body.descricao);
  }

  @Delete('admin/feriados/:id')
  @ApiOperation({ summary: 'Excluir feriado cadastrado (Admin)' })
  adminDeleteFeriado(@CurrentUser() user: any, @Param('id') id: string) {
    this.checkAdmin(user);
    return this.service.deleteFeriado(id);
  }

  @Post('admin/lancar-transporte')
  @ApiOperation({ summary: 'Autorizar e lançar vale-transporte de funcionários no financeiro (Admin)' })
  adminLancarTransporte(
    @CurrentUser() user: any,
    @Body() body: { mesReferencia: string; diasUteis: number; colaboradorIds: string[] },
  ) {
    this.checkAdmin(user);
    return this.service.adminLancarTransporte(body);
  }

  private checkAdmin(user: any) {
    const adminRoles = ['ADMINISTRADOR', 'DIRETOR'];
    if (!adminRoles.includes(user.perfil)) {
      throw new ForbiddenException('Acesso restrito para administradores.');
    }
  }
}
