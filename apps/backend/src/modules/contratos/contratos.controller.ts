import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ContratosService } from './contratos.service';

@ApiTags('contratos')
@ApiBearerAuth()
@Controller('contratos')
export class ContratosController {
  constructor(private readonly contratosService: ContratosService) {}

  @Get()
  findAll() {
    return this.contratosService.findAll();
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.contratosService.findByPaciente(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.contratosService.create(data);
  }

  @Put(':id/assinar')
  sign(@Param('id') id: string) {
    return this.contratosService.sign(id);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.contratosService.delete(id);
  }
}
