import { Controller, Get, Post, Put, Delete, Body, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { FinanceiroService } from './financeiro.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('financeiro')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('financeiro')
export class FinanceiroController {
  constructor(private readonly service: FinanceiroService) {}

  @Get('meus-contracheques')
  @ApiOperation({ summary: 'Listar meus holerites/contracheques recebidos' })
  findMyContracheques(@CurrentUser() user: any) {
    return this.service.findMyContracheques(user.nome);
  }

  // Caixa endpoints
  @Get('caixa/status')
  getCaixaStatus(@CurrentUser() user: any) {
    return this.service.getCaixaStatus(user.id);
  }

  @Post('caixa/abrir')
  abrirCaixa(@CurrentUser() user: any, @Body() body: { saldoInicial: number }) {
    return this.service.abrirCaixa(user.id, body.saldoInicial);
  }

  @Post('caixa/fechar')
  fecharCaixa(@CurrentUser() user: any, @Body() body: { conferidoDinh: number; justificativa?: string }) {
    return this.service.fecharCaixa(user.id, body.conferidoDinh, body.justificativa);
  }

  @Get('caixa/historico')
  getHistoricoCaixas() {
    return this.service.getHistoricoCaixas();
  }

  @Post('caixa/aprovar/:id')
  aprovarCaixa(@Param('id') id: string) {
    return this.service.aprovarCaixa(id);
  }

  // Adiantamentos (Vales)
  @Get('adiantamentos')
  getAdiantamentos(@Query() q: any) {
    return this.service.getAdiantamentos(q);
  }

  @Post('adiantamentos')
  createAdiantamento(@Body() body: any) {
    return this.service.createAdiantamento(body);
  }

  @Delete('adiantamentos/:id')
  deleteAdiantamento(@Param('id') id: string) {
    return this.service.deleteAdiantamento(id);
  }

  // Repasses Terapeutas
  @Get('repasses/:mes')
  getRepassesTerapeutas(@Param('mes') mes: string) {
    return this.service.getRepassesTerapeutas(mes);
  }

  @Post('repasses/lancar')
  lancarRepasse(@Body() body: any) {
    return this.service.lancarRepasse(body);
  }

  @Get('previsao-dre')
  getPrevisaoDRE() {
    return this.service.getPrevisaoDRE();
  }

  @Get() findAll(@Query() q: any) { return this.service.findAll(q); }
  @Post() create(@Body() body: any) { return this.service.create(body); }
  @Put(':id') update(@Param('id') id: string, @Body() body: any) { return this.service.update(id, body); }
  @Get('resumo/:mes') getResumo(@Param('mes') mes: string) { return this.service.getResumoMes(mes); }
  @Get('inadimplentes') getInadimplentes() { return this.service.getInadimplentes(); }
}
