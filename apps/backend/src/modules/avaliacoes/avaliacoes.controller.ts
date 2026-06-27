import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { AvaliacoesService } from './avaliacoes.service';
@ApiTags('avaliacoes') @ApiBearerAuth() @Controller('avaliacoes')
export class AvaliacoesController {
  constructor(private readonly service: AvaliacoesService) {}
  @Get('tipos') findTipos() { return this.service.findTipos(); }
  @Post('tipos') createTipo(@Body() body: any) { return this.service.createTipo(body); }
  @Get('paciente/:id') findByPaciente(@Param('id') id: string) { return this.service.findByPaciente(id); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
}
