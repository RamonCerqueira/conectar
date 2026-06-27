import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ArquivosService } from './arquivos.service';

@ApiTags('arquivos')
@ApiBearerAuth()
@Controller('arquivos')
export class ArquivosController {
  constructor(private readonly arquivosService: ArquivosService) {}

  @Get()
  findAll() {
    return this.arquivosService.findAll();
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.arquivosService.findByPaciente(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.arquivosService.create(data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.arquivosService.delete(id);
  }
}
