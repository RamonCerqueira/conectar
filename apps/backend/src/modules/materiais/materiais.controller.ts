import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { MateriaisService } from './materiais.service';

@ApiTags('materiais')
@ApiBearerAuth()
@Controller('materiais')
export class MateriaisController {
  constructor(private readonly materiaisService: MateriaisService) {}

  @Get()
  findAll() {
    return this.materiaisService.findAll();
  }

  @Post()
  create(@Body() data: any) {
    return this.materiaisService.create(data);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() data: any) {
    return this.materiaisService.update(id, data);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.materiaisService.delete(id);
  }
}
