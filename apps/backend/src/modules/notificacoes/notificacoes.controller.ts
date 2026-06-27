import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { NotificacoesService } from './notificacoes.service';

@ApiTags('notificacoes')
@ApiBearerAuth()
@Controller('notificacoes')
export class NotificacoesController {
  constructor(private readonly notificacoesService: NotificacoesService) {}

  @Get('usuario/:usuarioId')
  findByUsuario(@Param('usuarioId') usuarioId: string) {
    return this.notificacoesService.findByUsuario(usuarioId);
  }

  @Post()
  create(@Body() data: any) {
    return this.notificacoesService.create(data);
  }

  @Put(':id/lida')
  markAsRead(@Param('id') id: string) {
    return this.notificacoesService.markAsRead(id);
  }

  @Put('usuario/:usuarioId/ler-tudo')
  markAllAsRead(@Param('usuarioId') usuarioId: string) {
    return this.notificacoesService.markAllAsRead(usuarioId);
  }
}
