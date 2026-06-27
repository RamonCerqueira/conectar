import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { LaudosService } from './laudos.service';

@ApiTags('laudos')
@ApiBearerAuth()
@Controller('laudos')
export class LaudosController {
  constructor(private readonly laudosService: LaudosService) {}

  @Get()
  findAll() {
    return this.laudosService.findAll();
  }

  @Get('paciente/:id')
  findByPaciente(@Param('id') id: string) {
    return this.laudosService.findByPaciente(id);
  }

  @Post()
  create(@Body() data: any) {
    return this.laudosService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.laudosService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.laudosService.delete(id);
  }

  @Get('modelos')
  findAllModelos() {
    return this.laudosService.findAllModelos();
  }

  @Post('modelos')
  createModelo(@Body() data: any) {
    return this.laudosService.createModelo(data);
  }
}
