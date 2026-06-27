import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { EscolarService } from './escolar.service';

@ApiTags('escolar')
@ApiBearerAuth()
@Controller('escolar')
export class EscolarController {
  constructor(private readonly escolarService: EscolarService) {}

  @Get('paciente/:id')
  findContatosByPaciente(@Param('id') id: string) {
    return this.escolarService.findContatosByPaciente(id);
  }

  @Post('contatos')
  createContato(@Body() data: any) {
    return this.escolarService.createContato(data);
  }

  @Post('reunioes')
  createReuniao(@Body() data: any) {
    return this.escolarService.createReuniao(data);
  }

  @Post('relatorios')
  createRelatorio(@Body() data: any) {
    return this.escolarService.createRelatorio(data);
  }

  @Put('relatorios/:id/enviar')
  sendRelatorio(@Param('id') id: string) {
    return this.escolarService.sendRelatorio(id);
  }
}
