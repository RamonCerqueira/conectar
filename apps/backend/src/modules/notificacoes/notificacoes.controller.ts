import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Controller, Get, Post, Put, Body, Param, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificacoesService } from './notificacoes.service';

@ApiTags('notificacoes')
@ApiBearerAuth()
@Controller('notificacoes')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Get('usuario/:usuarioId')
  findByUsuario(@Param('usuarioId') usuarioId: string, @CurrentUser() user:any) {
    if(usuarioId!==user.id)throw new ForbiddenException();
    return this.notificacoesService.findByUsuario(usuarioId);
  }

  @Post()
  create(@Body() data: any,@CurrentUser() user:any) {
    if(!['ADMINISTRADOR','DIRETOR','COORDENADOR','RECEPCAO'].includes(user.perfil))throw new ForbiddenException();
    return this.notificacoesService.create(data);
  }

  @Put(':id/lida')
  markAsRead(@Param('id') id: string,@CurrentUser() user:any) {
    return this.notificacoesService.markAsRead(id,user.id);
  }

  @Put('usuario/:usuarioId/ler-tudo')
  markAllAsRead(@Param('usuarioId') usuarioId: string,@CurrentUser() user:any) {
    if(usuarioId!==user.id)throw new ForbiddenException();
    return this.notificacoesService.markAllAsRead(usuarioId);
  }
}
