import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IaService } from './ia.service';

@ApiTags('ia')
@ApiBearerAuth()
@Controller('ia')
export class IaController {
  constructor(private readonly iaService: IaService) {}

  @Post('resumir-sessao/:prontuarioId')
  @ApiOperation({ summary: 'Resumir sessão com Gemini AI' })
  resumirSessao(@Param('prontuarioId') id: string) {
    return this.iaService.resumirSessao(id).then(r => ({ resumo: r }));
  }

  @Post('resumir-notas')
  @ApiOperation({ summary: 'Resumir notas brutas de sessão com Gemini AI' })
  resumirNotas(@Body() body: { notas: string }) {
    return this.iaService.resumirNotas(body.notas).then(r => ({ resumo: r }));
  }

  @Post('plano-terapeutico/:pacienteId')
  @ApiOperation({ summary: 'Sugerir plano terapêutico com IA' })
  sugerirPlano(@Param('pacienteId') id: string) {
    return this.iaService.sugerirPlanoTerapeutico(id).then(r => ({ sugestao: r }));
  }

  @Post('gerar-laudo/:pacienteId')
  @ApiOperation({ summary: 'Gerar laudo automaticamente com IA' })
  gerarLaudo(@Param('pacienteId') id: string, @Body() body: { tipoLaudo: string }) {
    return this.iaService.gerarLaudo(id, body.tipoLaudo).then(r => ({ laudo: r }));
  }

  @Post('analisar-evolucao/:pacienteId')
  @ApiOperation({ summary: 'Analisar evolução e detectar regressões' })
  analisarEvolucao(@Param('pacienteId') id: string) {
    return this.iaService.analisarEvolucao(id);
  }

  @Post('sugerir-atividades')
  @ApiOperation({ summary: 'Sugerir atividades para um objetivo terapêutico' })
  sugerirAtividades(@Body() body: { objetivo: string; idade: number }) {
    return this.iaService.sugerirAtividades(body.objetivo, body.idade).then(r => ({ atividades: r }));
  }

  @Post('chat/:pacienteId')
  @ApiOperation({ summary: 'Chat com contexto clínico do paciente' })
  chat(@Param('pacienteId') id: string, @Body() body: { pergunta: string }) {
    return this.iaService.chatContexto(id, body.pergunta).then(r => ({ resposta: r }));
  }
}
