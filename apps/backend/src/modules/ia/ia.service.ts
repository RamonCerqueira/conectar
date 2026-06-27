import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IaService {
  private readonly logger = new Logger(IaService.name);

  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
  ) {}

  private get aiServiceUrl(): string {
    return this.config.get('AI_SERVICE_URL') || 'http://localhost:5003';
  }

  // ─── Resumo automático de sessão ─────────────────────────────
  async resumirSessao(prontuarioId: string): Promise<string> {
    const prontuario = await this.prisma.prontuario.findUnique({
      where: { id: prontuarioId },
      include: {
        paciente: { select: { nome: true } },
        profissional: { include: { usuario: { select: { nome: true } } } },
      },
    });

    if (!prontuario) throw new Error('Prontuário não encontrado');

    try {
      const response = await fetch(`${this.aiServiceUrl}/resumir-sessao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prontuario: {
            pacienteNome: prontuario.paciente.nome,
            profissionalNome: prontuario.profissional.usuario.nome,
            data: new Date(prontuario.data).toLocaleDateString('pt-BR'),
            observacoes: prontuario.observacoes,
            objetivosSessao: prontuario.objetivosSessao,
            atividadesRealizadas: prontuario.atividadesRealizadas,
            resultados: prontuario.resultados,
            comportamento: prontuario.comportamento,
            orientacoesPais: prontuario.orientacoesPais,
            proximaMeta: prontuario.proximaMeta,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na chamada ao microserviço de IA: ${response.statusText}`);
      }

      const data = await response.json();
      return data.resumo;
    } catch (error) {
      this.logger.error('Erro ao resumir sessão via microserviço de IA:', error);
      throw error;
    }
  }

  // ─── Resumo automático de notas brutas ────────────────────────
  async resumirNotas(notas: string): Promise<string> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/resumir-sessao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prontuario: {
            observacoes: notas,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na chamada ao microserviço de IA: ${response.statusText}`);
      }

      const data = await response.json();
      return data.resumo;
    } catch (error) {
      this.logger.error('Erro ao resumir notas via microserviço:', error);
      throw error;
    }
  }

  // ─── Sugestão de plano terapêutico ───────────────────────────
  async sugerirPlanoTerapeutico(pacienteId: string): Promise<string> {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: pacienteId },
      include: {
        diagnosticos: true,
        prontuarios: { orderBy: { data: 'desc' }, take: 5 },
        planosTerapeuticos: { include: { metas: true } },
        evolucoes: { orderBy: { data: 'desc' }, take: 10 },
      },
    });

    if (!paciente) throw new Error('Paciente não encontrado');

    const diagnosticos = paciente.diagnosticos.map(d => `${d.cid || ''} - ${d.descricao}`).join(', ');
    const evolucaoResumida = paciente.evolucoes
      .slice(0, 5)
      .map(e => `${e.area}: ${e.valor}%`)
      .join(', ');

    const idade = paciente.dataNascimento
      ? new Date().getFullYear() - new Date(paciente.dataNascimento).getFullYear()
      : '?';

    try {
      const response = await fetch(`${this.aiServiceUrl}/sugerir-plano`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente: {
            nome: paciente.nome,
            idade: idade,
          },
          diagnosticos,
          evolucaoResumida,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na chamada ao microserviço de IA: ${response.statusText}`);
      }

      const data = await response.json();
      return data.sugestao;
    } catch (error) {
      this.logger.error('Erro ao sugerir plano terapêutico via microserviço:', error);
      throw error;
    }
  }

  // ─── Geração automática de laudo ─────────────────────────────
  async gerarLaudo(pacienteId: string, tipoLaudo: string): Promise<string> {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: pacienteId },
      include: {
        diagnosticos: true,
        responsaveis: { where: { isPrincipal: true }, take: 1 },
        prontuarios: { orderBy: { data: 'desc' }, take: 10, include: { profissional: { include: { usuario: true } } } },
        planosTerapeuticos: { include: { metas: true } },
        avaliacoes: { orderBy: { data: 'desc' }, take: 3, include: { tipo: true } },
      },
    });

    if (!paciente) throw new Error('Paciente não encontrado');

    const responsavel = paciente.responsaveis[0];
    const diagnosticos = paciente.diagnosticos.map(d => d.descricao).join('; ');
    const sessoesRecentes = paciente.prontuarios
      .slice(0, 3)
      .map(p => `- ${new Date(p.data).toLocaleDateString('pt-BR')}: ${p.observacoes || p.resultados || 'Sessão realizada'}`)
      .join('\n');

    try {
      const response = await fetch(`${this.aiServiceUrl}/gerar-laudo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paciente: {
            nome: paciente.nome,
            dataNascimento: paciente.dataNascimento ? new Date(paciente.dataNascimento).toLocaleDateString('pt-BR') : 'N/I',
            escola: paciente.escola,
            serie: paciente.serie,
          },
          responsavel: responsavel?.nome,
          diagnosticos,
          sessoesRecentes,
          tipoLaudo,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro na chamada ao microserviço de IA: ${response.statusText}`);
      }

      const data = await response.json();
      return data.laudo;
    } catch (error) {
      this.logger.error('Erro ao gerar laudo via microserviço:', error);
      throw error;
    }
  }

  // ─── Detectar regressões ou alertas ──────────────────────────
  async analisarEvolucao(pacienteId: string): Promise<{ alertas: string[]; resumo: string }> {
    const evolucoes = await this.prisma.evolucao.findMany({
      where: { pacienteId },
      orderBy: { data: 'asc' },
    });

    const frequencias = await this.prisma.frequencia.findMany({
      where: { pacienteId },
      orderBy: { criadoEm: 'desc' },
      take: 10,
    });

    const faltas = frequencias.filter(f => f.status === 'FALTOU' || f.status === 'CANCELADO').length;
    const alertas: string[] = [];

    // Regras de alerta automático (sem IA)
    if (faltas >= 3) {
      alertas.push(`Alta taxa de faltas: ${faltas} nas últimas 10 sessões`);
    }

    // Detectar regressões por área
    const areas = [...new Set(evolucoes.map(e => e.area))];
    for (const area of areas) {
      const pontos = evolucoes.filter(e => e.area === area).map(e => e.valor);
      if (pontos.length >= 3) {
        const ultimos3 = pontos.slice(-3);
        if (ultimos3[2] < ultimos3[0]) {
          alertas.push(`Possível regressão em "${area}": ${ultimos3[0]}% → ${ultimos3[2]}%`);
        }
      }
    }

    const evolucaoPorArea = areas.map(area => {
      const pontos = evolucoes.filter(e => e.area === area);
      return `${area}: ${pontos.map(p => `${p.valor}%`).join(' → ')}`;
    }).join('\n');

    let resumo = 'Análise indisponível no momento. Verifique manualmente a evolução do paciente.';

    try {
      const response = await fetch(`${this.aiServiceUrl}/analisar-evolucao`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          evolucaoPorArea,
          faltas,
          alertas: alertas.join(', ') || 'Nenhum',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        resumo = data.resumo;
      }
    } catch (error) {
      this.logger.error('Erro ao analisar evolução no microserviço:', error);
    }

    return { alertas, resumo };
  }

  // ─── Sugestão de atividades por objetivo ─────────────────────
  async sugerirAtividades(objetivo: string, idade: number): Promise<string[]> {
    try {
      const response = await fetch(`${this.aiServiceUrl}/sugerir-atividades`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ objetivo, idade }),
      });

      if (!response.ok) {
        throw new Error(`Erro na chamada ao microserviço de IA: ${response.statusText}`);
      }

      const data = await response.json();
      return data.atividades;
    } catch (error) {
      this.logger.error('Erro ao sugerir atividades via microserviço:', error);
      return ['Não foi possível gerar sugestões no momento.'];
    }
  }

  // ─── Chat livre com contexto do paciente ─────────────────────
  async chatContexto(pacienteId: string, pergunta: string): Promise<string> {
    const paciente = await this.prisma.paciente.findUnique({
      where: { id: pacienteId },
      include: {
        diagnosticos: true,
        prontuarios: { orderBy: { data: 'desc' }, take: 3 },
      },
    });

    const contexto = paciente
      ? `Contexto do paciente ${paciente.nome}: Diagnósticos: ${paciente.diagnosticos.map(d => d.descricao).join(', ')}`
      : '';

    try {
      const response = await fetch(`${this.aiServiceUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contexto, pergunta }),
      });

      if (!response.ok) {
        throw new Error(`Erro na chamada ao microserviço de IA: ${response.statusText}`);
      }

      const data = await response.json();
      return data.resposta;
    } catch (error) {
      this.logger.error('Erro no chat clínico via microserviço:', error);
      throw error;
    }
  }
}

