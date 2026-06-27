import { Controller, Get, Post, Put, Patch, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { SalasService } from './salas.service';

@ApiTags('salas')
@ApiBearerAuth()
@Controller('salas')
export class SalasController {
  constructor(private readonly service: SalasService) {}

  @Get() findAll() { return this.service.findAll(); }
  @Get(':id') findOne(@Param('id') id: string) { return this.service.findOne(id); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }
  @Delete(':id') remove(@Param('id') id: string) { return this.service.deleteSala(id); }
  @Patch(':id/status') updateStatus(@Param('id') id: string, @Body() body: any) { return this.service.updateStatus(id, body.status); }
  @Get(':id/ocupacao-hoje') getOcupacao(@Param('id') id: string) { return this.service.getOcupacaoHoje(id); }

  // ─── Alocações Semanais ───────────────────────────────────────
  @Post(':id/alocacoes')
  addAlocacao(@Param('id') salaId: string, @Body() body: any) {
    return this.service.addAlocacao(salaId, body);
  }

  @Put(':id/alocacoes/:alocId')
  updateAlocacao(
    @Param('id') salaId: string,
    @Param('alocId') alocId: string,
    @Body() body: any,
  ) {
    return this.service.updateAlocacao(salaId, alocId, body);
  }

  @Delete(':id/alocacoes/:alocId')
  deleteAlocacao(@Param('id') salaId: string, @Param('alocId') alocId: string) {
    return this.service.deleteAlocacao(salaId, alocId);
  }
}
