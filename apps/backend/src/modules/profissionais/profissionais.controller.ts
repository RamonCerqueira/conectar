import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { ProfissionaisService } from './profissionais.service';

@ApiTags('profissionais')
@ApiBearerAuth()
@Controller('profissionais')
export class ProfissionaisController {
  constructor(private readonly service: ProfissionaisService) {}

  @Get() async findAll(@CurrentUser() user: { perfil: string }) {
    const items = await this.service.findAll();
    return user.perfil === 'PAIS' ? items.map(p => ({ id: p.id, nome: p.nome, especialidade: p.especialidade, foto: p.foto, usuario: { nome: p.nome } })) : items;
  }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }

  @Get(':id/agenda')
  @ApiOperation({ summary: 'Agenda do profissional por período' })
  getAgenda(
    @Param('id') id: string,
    @Query('inicio') inicio: string,
    @Query('fim') fim: string,
  ) { return this.service.getAgenda(id, inicio, fim); }
}
