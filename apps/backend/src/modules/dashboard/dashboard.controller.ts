import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';

@ApiTags('dashboard')
@ApiBearerAuth()
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get()
  @ApiOperation({ summary: 'Métricas completas do dashboard' })
  getDashboard() {
    return this.dashboardService.getDashboard();
  }

  @Get('hoje')
  @ApiOperation({ summary: 'Agendamentos de hoje' })
  getHoje() {
    return this.dashboardService.getAgendamentosHoje();
  }

  @Get('alertas')
  @ApiOperation({ summary: 'Alertas importantes' })
  getAlertas() {
    return this.dashboardService.getAlertas();
  }

  @Get('aniversariantes')
  @ApiOperation({ summary: 'Aniversariantes do dia' })
  getAniversariantes() {
    return this.dashboardService.getAniversariantes();
  }

  @Get('financeiro')
  @ApiOperation({ summary: 'Resumo financeiro do mês' })
  getFinanceiro() {
    return this.dashboardService.getResumoFinanceiro();
  }
}
