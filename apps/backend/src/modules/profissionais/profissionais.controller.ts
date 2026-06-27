import { Controller, Get, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ProfissionaisService } from './profissionais.service';

@ApiTags('profissionais')
@ApiBearerAuth()
@Controller('profissionais')
export class ProfissionaisController {
  constructor(private readonly service: ProfissionaisService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }

  @Get(':id/agenda')
  @ApiOperation({ summary: 'Agenda do profissional por período' })
  getAgenda(
    @Param('id') id: string,
    @Query('inicio') inicio: string,
    @Query('fim') fim: string,
  ) { return this.service.getAgenda(id, inicio, fim); }
}
