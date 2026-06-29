const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8003;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash-exp';

let model;
if (GEMINI_API_KEY) {
  const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  model = genAI.getGenerativeModel({ model: GEMINI_MODEL });
  console.log(`🤖 Gemini AI model initialized with key: ${GEMINI_API_KEY.substring(0, 5)}... using model: ${GEMINI_MODEL}`);
} else {
  console.warn('⚠️ WARNING: GEMINI_API_KEY is not defined. AI Service will run in mock/simulation mode.');
}

// Helper to handle AI generation or mock fallback
async function generateContentSafely(prompt) {
  if (!model) {
    console.log('[MOCK GEMINI] Generating content for prompt');
    return `[Modo Simulação - Chave Gemini não configurada]\nCom base no prompt: "${prompt.substring(0, 80)}...", esta é uma resposta simulada da IA Conectar. Defina GEMINI_API_KEY no arquivo .env para obter respostas reais do modelo Gemini.`;
  }
  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error('Error generating content from Gemini:', error);
    throw error;
  }
}

// ─── Status do Serviço ──────────────────────────────────────────
app.get('/status', (req, res) => {
  res.json({
    status: model ? 'PRONTO' : 'SIMULACAO',
    modelName: GEMINI_MODEL,
    hasApiKey: !!GEMINI_API_KEY,
    timestamp: new Date()
  });
});

// ─── Resumir Sessão ─────────────────────────────────────────────
app.post('/resumir-sessao', async (req, res) => {
  const { prontuario } = req.body;
  if (!prontuario) {
    return res.status(400).json({ error: 'Os dados do prontuário são obrigatórios.' });
  }

  const prompt = `
Você é um assistente clínico especializado em psicopedagogia e terapias infantis.
Resuma em 2-3 parágrafos a sessão abaixo de forma clara e profissional.

Paciente: ${prontuario.pacienteNome || 'Não informado'}
Profissional: ${prontuario.profissionalNome || 'Não informado'}
Data: ${prontuario.data || 'Não informado'}

Observações: ${prontuario.observacoes || 'Não informado'}
Objetivos da sessão: ${prontuario.objetivosSessao || 'Não informado'}
Atividades realizadas: ${prontuario.atividadesRealizadas || 'Não informado'}
Resultados: ${prontuario.resultados || 'Não informado'}
Comportamento: ${prontuario.comportamento || 'Não informado'}
Orientações aos pais: ${prontuario.orientacoesPais || 'Não informado'}
Próxima meta: ${prontuario.proximaMeta || 'Não informado'}

IMPORTANTE: Resuma de forma técnica mas acessível. Não invente informações.
  `.trim();

  try {
    const text = await generateContentSafely(prompt);
    res.json({ resumo: text });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar resumo com a IA', details: err.message });
  }
});

// ─── Sugerir Plano Terapêutico ─────────────────────────────────
app.post('/sugerir-plano', async (req, res) => {
  const { paciente, diagnosticos, evolucaoResumida } = req.body;
  if (!paciente) {
    return res.status(400).json({ error: 'Os dados do paciente são obrigatórios.' });
  }

  const prompt = `
Você é um especialista em psicopedagogia e terapias para crianças com dificuldades de aprendizagem.
Com base nas informações abaixo, sugira 3-5 metas terapêuticas específicas e mensuráveis para os próximos 3 meses.

Paciente: ${paciente.nome}, ${paciente.idade || '?'} anos
Diagnósticos: ${diagnosticos || 'Não informado'}
Evolução recente: ${evolucaoResumida || 'Dados insuficientes'}

Para cada meta, forneça:
1. Objetivo claro e mensurável
2. Critério de progresso (como % de alcance)
3. Atividades sugeridas
4. Prazo estimado

Responda em formato JSON com a estrutura:
[{ "objetivo": "...", "descricao": "...", "prazo": "3 meses", "atividades": ["..."] }]
  `.trim();

  try {
    const text = await generateContentSafely(prompt);
    res.json({ sugestao: text });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao sugerir plano com a IA', details: err.message });
  }
});

// ─── Gerar Laudo Clínico ───────────────────────────────────────
app.post('/gerar-laudo', async (req, res) => {
  const { paciente, responsavel, diagnosticos, sessoesRecentes, tipoLaudo } = req.body;
  if (!paciente) {
    return res.status(400).json({ error: 'Os dados do paciente são obrigatórios.' });
  }

  const prompt = `
Você é um psicopedagogo especialista. Gere um laudo clínico profissional do tipo "${tipoLaudo || 'Laudo de Evolução'}".

DADOS DO PACIENTE:
Nome: ${paciente.nome}
Data de Nascimento: ${paciente.dataNascimento || 'N/I'}
Responsável: ${responsavel || 'Não informado'}
Escola: ${paciente.escola || 'Não informado'}
Série: ${paciente.serie || 'Não informado'}
Diagnósticos: ${diagnosticos || 'Em avaliação'}

SESSÕES RECENTES:
${sessoesRecentes || 'Nenhuma sessão registrada'}

Gere um laudo completo, técnico e profissional com:
1. Identificação do paciente
2. Motivo do encaminhamento
3. Histórico clínico
4. Avaliação e observações
5. Hipótese diagnóstica
6. Conclusão e recomendações
7. Espaço para assinatura

Use linguagem técnica mas acessível. Data atual: ${new Date().toLocaleDateString('pt-BR')}.
  `.trim();

  try {
    const text = await generateContentSafely(prompt);
    res.json({ laudo: text });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao gerar laudo com a IA', details: err.message });
  }
});

// ─── Analisar Evolução ─────────────────────────────────────────
app.post('/analisar-evolucao', async (req, res) => {
  const { evolucaoPorArea, faltas, alertas } = req.body;

  const prompt = `
Analise a evolução clínica abaixo e forneça um resumo em 2 parágrafos.

Evolução por área:
${evolucaoPorArea || 'Nenhum dado de evolução'}

Faltas recentes: ${faltas || 0}/10 sessões
Alertas detectados: ${alertas || 'Nenhum'}

Responda com observações clínicas objetivas.
  `.trim();

  try {
    const text = await generateContentSafely(prompt);
    res.json({ resumo: text });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao analisar evolução com a IA', details: err.message });
  }
});

// ─── Sugerir Atividades ────────────────────────────────────────
app.post('/sugerir-atividades', async (req, res) => {
  const { objetivo, idade } = req.body;
  if (!objetivo) {
    return res.status(400).json({ error: 'O objetivo é obrigatório.' });
  }

  const prompt = `
Você é um terapeuta especialista em dificuldades de aprendizagem infantil.
Sugira 5 atividades práticas para trabalhar o seguinte objetivo com uma criança de ${idade || 7} anos:

Objetivo: ${objetivo}

Responda APENAS com um array JSON de strings com as atividades. Exemplo:
["Atividade 1", "Atividade 2", "Atividade 3", "Atividade 4", "Atividade 5"]
  `.trim();

  try {
    const text = await generateContentSafely(prompt);
    let atividades;
    try {
      const match = text.match(/\[[\s\S]*\]/);
      if (match) {
        atividades = JSON.parse(match[0]);
      } else {
        atividades = [text];
      }
    } catch {
      atividades = [text];
    }
    res.json({ atividades });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao sugerir atividades com a IA', details: err.message });
  }
});

// ─── Chat Clínico Livre ────────────────────────────────────────
app.post('/chat', async (req, res) => {
  const { contexto, pergunta } = req.body;
  if (!pergunta) {
    return res.status(400).json({ error: 'A pergunta é obrigatória.' });
  }

  const prompt = `
Você é um assistente clínico especializado. ${contexto || ''}

Pergunta do profissional: ${pergunta}

Responda de forma técnica, objetiva e baseada em evidências clínicas.
  `.trim();

  try {
    const text = await generateContentSafely(prompt);
    res.json({ resposta: text });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar chat com a IA', details: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`\n🤖 Microserviço de IA com Gemini rodando em http://localhost:${PORT}`);
});
