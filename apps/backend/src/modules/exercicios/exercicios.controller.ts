import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ExerciciosService } from './exercicios.service';

@ApiTags('exercicios')
@ApiBearerAuth()
@Controller('exercicios')
export class ExerciciosController {
  constructor(private readonly exerciciosService: ExerciciosService) {}

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.exerciciosService.findByPaciente(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.exerciciosService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.exerciciosService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.exerciciosService.delete(id);
  }
}
