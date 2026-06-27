import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { RelatoriosService } from './relatorios.service';

@ApiTags('relatorios')
@ApiBearerAuth()
@Controller('relatorios')
export class RelatoriosController {
  constructor(private readonly relatoriosService: RelatoriosService) {}

  @Get('pacientes')
  getPacientesReport() {
    return this.relatoriosService.getPacientesReport();
  }

  @Get('financeiro')
  getFinanceiroReport(
    @Query('de') de?: string,
    @Query('ate') ate?: string,
  ) {
    const dataDe = de ? new Date(de) : undefined;
    const dataAte = ate ? new Date(ate) : undefined;
    return this.relatoriosService.getFinanceiroReport(dataDe, dataAte);
  }

  @Get('atendimentos')
  getAtendimentosReport(
    @Query('de') de?: string,
    @Query('ate') ate?: string,
  ) {
    const dataDe = de ? new Date(de) : undefined;
    const dataAte = ate ? new Date(ate) : undefined;
    return this.relatoriosService.getAtendimentosReport(dataDe, dataAte);
  }
}
