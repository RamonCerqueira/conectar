import {
  Controller, Get, Post, Put, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AgendaService } from './agenda.service';
import { CreateAgendamentoDto } from './dto/create-agendamento.dto';
import { UpdateAgendamentoDto } from './dto/update-agendamento.dto';
import { AgendaQueryDto } from './dto/agenda-query.dto';

@ApiTags('agenda')
@ApiBearerAuth()
@Controller('agenda')
export class AgendaController {
  constructor(private readonly agendaService: AgendaService) {}

  @Post()
  @ApiOperation({ summary: 'Criar novo agendamento' })
  create(@Body() dto: CreateAgendamentoDto) {
    return this.agendaService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar agendamentos por período/profissional/paciente' })
  findAll(@Query() query: AgendaQueryDto) {
    return this.agendaService.findAll(query);
  }

  @Get('disponibilidade')
  @ApiOperation({ summary: 'Verificar disponibilidade de horário' })
  verificarDisponibilidade(@Query() query: any) {
    return this.agendaService.verificarDisponibilidade(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar agendamento por ID' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.agendaService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar agendamento (remarcar)' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAgendamentoDto,
  ) {
    return this.agendaService.update(id, dto);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Atualizar status do agendamento (confirmar/cancelar/presente)' })
  updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { status: string; justificativa?: string },
  ) {
    return this.agendaService.updateStatus(id, body.status, body.justificativa);
  }

  @Post('checkin-qrcode')
  @ApiOperation({ summary: 'Check-in de paciente por leitura de QR Code do Totem' })
  checkinQrCode(
    @Body() body: { pacienteId: string; token: string },
  ) {
    return this.agendaService.checkinQrCode(body.pacienteId, body.token);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Cancelar agendamento' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.agendaService.cancelar(id);
  }

  // ─── Lista de Espera ──────────────────────────────────────────
  @Get('lista-espera')
  @ApiOperation({ summary: 'Listar fila de espera' })
  getListaEspera() {
    return this.agendaService.getListaEspera();
  }

  @Post('lista-espera')
  @ApiOperation({ summary: 'Adicionar à lista de espera' })
  addListaEspera(@Body() body: any) {
    return this.agendaService.addListaEspera(body);
  }

  // ─── Bloqueios ─────────────────────────────────────────────────
  @Get('bloqueios/:profissionalId')
  @ApiOperation({ summary: 'Listar bloqueios de um profissional' })
  getBloqueios(@Param('profissionalId', ParseUUIDPipe) profissionalId: string) {
    return this.agendaService.getBloqueios(profissionalId);
  }

  @Post('bloqueios')
  @ApiOperation({ summary: 'Criar bloqueio na agenda (férias, almoço, etc.)' })
  createBloqueio(@Body() body: any) {
    return this.agendaService.createBloqueio(body);
  }

  @Delete('bloqueios/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover bloqueio' })
  removeBloqueio(@Param('id', ParseUUIDPipe) id: string) {
    return this.agendaService.removeBloqueio(id);
  }
}
