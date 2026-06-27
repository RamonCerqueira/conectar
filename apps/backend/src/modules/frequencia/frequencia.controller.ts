import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FrequenciaService } from './frequencia.service';

@ApiTags('frequencia')
@ApiBearerAuth()
@Controller('frequencia')
export class FrequenciaController {
  constructor(private readonly frequenciaService: FrequenciaService) {}

  @Get()
  findAll() {
    return this.frequenciaService.findAll();
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.frequenciaService.findByPaciente(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.frequenciaService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.frequenciaService.update(id, data);
  }
}
