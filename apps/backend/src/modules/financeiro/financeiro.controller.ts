import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { FinanceiroService } from './financeiro.service';
@ApiTags('financeiro') @ApiBearerAuth() @Controller('financeiro')
export class FinanceiroController {
  constructor(private readonly service: FinanceiroService) {}
  @Get() findAll(@Query() q: any) { return this.service.findAll(q); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }
  @Get('resumo/:mes') getResumo(@Param('mes') mes: string) { return this.service.getResumoMes(mes); }
  @Get('inadimplentes') getInadimplentes() { return this.service.getInadimplentes(); }
}
