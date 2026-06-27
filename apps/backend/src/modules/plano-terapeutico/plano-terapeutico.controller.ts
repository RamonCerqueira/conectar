import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { PlanoTerapeuticoService } from './plano-terapeutico.service';
@ApiTags('plano-terapeutico') @ApiBearerAuth() @Controller('plano-terapeutico')
export class PlanoTerapeuticoController {
  constructor(private readonly service: PlanoTerapeuticoService) {}
  @Get('paciente/:id') findByPaciente(@Param('id') id: string) { return this.service.findByPaciente(id); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Post(':planoId/metas') addMeta(@Body() body: any) { return this.service.addMeta(body); }
  @Patch('metas/:id/progresso') updateMeta(@Param('id') id: string, @Body() body: { progresso: number; nota?: string }) { return this.service.updateMeta(id, body.progresso, body.nota); }
}
