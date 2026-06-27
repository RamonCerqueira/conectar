import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ProntuariosService } from './prontuarios.service';
@ApiTags('prontuarios') @ApiBearerAuth() @Controller('prontuarios')
export class ProntuariosController {
  constructor(private readonly service: ProntuariosService) {}
  @Get('paciente/:id') findByPaciente(@Param('id') id: string) { return this.service.findByPaciente(id); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }
}
