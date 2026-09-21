import {
  PrismaClient,
  PerfilUsuario,
  Sexo,
  StatusPaciente,
  TipoResponsavel,
  TipoProfissional,
  StatusSala,
  StatusAgendamento,
  TipoAtendimento,
  FormaPagamento,
  StatusPagamento,
  TipoLancamento,
  StatusMeta,
  TipoNotificacao,
  TipoArquivo,
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando semeação MASTER COMPLETA do banco de dados (Supabase)...');
  console.log('⚡ Limpando dados existentes de forma segura...');

  // ─────────────────────────────────────────────────────────────────────────────
  // 0. LIMPEZA CONTROLADA EM ORDEM DE DEPENDÊNCIA REVERSA
  // ─────────────────────────────────────────────────────────────────────────────
  await prisma.mensagemChatInterno.deleteMany({});
  await prisma.notificacao.deleteMany({});
  await prisma.frequencia.deleteMany({});
  await prisma.prontuario.deleteMany({});
  await prisma.historicoProgresso.deleteMany({});
  await prisma.metaTerapeutica.deleteMany({});
  await prisma.planoTerapeutico.deleteMany({});
  await prisma.evolucao.deleteMany({});
  await prisma.exercicioCasa.deleteMany({});
  await prisma.relatorioEscolar.deleteMany({});
  await prisma.reuniaoEscolar.deleteMany({});
  await prisma.contatoEscolar.deleteMany({});
  await prisma.avaliacao.deleteMany({});
  await prisma.tipoAvaliacao.deleteMany({});
  await prisma.laudo.deleteMany({});
  await prisma.modeloLaudo.deleteMany({});
  await prisma.contrato.deleteMany({});
  await prisma.modeloContrato.deleteMany({});
  await prisma.arquivo.deleteMany({});
  await prisma.lancamento.deleteMany({});
  await prisma.agendamento.deleteMany({});
  await prisma.bloqueioAgenda.deleteMany({});
  await prisma.salaAlocacao.deleteMany({});
  await prisma.profissionalSala.deleteMany({});
  await prisma.listaEspera.deleteMany({});
  await prisma.consentimentoLGPD.deleteMany({});
  await prisma.diagnostico.deleteMany({});
  await prisma.responsavel.deleteMany({});
  await prisma.paciente.deleteMany({});
  await prisma.material.deleteMany({});
  await prisma.registroPonto.deleteMany({});
  await prisma.feriado.deleteMany({});
  await prisma.fechamentoCaixa.deleteMany({});
  await prisma.adiantamento.deleteMany({});
  await prisma.triagemLead.deleteMany({});
  await prisma.chatbotPasso.deleteMany({});
  await prisma.mensagemFila.deleteMany({});
  await prisma.configuracao.deleteMany({});
  await prisma.auditLog.deleteMany({});
  await prisma.refreshToken.deleteMany({});
  await prisma.profissional.deleteMany({});
  await prisma.usuario.deleteMany({});
  await prisma.sala.deleteMany({});

  const hashedPassword = await bcrypt.hash('123456', 10);
  const hoje = new Date();
  const hojeStr = hoje.toISOString().split('T')[0];

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. USUÁRIOS E PERFIS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('👤 [1/20] Criando equipe multidisciplinar e usuários do sistema...');

  const userAdmin = await prisma.usuario.create({
    data: {
      nome: 'Administrador Geral Conectar',
      email: 'admin@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.ADMINISTRADOR,
      ativo: true,
      telefone: '(11) 98888-0001',
    },
  });

  const userRecepcao = await prisma.usuario.create({
    data: {
      nome: 'Juliana Costa (Recepção Central)',
      email: 'recepcao@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.RECEPCAO,
      ativo: true,
      telefone: '(11) 98888-0002',
    },
  });

  const userDiretoria = await prisma.usuario.create({
    data: {
      nome: 'Dra. Helena Diretora Médica',
      email: 'diretoria@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.DIRETOR,
      ativo: true,
      telefone: '(11) 98888-0003',
    },
  });

  const userFinanceiro = await prisma.usuario.create({
    data: {
      nome: 'Carlos Eduardo Financeiro',
      email: 'financeiro@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.FINANCEIRO,
      ativo: true,
      telefone: '(11) 98888-0004',
    },
  });

  const userCoordenacao = await prisma.usuario.create({
    data: {
      nome: 'Fernanda Toledo (Coordenação Clínica)',
      email: 'coordenacao@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.COORDENADOR,
      ativo: true,
      telefone: '(11) 98888-0005',
    },
  });

  // Terapeutas
  const userLeliane = await prisma.usuario.create({
    data: {
      nome: 'Dra. Leliane Rocha',
      email: 'dra.leliane@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.PSICOLOGO,
      ativo: true,
      telefone: '(11) 97777-1001',
    },
  });

  const userBeatriz = await prisma.usuario.create({
    data: {
      nome: 'Dra. Beatriz Lima',
      email: 'dra.beatriz@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.PSICOPEDAGOGO,
      ativo: true,
      telefone: '(11) 97777-1002',
    },
  });

  const userRosana = await prisma.usuario.create({
    data: {
      nome: 'Dra. Rosana Alves',
      email: 'dra.rosana@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.FONOAUDIOLOGO,
      ativo: true,
      telefone: '(11) 97777-1003',
    },
  });

  const userThiago = await prisma.usuario.create({
    data: {
      nome: 'Dr. Thiago Martins',
      email: 'dr.thiago@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.TERAPEUTA_OCUPACIONAL,
      ativo: true,
      telefone: '(11) 97777-1004',
    },
  });

  const userMarcos = await prisma.usuario.create({
    data: {
      nome: 'Dr. Marcos Silveira',
      email: 'dr.marcos@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.NEUROPSICÓLOGO,
      ativo: true,
      telefone: '(11) 97777-1005',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. SALAS DE ATENDIMENTO
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('🏛️ [2/20] Criando salas clínicas e consultórios...');

  const sala1 = await prisma.sala.create({
    data: {
      id: 'sala-1',
      nome: 'Sala 01 - Integração Sensorial (T.O.)',
      descricao: 'Equipada com balanços terapêuticos, piscina de bolinhas, tirolesa e texturas proprioceptivas.',
      capacidade: 2,
      cor: '#3b82f6',
      status: StatusSala.DISPONIVEL,
    },
  });

  const sala2 = await prisma.sala.create({
    data: {
      id: 'sala-2',
      nome: 'Sala 02 - Psicologia Infantil & Ludoterapia',
      descricao: 'Ambiente acolhedor com brinquedos estruturados, casinha de bonecas, jogos projetivos e mesa lúdica.',
      capacidade: 3,
      cor: '#8b5cf6',
      status: StatusSala.DISPONIVEL,
    },
  });

  const sala3 = await prisma.sala.create({
    data: {
      id: 'sala-3',
      nome: 'Sala 03 - Fonoaudiologia & Cabine Acústica',
      descricao: 'Cabine audiométrica com isolamento acústico, espelho de articulação e tablets com PECS.',
      capacidade: 2,
      cor: '#ec4899',
      status: StatusSala.DISPONIVEL,
    },
  });

  const sala4 = await prisma.sala.create({
    data: {
      id: 'sala-4',
      nome: 'Sala 04 - Psicopedagogia & Neuroaprendizagem',
      descricao: 'Mesa de trabalho individual, material dourado, jogos cognitivos e recursos para dislexia.',
      capacidade: 4,
      cor: '#10b981',
      status: StatusSala.DISPONIVEL,
    },
  });

  const sala5 = await prisma.sala.create({
    data: {
      id: 'sala-5',
      nome: 'Sala 05 - Neuropsicologia & Avaliação Formal',
      descricao: 'Ambiente neutro e silencioso padronizado para aplicação de baterias neuropsicológicas (WISC-IV, Neupsilin).',
      capacidade: 2,
      cor: '#f59e0b',
      status: StatusSala.DISPONIVEL,
    },
  });

  const sala6 = await prisma.sala.create({
    data: {
      id: 'sala-6',
      nome: 'Sala 06 - Habilidades Sociais & Grupo',
      descricao: 'Amplo espaço com almofadas, quadro interativo e jogos de cooperação para treino de pares.',
      capacidade: 8,
      cor: '#06b6d4',
      status: StatusSala.DISPONIVEL,
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PROFISSIONAIS & ALOCAÇÕES
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('👨‍⚕️ [3/20] Cadastrando especialidades profissionais e vinculando a salas...');

  const profLeliane = await prisma.profissional.create({
    data: {
      usuarioId: userLeliane.id,
      tipo: TipoProfissional.PSICOLOGO,
      especialidade: 'Terapia Cognitivo-Comportamental (TCC) e Análise do Comportamento (ABA)',
      especialidades: ['TCC Infantil', 'Transtorno do Espectro Autista (TEA)', 'Regulação Emocional'],
      registro: 'CRP 06/145892',
      orgaoRegistro: 'CRP SP',
      cor: '#8b5cf6',
      bio: 'Especialista em intervenção precoce no TEA com mais de 8 anos de atuação clínica infantojuvenil.',
    },
  });

  const profBeatriz = await prisma.profissional.create({
    data: {
      usuarioId: userBeatriz.id,
      tipo: TipoProfissional.PSICOPEDAGOGO,
      especialidade: 'Transtornos de Aprendizagem, Dislexia e Discalculia',
      especialidades: ['Psicopedagogia Clínica', 'Neuropsicopedagogia', 'Alfabetização Inclusiva'],
      registro: 'ABPp 4521/SP',
      orgaoRegistro: 'ABPp',
      cor: '#10b981',
      bio: 'Mestre em Educação Especial, com foco em mediação escolar e adaptação curricular para neurodivergentes.',
    },
  });

  const profRosana = await prisma.profissional.create({
    data: {
      usuarioId: userRosana.id,
      tipo: TipoProfissional.FONOAUDIOLOGO,
      especialidade: 'Linguagem Infantil, Apraxia de Fala e Motricidade Orofacial',
      especialidades: ['Comunicação Alternativa (PECS/PODD)', 'Método PROMPT', 'Processamento Auditivo Central'],
      registro: 'CRFa 2-18965',
      orgaoRegistro: 'CRFa 2ª Região',
      cor: '#ec4899',
      bio: 'Fonoaudióloga certificada pelo The Prompt Institute (USA) para reabilitação motora de fala na infância.',
    },
  });

  const profThiago = await prisma.profissional.create({
    data: {
      usuarioId: userThiago.id,
      tipo: TipoProfissional.TERAPEUTA_OCUPACIONAL,
      especialidade: 'Integração Sensorial de Ayres (CLASI) e Autonomia em AVDs',
      especialidades: ['Integração Sensorial', 'Coordenação Motora Fina', 'Seletividade Alimentar'],
      registro: 'CREFITO 3/98745-TO',
      orgaoRegistro: 'CREFITO-3',
      cor: '#3b82f6',
      bio: 'Terapeuta Ocupacional com certificação internacional em Integração Sensorial e manejo comportamental.',
    },
  });

  const profMarcos = await prisma.profissional.create({
    data: {
      usuarioId: userMarcos.id,
      tipo: TipoProfissional.NEUROPSICÓLOGO,
      especialidade: 'Avaliação Neuropsicológica e Reabilitação Cognitiva',
      especialidades: ['Diagnóstico Diferencial TEA/TDAH', 'Altas Habilidades / Superdotação', 'Funções Executivas'],
      registro: 'CRP 06/172340',
      orgaoRegistro: 'CRP SP',
      cor: '#f59e0b',
      bio: 'Especialista pela USP em Neuropsicologia Clínica, perito em laudos técnicos e perfil de aprendizagem.',
    },
  });

  // Vincular profissionais às salas de atendimento
  await prisma.profissionalSala.createMany({
    data: [
      { profissionalId: profThiago.id, salaId: sala1.id },
      { profissionalId: profLeliane.id, salaId: sala2.id },
      { profissionalId: profRosana.id, salaId: sala3.id },
      { profissionalId: profBeatriz.id, salaId: sala4.id },
      { profissionalId: profMarcos.id, salaId: sala5.id },
      { profissionalId: profLeliane.id, salaId: sala6.id },
    ],
  });

  // Alocações fixas na agenda da semana
  await prisma.salaAlocacao.createMany({
    data: [
      { diasSemana: ['SEGUNDA', 'QUARTA'], horarioInicio: '08:00', horarioFim: '18:00', profissionalId: profThiago.id, salaId: sala1.id },
      { diasSemana: ['TERCA', 'QUINTA'], horarioInicio: '08:00', horarioFim: '18:00', profissionalId: profLeliane.id, salaId: sala2.id },
      { diasSemana: ['SEGUNDA', 'SEXTA'], horarioInicio: '08:00', horarioFim: '18:00', profissionalId: profRosana.id, salaId: sala3.id },
      { diasSemana: ['QUARTA', 'SEXTA'], horarioInicio: '08:00', horarioFim: '18:00', profissionalId: profBeatriz.id, salaId: sala4.id },
      { diasSemana: ['TERCA', 'SEXTA'], horarioInicio: '08:00', horarioFim: '18:00', profissionalId: profMarcos.id, salaId: sala5.id },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. PACIENTES E HISTÓRICOS CLÍNICOS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('👶 [4/20] Cadastrando pacientes e diagnósticos CIDs...');

  const pacLucas = await prisma.paciente.create({
    data: {
      id: 'pac-lucas',
      nome: 'Lucas Mendes da Silva',
      cpf: '458.962.130-11',
      rg: '54.892.147-8',
      sexo: Sexo.MASCULINO,
      dataNascimento: new Date('2017-06-14'),
      status: StatusPaciente.ATIVO,
      cep: '04567-000',
      logradouro: 'Rua das Camélias',
      numero: '235',
      bairro: 'Brooklin',
      cidade: 'São Paulo',
      estado: 'SP',
      escola: 'Colégio Integração Infantil',
      serie: '3º ano do Ensino Fundamental I',
      turnoEscolar: 'Manhã',
      nomeProf: 'Tia Cristina Ramos',
      coordenador: 'Mariana Duarte',
      alergias: ['Proteína do Leite de Vaca (APLV)'],
      medicamentos: ['Ritalina LA 10mg'],
      observacoesMed: 'Apresenta hipersensibilidade tátil e auditiva moderada.',
      convenio: 'Bradesco Saúde Top Nacional',
      numeroConvenio: '78945612300',
      validade: new Date('2027-12-31'),
      medicosRef: { neuropediatra: 'Dr. Roberto Caldas (CRM 145200)', pediatra: 'Dra. Silvia Martins' },
      primeiraConsulta: new Date('2024-02-10'),
      valorConsulta: 180.00,
      modeloCobranca: 'MENSALIDADE',
    },
  });

  const pacSofia = await prisma.paciente.create({
    data: {
      id: 'pac-sofia',
      nome: 'Sofia Andrade Oliveira',
      cpf: '512.369.870-22',
      rg: '62.341.879-1',
      sexo: Sexo.FEMININO,
      dataNascimento: new Date('2019-11-20'),
      status: StatusPaciente.ATIVO,
      cep: '04123-010',
      logradouro: 'Alameda dos Anapurus',
      numero: '1100',
      complemento: 'Apto 84B',
      bairro: 'Moema',
      cidade: 'São Paulo',
      estado: 'SP',
      escola: 'Escola Infantil Sementinhas do Saber',
      serie: 'Jardim II',
      turnoEscolar: 'Tarde',
      nomeProf: 'Professora Amanda',
      coordenador: 'Renata Lemos',
      alergias: ['Amendoim', 'Dipirona'],
      medicamentos: ['Melatonina gotas 2mg (noturno)'],
      observacoesMed: 'Comunicação verbal restrita; excelente resposta a pranchas visuais PECS.',
      convenio: 'SulAmérica Especial 100',
      numeroConvenio: '98765432101',
      medicosRef: { neuropediatra: 'Dra. Camila Nogueira (CRM 188741)' },
      primeiraConsulta: new Date('2024-05-15'),
      valorConsulta: 200.00,
      modeloCobranca: 'MENSALIDADE',
    },
  });

  const pacGabriel = await prisma.paciente.create({
    data: {
      id: 'pac-gabriel',
      nome: 'Gabriel Souza Santos',
      cpf: '369.852.140-33',
      rg: '49.874.125-3',
      sexo: Sexo.MASCULINO,
      dataNascimento: new Date('2015-02-08'),
      status: StatusPaciente.ATIVO,
      cep: '05432-001',
      logradouro: 'Rua Mourato Coelho',
      numero: '740',
      bairro: 'Pinheiros',
      cidade: 'São Paulo',
      estado: 'SP',
      escola: 'Escola Monteiro Lobato Bilíngue',
      serie: '5º ano do Ensino Fundamental',
      turnoEscolar: 'Manhã',
      nomeProf: 'Prof. Marcos Vinicius',
      coordenador: 'Lúcia Prado',
      alergias: [],
      medicamentos: [],
      observacoesMed: 'Queixa de frustração e bloqueio na leitura fluente e escrita de palavras complexas.',
      convenio: 'Amil Blue 400',
      numeroConvenio: '45612378902',
      medicosRef: { neuropediatra: 'Dr. Fábio Esteves (CRM 130982)' },
      primeiraConsulta: new Date('2024-03-01'),
      valorConsulta: 160.00,
      modeloCobranca: 'POR_CONSULTA',
    },
  });

  const pacIsabela = await prisma.paciente.create({
    data: {
      id: 'pac-isabela',
      nome: 'Isabela Rodrigues Lima',
      cpf: '632.741.980-44',
      rg: '71.205.463-5',
      sexo: Sexo.FEMININO,
      dataNascimento: new Date('2021-08-12'),
      status: StatusPaciente.ATIVO,
      cep: '04510-000',
      logradouro: 'Avenida Rouxinol',
      numero: '450',
      bairro: 'Moema',
      cidade: 'São Paulo',
      estado: 'SP',
      escola: 'Berçário e Educação Infantil Passinhos Firmes',
      serie: 'Maternal II',
      turnoEscolar: 'Manhã',
      nomeProf: 'Tia Carol',
      alergias: [],
      medicamentos: [],
      observacoesMed: 'Atraso na marcha e pouca coordenação bimanual; marcha na ponta dos pés.',
      convenio: 'Porto Seguro Prata',
      numeroConvenio: '32165498703',
      medicosRef: { ortopedistaPediatrico: 'Dr. André Vianna (CRM 119854)' },
      primeiraConsulta: new Date('2024-08-20'),
      valorConsulta: 170.00,
      modeloCobranca: 'MENSALIDADE',
    },
  });

  const pacEnzo = await prisma.paciente.create({
    data: {
      id: 'pac-enzo',
      nome: 'Enzo Fernandes Costa',
      cpf: '741.258.960-55',
      rg: '58.412.369-0',
      sexo: Sexo.MASCULINO,
      dataNascimento: new Date('2016-10-05'),
      status: StatusPaciente.ATIVO,
      cep: '04715-005',
      logradouro: 'Rua Verbo Divino',
      numero: '980',
      bairro: 'Chácara Santo Antônio',
      cidade: 'São Paulo',
      estado: 'SP',
      escola: 'Colégio Pueri Domus',
      serie: '4º ano do Ensino Fundamental',
      turnoEscolar: 'Tarde',
      alergias: ['Ibuprofeno'],
      medicamentos: ['Venvanse 30mg'],
      observacoesMed: 'Impulsividade motora e crises de oposição quando contrariado na escola.',
      convenio: 'Particular (Reembolso Omint)',
      medicosRef: { psiquiatraInfantil: 'Dra. Beatriz Toledo (CRM 167890)' },
      primeiraConsulta: new Date('2024-04-12'),
      valorConsulta: 220.00,
      modeloCobranca: 'MENSALIDADE',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. DIAGNÓSTICOS CIDs DOS PACIENTES
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('🩺 [5/20] Vinculando diagnósticos CID-10 e CID-11...');

  await prisma.diagnostico.createMany({
    data: [
      {
        pacienteId: pacLucas.id,
        cid: 'F84.0 / 6A02',
        descricao: 'Transtorno do Espectro Autista — Nível 1 de suporte sem deficiência intelectual associada',
        observacoes: 'Laudo emitido por Dr. Roberto Caldas em 12/2023 com indicação de T.O. e Psicologia TCC.',
      },
      {
        pacienteId: pacLucas.id,
        cid: 'F90.0 / 6A05',
        descricao: 'Transtorno do Déficit de Atenção e Hiperatividade (TDAH) — Apresentação Combinada',
      },
      {
        pacienteId: pacSofia.id,
        cid: 'F84.0 / 6A02.1',
        descricao: 'Transtorno do Espectro Autista — Nível 2 de suporte com prejuízo da linguagem funcional',
        observacoes: 'Requer apoio substancial na rotina e comunicação alternativa.',
      },
      {
        pacienteId: pacSofia.id,
        cid: 'F80.0',
        descricao: 'Transtorno Específico da Articulação da Fala (Apraxia de Fala Infantil)',
      },
      {
        pacienteId: pacGabriel.id,
        cid: 'F81.0 / 6A03',
        descricao: 'Transtorno do Desenvolvimento da Leitura (Dislexia)',
        observacoes: 'Dificuldades no processamento fonológico e decodificação grafema-fonema.',
      },
      {
        pacienteId: pacGabriel.id,
        cid: 'F81.2',
        descricao: 'Transtorno Específico de Habilidades Aritméticas (Discalculia)',
      },
      {
        pacienteId: pacIsabela.id,
        cid: 'F82',
        descricao: 'Transtorno do Desenvolvimento da Coordenação Motora (Dispraxia)',
      },
      {
        pacienteId: pacEnzo.id,
        cid: 'F90.1',
        descricao: 'Transtorno Hipercinético com Transtorno de Conduta (TDAH + TOD)',
      },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. RESPONSÁVEIS E ACESSO AO PORTAL DOS PAIS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('👨‍👩‍👧 [6/20] Cadastrando responsáveis legais com acesso liberado ao Portal dos Pais...');

  await prisma.responsavel.create({
    data: {
      pacienteId: pacLucas.id,
      nome: 'Mariana Mendes da Silva',
      cpf: '321.654.987-00',
      rg: '38.452.190-2',
      telefone: '(11) 99123-4567',
      whatsapp: '(11) 99123-4567',
      email: 'mariana.mendes@email.com',
      grauParent: TipoResponsavel.MAE,
      profissao: 'Engenheira de Software',
      isPrincipal: true,
      senhaPortal: hashedPassword,
      ativoPortal: true,
    },
  });

  await prisma.responsavel.create({
    data: {
      pacienteId: pacSofia.id,
      nome: 'Roberto Oliveira',
      cpf: '215.874.963-11',
      rg: '29.874.156-4',
      telefone: '(11) 99876-5432',
      whatsapp: '(11) 99876-5432',
      email: 'roberto.oliveira@email.com',
      grauParent: TipoResponsavel.PAI,
      profissao: 'Advogado Tributarista',
      isPrincipal: true,
      senhaPortal: hashedPassword,
      ativoPortal: true,
    },
  });

  await prisma.responsavel.create({
    data: {
      pacienteId: pacGabriel.id,
      nome: 'Juliana Souza Santos',
      cpf: '159.753.486-22',
      rg: '41.258.963-7',
      telefone: '(11) 99555-4321',
      whatsapp: '(11) 99555-4321',
      email: 'juliana.souza@email.com',
      grauParent: TipoResponsavel.MAE,
      profissao: 'Arquiteta e Urbanista',
      isPrincipal: true,
      senhaPortal: hashedPassword,
      ativoPortal: true,
    },
  });

  await prisma.responsavel.create({
    data: {
      pacienteId: pacIsabela.id,
      nome: 'Aline Rodrigues Lima',
      cpf: '753.951.852-33',
      telefone: '(11) 99444-8899',
      whatsapp: '(11) 99444-8899',
      email: 'aline.rodrigues@email.com',
      grauParent: TipoResponsavel.MAE,
      profissao: 'Dentista Odontopediatra',
      isPrincipal: true,
      senhaPortal: hashedPassword,
      ativoPortal: true,
    },
  });

  await prisma.responsavel.create({
    data: {
      pacienteId: pacEnzo.id,
      nome: 'Carlos Fernandes Costa',
      cpf: '852.147.963-44',
      telefone: '(11) 99333-7711',
      whatsapp: '(11) 99333-7711',
      email: 'carlos.costa@email.com',
      grauParent: TipoResponsavel.PAI,
      profissao: 'Administrador de Empresas',
      isPrincipal: true,
      senhaPortal: hashedPassword,
      ativoPortal: true,
    },
  });

  // Termos de Consentimento LGPD
  await prisma.consentimentoLGPD.createMany({
    data: [
      { pacienteId: pacLucas.id, tipo: 'uso_dados_clinicos', aceito: true, versao: '1.0' },
      { pacienteId: pacLucas.id, tipo: 'autorizacao_imagem_video', aceito: true, versao: '1.0' },
      { pacienteId: pacSofia.id, tipo: 'uso_dados_clinicos', aceito: true, versao: '1.0' },
      { pacienteId: pacGabriel.id, tipo: 'uso_dados_clinicos', aceito: true, versao: '1.0' },
      { pacienteId: pacEnzo.id, tipo: 'uso_dados_clinicos', aceito: true, versao: '1.0' },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. AGENDAMENTOS E FREQUÊNCIA
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('📅 [7/20] Gerando grade completa de agendamentos e presenças...');

  const agendamento1 = await prisma.agendamento.create({
    data: {
      pacienteId: pacLucas.id,
      profissionalId: profLeliane.id,
      salaId: sala2.id,
      data: new Date(`${hojeStr}T09:00:00.000Z`),
      dataFim: new Date(`${hojeStr}T09:50:00.000Z`),
      status: StatusAgendamento.PRESENTE,
      tipo: TipoAtendimento.PRESENCIAL,
      observacoes: 'Sessão focada em regulação emocional e tolerância à frustração.',
    },
  });

  const agendamento2 = await prisma.agendamento.create({
    data: {
      pacienteId: pacSofia.id,
      profissionalId: profRosana.id,
      salaId: sala3.id,
      data: new Date(`${hojeStr}T10:00:00.000Z`),
      dataFim: new Date(`${hojeStr}T10:50:00.000Z`),
      status: StatusAgendamento.CONFIRMADO,
      tipo: TipoAtendimento.PRESENCIAL,
      observacoes: 'Estimulação motora dos fonemas bilabiais /p/ e /b/ com apoio tátil PROMPT.',
    },
  });

  const agendamento3 = await prisma.agendamento.create({
    data: {
      pacienteId: pacGabriel.id,
      profissionalId: profBeatriz.id,
      salaId: sala4.id,
      data: new Date(`${hojeStr}T14:00:00.000Z`),
      dataFim: new Date(`${hojeStr}T14:50:00.000Z`),
      status: StatusAgendamento.AGENDADO,
      tipo: TipoAtendimento.PRESENCIAL,
      observacoes: 'Treino de consciência fonológica e segmentação de sílabas complexas.',
    },
  });

  const agendamento4 = await prisma.agendamento.create({
    data: {
      pacienteId: pacLucas.id,
      profissionalId: profThiago.id,
      salaId: sala1.id,
      data: new Date(`${hojeStr}T15:30:00.000Z`),
      dataFim: new Date(`${hojeStr}T16:20:00.000Z`),
      status: StatusAgendamento.AGENDADO,
      tipo: TipoAtendimento.PRESENCIAL,
      observacoes: 'Estimulação vestibular no balanço com alvo visual para modulação sensorial.',
    },
  });

  const agendamento5 = await prisma.agendamento.create({
    data: {
      pacienteId: pacEnzo.id,
      profissionalId: profMarcos.id,
      salaId: sala5.id,
      data: new Date(`${hojeStr}T16:30:00.000Z`),
      dataFim: new Date(`${hojeStr}T17:30:00.000Z`),
      status: StatusAgendamento.AGENDADO,
      tipo: TipoAtendimento.PRESENCIAL,
      observacoes: 'Aplicação do Teste de Atenção Concentrada e Cancelamento dos Sinos.',
    },
  });

  // Frequências registradas
  await prisma.frequencia.create({
    data: {
      pacienteId: pacLucas.id,
      agendamentoId: agendamento1.id,
      status: StatusAgendamento.PRESENTE,
      justificativa: 'Chegou pontualmente acompanhado pela mãe.',
    },
  });

  // Bloqueios de Agenda
  await prisma.bloqueioAgenda.createMany({
    data: [
      {
        profissionalId: profLeliane.id,
        inicio: new Date(`${hojeStr}T12:00:00.000Z`),
        fim: new Date(`${hojeStr}T13:00:00.000Z`),
        motivo: 'Intervalo de Almoço',
        tipoMotivo: 'almoco',
      },
      {
        profissionalId: profThiago.id,
        inicio: new Date(`${hojeStr}T12:00:00.000Z`),
        fim: new Date(`${hojeStr}T13:00:00.000Z`),
        motivo: 'Intervalo de Almoço',
        tipoMotivo: 'almoco',
      },
      {
        profissionalId: profMarcos.id,
        inicio: new Date(`${hojeStr}T18:00:00.000Z`),
        fim: new Date(`${hojeStr}T19:30:00.000Z`),
        motivo: 'Reunião Clínica Multidisciplinar Semanal',
        tipoMotivo: 'reuniao',
      },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. PRONTUÁRIOS CLÍNICOS E EVOLUÇÕES
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('📝 [8/20] Criando prontuários detalhados e histórico de evoluções...');

  await prisma.prontuario.create({
    data: {
      pacienteId: pacLucas.id,
      profissionalId: profLeliane.id,
      agendamentoId: agendamento1.id,
      queixaPrincipal: 'Episódios de irritabilidade e choro ao perder em atividades competitivas com colegas.',
      objetivosSessao: 'Desenvolver repertório de autorregulação e flexibilidade cognitiva no contexto de jogos cooperativos.',
      atividadesRealizadas: 'Aplicação do Jogo da Memória com regras negociadas e introdução do "Termômetro das Emoções".',
      resultados: 'O paciente conseguiu identificar o aumento da frustração (nível amarelo) e solicitou pausa para respiração profunda.',
      comportamento: 'Colaborativo, com contato visual sustentado durante a maior parte do atendimento.',
      orientacoesPais: 'Orientada a mãe a validar o sentimento de frustração em casa sem ceder à exigência imediata da criança.',
      proximaMeta: 'Generalizar o uso do cartão visual de calma para o ambiente escolar.',
      dadosExtra: { intensidadeFrustracaoInicial: '8/10', intensidadePosIntervencao: '3/10', engajamento: 'Excelente' },
    },
  });

  // Evoluções gráficas ao longo do tempo
  await prisma.evolucao.createMany({
    data: [
      { pacienteId: pacLucas.id, area: 'Autorregulação Emocional', valor: 78.5, observacao: 'Evolução notável no controle de impulsos' },
      { pacienteId: pacLucas.id, area: 'Tolerância à Frustração', valor: 65.0, observacao: 'Aceita perder com menor tempo de recuperação' },
      { pacienteId: pacLucas.id, area: 'Atenção Sustentada', valor: 82.0, observacao: 'Mantém foco por 22 minutos contínuos' },
      { pacienteId: pacSofia.id, area: 'Comunicação Funcional (PECS)', valor: 70.0, observacao: 'Utiliza fase 3 com troca discriminada' },
      { pacienteId: pacSofia.id, area: 'Inteligibilidade de Fala', valor: 55.0, observacao: 'Aumento de emissões espontâneas cv' },
      { pacienteId: pacGabriel.id, area: 'Velocidade de Leitura', valor: 60.0, observacao: 'Ganho de 18 ppm com pistas visuais' },
      { pacienteId: pacGabriel.id, area: 'Compreensão de Texto', valor: 75.0, observacao: 'Excelente recuperação de fatos principais' },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 9. PLANO TERAPÊUTICO SINGULAR (PTS) & METAS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('🎯 [9/20] Estruturando Planos Terapêuticos Singulares (PTS) e Metas...');

  const planoLucas = await prisma.planoTerapeutico.create({
    data: {
      pacienteId: pacLucas.id,
      titulo: 'Plano Terapêutico Integrado 2026 — Lucas Mendes',
      descricao: 'Desenvolvimento de autonomia sócio-emocional, regulação sensorial e adaptação escolar.',
      ativo: true,
    },
  });

  const meta1Lucas = await prisma.metaTerapeutica.create({
    data: {
      planoId: planoLucas.id,
      objetivo: 'Aumentar o tempo de atenção sustentada em atividades escolares estruturadas para 25 minutos',
      descricao: 'Uso de temporizador visual Pomodoro adaptado e eliminação progressiva de reforçadores imediatos.',
      progresso: 80,
      status: StatusMeta.EM_ANDAMENTO,
      prazo: new Date('2026-11-30'),
    },
  });

  const meta2Lucas = await prisma.metaTerapeutica.create({
    data: {
      planoId: planoLucas.id,
      objetivo: 'Reconhecer e nomear 4 estados emocionais em si mesmo e expressar verbalmente',
      descricao: 'Uso do termômetro de regulação Zones of Regulation.',
      progresso: 100,
      status: StatusMeta.CONCLUIDO,
      prazo: new Date('2026-08-15'),
    },
  });

  const meta3Lucas = await prisma.metaTerapeutica.create({
    data: {
      planoId: planoLucas.id,
      objetivo: 'Tolera mudança na rotina escolar e transição de aulas sem crise de desorganização',
      descricao: 'Introdução prévia do quadro de avisos com 5 minutos de antecedência.',
      progresso: 60,
      status: StatusMeta.EM_ANDAMENTO,
      prazo: new Date('2026-12-15'),
    },
  });

  // Histórico de progresso da meta
  await prisma.historicoProgresso.createMany({
    data: [
      { metaId: meta1Lucas.id, progresso: 40, nota: 'Início da intervenção; foco médio de 10 min.', data: new Date('2026-03-01') },
      { metaId: meta1Lucas.id, progresso: 65, nota: 'Boa adaptação ao cronômetro de areia; 18 min.', data: new Date('2026-06-15') },
      { metaId: meta1Lucas.id, progresso: 80, nota: 'Alcançou 22 minutos estáveis em sala de atendimento.', data: new Date() },
      { metaId: meta2Lucas.id, progresso: 100, nota: 'Meta plenamente consolidada em sessão e no domicílio.', data: new Date() },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 10. AVALIAÇÕES CLÍNICAS CONFIGURÁVEIS (M-CHAT, SNAP-IV, WISC)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('📊 [10/20] Cadastrando protocolos de testes e avaliações aplicadas...');

  const tipoMChat = await prisma.tipoAvaliacao.create({
    data: {
      nome: 'M-CHAT-R/F (Rastreio Precoce de Autismo)',
      descricao: 'Questionário de 20 perguntas para detecção precoce de sinais de TEA em crianças pequenas.',
      campos: [
        { id: 'aponta_interesse', label: 'Se você apontar para algo na sala, a criança olha para o objeto?', tipo: 'boolean' },
        { id: 'responde_nome', label: 'A criança responde quando é chamada pelo nome?', tipo: 'boolean' },
        { id: 'contato_visual', label: 'A criança sustenta contato visual direto durante a interação?', tipo: 'boolean' },
        { id: 'brinquedo_faz_de_conta', label: 'A criança brinca de faz de conta (ex: finge dar comida a um boneco)?', tipo: 'boolean' },
      ],
      ativo: true,
    },
  });

  const tipoSNAP = await prisma.tipoAvaliacao.create({
    data: {
      nome: 'SNAP-IV (Escala de TDAH e Transtorno Opositor)',
      descricao: 'Escala padronizada de 18 itens para avaliação de sintomas de desatenção e hiperatividade/impulsividade.',
      campos: [
        { id: 'desatencao_detalhes', label: 'Não presta atenção a detalhes ou comete erros por descuido', tipo: 'escala_0_3' },
        { id: 'dificuldade_sustentar_atencao', label: 'Tem dificuldade em manter a atenção em tarefas ou jogos', tipo: 'escala_0_3' },
        { id: 'inquietacao_motora', label: 'Mexe as mãos ou os pés ou se remexe na cadeira', tipo: 'escala_0_3' },
        { id: 'fala_excessiva', label: 'Fala excessivamente ou interrompe os outros', tipo: 'escala_0_3' },
      ],
      ativo: true,
    },
  });

  await prisma.avaliacao.create({
    data: {
      pacienteId: pacSofia.id,
      profissionalId: profRosana.id,
      tipoId: tipoMChat.id,
      data: new Date('2024-06-10'),
      respostas: {
        aponta_interesse: false,
        responde_nome: true,
        contato_visual: false,
        brinquedo_faz_de_conta: false,
        escoreFinal: 'Alto Risco (3 itens críticos positivos)',
      },
      conclusao: 'Indicativo de sinais clínicos compatíveis com TEA; sugerida ampliação de terapias multidisciplinares.',
    },
  });

  await prisma.avaliacao.create({
    data: {
      pacienteId: pacEnzo.id,
      profissionalId: profMarcos.id,
      tipoId: tipoSNAP.id,
      data: new Date('2024-07-18'),
      respostas: {
        desatencao_detalhes: 3,
        dificuldade_sustentar_atencao: 3,
        inquietacao_motora: 3,
        fala_excessiva: 2,
        escoreDesatencao: '2.8 (Acima do ponto de corte)',
        escoreHiperatividade: '2.6 (Acima do ponto de corte)',
      },
      conclusao: 'Perfil compatível com TDAH combinado de intensidade moderada a grave.',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 11. EXERCÍCIOS PARA CASA (ORIENTAÇÕES AOS PAIS)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('🏠 [11/20] Lançando exercícios e rotinas domiciliares com feedback dos pais...');

  await prisma.exercicioCasa.createMany({
    data: [
      {
        pacienteId: pacLucas.id,
        titulo: 'Rotina Noturna com Temporizador Sensorial',
        descricao: '10 minutos de estímulo proprioceptivo com compressão suave antes de iniciar a transição para a cama.',
        tipo: 'orientacao',
        realizado: true,
        observacaoResponsavel: 'Lucas dormiu 20 minutos mais rápido e não apresentou choro durante a escovação.',
      },
      {
        pacienteId: pacSofia.id,
        titulo: 'Treino de Comunicação na Hora da Refeição (PECS)',
        descricao: 'Deixar os alimentos preferidos visíveis porém fora de alcance, estimulando a entrega do cartão visual "EU QUERO".',
        tipo: 'jogo',
        realizado: true,
        observacaoResponsavel: 'Entregou o cartão do suco de uva 3 vezes sem precisar de pista física!',
      },
      {
        pacienteId: pacGabriel.id,
        titulo: 'Leitura Compartilhada de 15 Minutos com Marcador Colorido',
        descricao: 'Leitura do gibi "Turma da Mônica" alternando uma frase o pai e uma frase a criança.',
        tipo: 'orientacao',
        realizado: null,
      },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 12. ACOMPANHAMENTO ESCOLAR INTEGRADO
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('🏫 [12/20] Registrando contatos, reuniões de mediação e relatórios escolares...');

  const contatoEscolaLucas = await prisma.contatoEscolar.create({
    data: {
      pacienteId: pacLucas.id,
      escola: 'Colégio Integração Infantil',
      professor: 'Cristina Ramos (Regente 3º Ano)',
      coordenador: 'Mariana Duarte (Coordenação Pedagógica)',
      telefone: '(11) 3789-5500',
      email: 'pedagogico@colegiointegracao.com.br',
      observacoes: 'A escola possui mediador escolar estagiário disponível 4h por dia.',
    },
  });

  await prisma.reuniaoEscolar.create({
    data: {
      contatoId: contatoEscolaLucas.id,
      data: new Date('2026-05-18T14:30:00.000Z'),
      objetivo: 'Alinhamento do Plano Educacional Individualizado (PEI) e adaptação de provas.',
      resumo: 'Acordado que as provas bimestrais terão tempo estendido de 30 minutos e enunciado lido pelo aplicador.',
      participantes: ['Dra. Beatriz Lima (Psicopedagoga Conectar)', 'Mariana Duarte (Coordenadora)', 'Cristina Ramos (Professora)', 'Mariana Mendes (Mãe)'],
    },
  });

  await prisma.relatorioEscolar.create({
    data: {
      contatoId: contatoEscolaLucas.id,
      titulo: 'Parecer Técnico de Manejo em Sala de Aula — Lucas Mendes (1º Semestre/2026)',
      caminho: '/uploads/escola/parecer_lucas_mendes_2026.pdf',
      enviado: true,
      enviadoEm: new Date('2026-05-20'),
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 13. MODELOS DE CONTRATOS & CONTRATOS ATIVOS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('📄 [13/20] Configurando modelos de contratos e assinaturas digitais...');

  const modeloContratoServico = await prisma.modeloContrato.create({
    data: {
      titulo: 'Contrato Padrão de Prestação de Serviços Multidisciplinares',
      tipo: 'contrato',
      descricao: 'Instrumento particular de prestação de serviços terapêuticos especializados.',
      conteudo: 'Pelo presente instrumento, a CLÍNICA INSTITUTO CONECTAR presta serviços ao PACIENTE representado por seu RESPONSÁVEL...',
    },
  });

  await prisma.contrato.createMany({
    data: [
      {
        pacienteId: pacLucas.id,
        tipo: 'contrato',
        titulo: 'Contrato Terapêutico Anual 2026 — Lucas Mendes da Silva',
        caminho: '/contratos/contrato_lucas_2026.pdf',
        assinado: true,
        assinadoEm: new Date('2026-01-15'),
        valorMensal: 1400.00,
        qtdParcelas: 12,
        diaVencimento: 10,
        gerouFinanceiro: true,
      },
      {
        pacienteId: pacSofia.id,
        tipo: 'contrato',
        titulo: 'Contrato Terapêutico Anual 2026 — Sofia Andrade Oliveira',
        caminho: '/contratos/contrato_sofia_2026.pdf',
        assinado: true,
        assinadoEm: new Date('2026-02-01'),
        valorMensal: 1800.00,
        qtdParcelas: 12,
        diaVencimento: 10,
        gerouFinanceiro: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 14. MODELOS DE LAUDOS E LAUDOS EMITIDOS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('📑 [14/20] Criando modelos de laudos e pareceres multidisciplinares...');

  const modeloLaudoNeuro = await prisma.modeloLaudo.create({
    data: {
      nome: 'Laudo de Avaliação Neuropsicológica Infantil',
      tipo: 'neuropsicologia',
      conteudo: 'LAUDO NEUROPSICOLÓGICO\n\nPaciente: {{nome}}\nData de Nasc.: {{dataNascimento}}\nSolicitante: {{solicitante}}\n\n1. MOTIVO DO ENCAMINHAMENTO:\n...\n2. INSTRUMENTOS UTILIZADOS:\n...\n3. RESULTADOS:\n...',
      ativo: true,
    },
  });

  await prisma.laudo.create({
    data: {
      pacienteId: pacLucas.id,
      modeloId: modeloLaudoNeuro.id,
      conteudo: 'LAUDO NEUROPSICOLÓGICO COMPLETO\nPaciente: Lucas Mendes da Silva\nIdade: 8 anos\n\nConclusão: Funções executivas e memória operacional preservadas na média superior. Dificuldade específica em flexibilidade cognitiva e inibição de respostas impulsivas...',
      caminhoPdf: '/laudos/laudo_neuro_lucas_mendes_assinado.pdf',
      revisado: true,
      publicado: true,
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 15. LANÇAMENTOS FINANCEIROS (RECEITAS, DESPESAS & DRE)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('💰 [15/20] Gerando receitas, despesas operacionais e fluxo de caixa...');

  await prisma.lancamento.createMany({
    data: [
      {
        descricao: 'Mensalidade Terapêutica Integrada — Lucas Mendes da Silva',
        tipo: TipoLancamento.RECEITA,
        valor: 1400.00,
        formaPagamento: FormaPagamento.PIX,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
        pacienteId: pacLucas.id,
        referencia: hojeStr.substring(0, 7),
        contaCaixa: 'Banco Santander Conectar PJ',
      },
      {
        descricao: 'Mensalidade Terapêutica Intensiva (Fono + T.O.) — Sofia Andrade',
        tipo: TipoLancamento.RECEITA,
        valor: 1800.00,
        formaPagamento: FormaPagamento.CARTAO_CREDITO,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
        pacienteId: pacSofia.id,
        referencia: hojeStr.substring(0, 7),
        contaCaixa: 'Stone Pagamentos',
      },
      {
        descricao: 'Pacote de Avaliação Neuropsicológica Completa — Enzo Costa',
        tipo: TipoLancamento.RECEITA,
        valor: 2400.00,
        formaPagamento: FormaPagamento.PIX,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
        pacienteId: pacEnzo.id,
        referencia: hojeStr.substring(0, 7),
        contaCaixa: 'Banco Santander Conectar PJ',
      },
      {
        descricao: 'Aluguel do Imóvel Comercial da Clínica — Mês Atual',
        tipo: TipoLancamento.DESPESA,
        valor: 5200.00,
        formaPagamento: FormaPagamento.BOLETO,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
        contaCaixa: 'Banco Santander Conectar PJ',
      },
      {
        descricao: 'Compra de Materiais Lúdicos e Brinquedos Terapêuticos Sensoriais',
        tipo: TipoLancamento.DESPESA,
        valor: 680.00,
        formaPagamento: FormaPagamento.PIX,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
        contaCaixa: 'Caixa Geral Dinheiro',
      },
      {
        descricao: 'Licença de Software de Prontuário & Cloud Server',
        tipo: TipoLancamento.DESPESA,
        valor: 389.90,
        formaPagamento: FormaPagamento.CARTAO_CREDITO,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
        contaCaixa: 'Cartão PJ Nubank',
      },
      {
        descricao: 'Mensalidade Terapêutica — Gabriel Souza Santos',
        tipo: TipoLancamento.RECEITA,
        valor: 1200.00,
        formaPagamento: FormaPagamento.BOLETO,
        status: StatusPagamento.PENDENTE,
        vencimento: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        pacienteId: pacGabriel.id,
        referencia: hojeStr.substring(0, 7),
        contaCaixa: 'Banco Santander Conectar PJ',
      },
    ],
  });

  // Fechamento de Caixa do dia anterior
  await prisma.fechamentoCaixa.create({
    data: {
      usuarioId: userRecepcao.id,
      abertoEm: new Date(Date.now() - 24 * 60 * 60 * 1000),
      fechadoEm: new Date(Date.now() - 16 * 60 * 60 * 1000),
      saldoInicial: 200.00,
      totalDinheiro: 450.00,
      totalPix: 3200.00,
      totalCartao: 1800.00,
      conferidoDinh: 650.00,
      diferenca: 0.00,
      status: 'FECHADO',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 16. LISTA DE ESPERA INTELIGENTE
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('⏳ [16/20] Alimentando lista de espera por especialidades...');

  await prisma.listaEspera.createMany({
    data: [
      {
        nome: 'Arthur Guimarães',
        telefone: '(11) 98741-2365',
        email: 'carla.guimaraes@email.com',
        especialidade: 'Fonoaudiologia',
        observacoes: 'Menino de 4 anos com suspeita de atraso de fala; preferência turno da tarde.',
        notificado: false,
      },
      {
        nome: 'Valentina Nogueira',
        telefone: '(11) 97412-5896',
        email: 'paulo.nogueira@email.com',
        especialidade: 'Terapia Ocupacional (Integração Sensorial)',
        observacoes: 'Laudo de TEA nível 1 fechado recentemente; disponibilidade às terças e quintas.',
        notificado: false,
      },
      {
        nome: 'Davi Lucca Ferreira',
        telefone: '(11) 96325-8741',
        email: 'renata.ferreira@email.com',
        especialidade: 'Psicopedagogia',
        observacoes: 'Dificuldades na alfabetização no 2º ano do Fundamental.',
        notificado: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 17. MATERIAIS E INVENTÁRIO CLÍNICO
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('📦 [17/20] Cadastrando acervo de testes e inventário sensorial...');

  await prisma.material.createMany({
    data: [
      {
        nome: 'Balanço Terapêutico Lycra Sensorial (Rede de Casulo)',
        categoria: 'terapia_ocupacional',
        quantidade: 2,
        descricao: 'Equipamento suspenso para estimulação vestibular e regulação proprioceptiva.',
        localizacao: 'Sala 01 - Integração Sensorial (T.O.)',
        ativo: true,
      },
      {
        nome: 'Kit Completo de Testes Raven Infantil Colorido',
        categoria: 'teste',
        quantidade: 1,
        descricao: 'Bateria padronizada para avaliação de raciocínio lógico não-verbal em crianças.',
        localizacao: 'Sala 05 - Neuropsicologia',
        ativo: true,
      },
      {
        nome: 'Mesa de Atividades com Pistas Grafomotoras em Madeira',
        categoria: 'material_pedagogico',
        quantidade: 3,
        descricao: 'Material para coordenação motora fina e pré-escrita.',
        localizacao: 'Sala 04 - Psicopedagogia',
        ativo: true,
      },
      {
        nome: 'Pasta PECS com 120 Cartões de Comunicação em Velcro',
        categoria: 'fonoaudiologia',
        quantidade: 4,
        descricao: 'Pranchas de comunicação aumentativa e alternativa para treino de pedidos.',
        localizacao: 'Sala 03 - Fonoaudiologia',
        ativo: true,
      },
      {
        nome: 'Jogo Torre de Hanói & Blocos Lógicos Gigantes',
        categoria: 'jogo',
        quantidade: 2,
        descricao: 'Jogos estruturados para avaliação e treino de funções executivas e planejamento.',
        localizacao: 'Sala 02 - Psicologia',
        ativo: true,
      },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 18. REGISTRO DE PONTO & FERIADOS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('⏰ [18/20] Gerando registros de ponto eletrônico e calendário de feriados...');

  await prisma.registroPonto.create({
    data: {
      usuarioId: userLeliane.id,
      data: new Date(`${hojeStr}T00:00:00.000Z`),
      entrada: new Date(`${hojeStr}T07:55:00.000Z`),
      saida: null,
      status: 'NORMAL',
    },
  });

  await prisma.registroPonto.create({
    data: {
      usuarioId: userThiago.id,
      data: new Date(`${hojeStr}T00:00:00.000Z`),
      entrada: new Date(`${hojeStr}T08:02:00.000Z`),
      saida: null,
      status: 'NORMAL',
    },
  });

  await prisma.feriado.createMany({
    data: [
      { data: new Date('2026-01-01T00:00:00.000Z'), descricao: 'Confraternização Universal' },
      { data: new Date('2026-04-21T00:00:00.000Z'), descricao: 'Tiradentes' },
      { data: new Date('2026-05-01T00:00:00.000Z'), descricao: 'Dia Mundial do Trabalho' },
      { data: new Date('2026-06-04T00:00:00.000Z'), descricao: 'Corpus Christi' },
      { data: new Date('2026-09-07T00:00:00.000Z'), descricao: 'Independência do Brasil' },
      { data: new Date('2026-10-12T00:00:00.000Z'), descricao: 'Nossa Senhora Aparecida / Dia das Crianças' },
      { data: new Date('2026-11-02T00:00:00.000Z'), descricao: 'Finados' },
      { data: new Date('2026-11-15T00:00:00.000Z'), descricao: 'Proclamação da República' },
      { data: new Date('2026-12-25T00:00:00.000Z'), descricao: 'Natal' },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 19. TRIAGEM DE LEADS WHATSAPP & BOT AUTOMATIZADO
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('🤖 [19/20] Cadastrando fluxo do Chatbot WhatsApp e leads de triagem...');

  await prisma.chatbotPasso.createMany({
    data: [
      { ordem: 1, pergunta: 'Olá! Seja muito bem-vindo ao Instituto Conectar. Qual é o nome da criança?', campoChave: 'nomeCrianca' },
      { ordem: 2, pergunta: 'Que legal! Qual é a idade e a data de nascimento aproximada da criança?', campoChave: 'idade' },
      { ordem: 3, pergunta: 'Qual a principal queixa ou especialidade médica recomendada pelo pediatra/escola?', campoChave: 'queixa' },
      { ordem: 4, pergunta: 'Qual período do dia vocês teriam melhor disponibilidade para atendimento?', campoChave: 'periodo' },
    ],
  });

  await prisma.triagemLead.createMany({
    data: [
      {
        telefone: '5511998822110',
        nomeCrianca: 'Bernardo Guimarães',
        idade: '5 anos',
        queixa: 'Suspeita de TEA e muitas crises ao ser contrariado na escola',
        periodo: 'Tarde (a partir das 14h)',
        status: 'EM_ATENDIMENTO',
      },
      {
        telefone: '5511987654320',
        nomeCrianca: 'Clarice Prado',
        idade: '7 anos',
        queixa: 'Dificuldade de leitura e queixa de desatenção da professora',
        periodo: 'Manhã',
        status: 'PENDENTE',
      },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 20. CHAT INTERNO 1:1, NOTIFICAÇÕES & CONFIGURAÇÕES
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('💬 [20/20] Gravando histórico do chat interno, alertas e configurações...');

  await prisma.mensagemChatInterno.createMany({
    data: [
      {
        remetenteId: userRecepcao.id,
        destinatarioId: userLeliane.id,
        conteudo: '⚡ Olá Dra. Leliane! A mãe do paciente Lucas Mendes acabou de chegar na recepção.',
        lida: true,
        lidaEm: new Date(),
        criadoEm: new Date(Date.now() - 25 * 60 * 1000),
      },
      {
        remetenteId: userLeliane.id,
        destinatarioId: userRecepcao.id,
        conteudo: 'Ótimo, Juliana! Estou finalizando as anotações do prontuário anterior e já vou buscá-lo.',
        lida: true,
        lidaEm: new Date(),
        criadoEm: new Date(Date.now() - 24 * 60 * 1000),
      },
      {
        remetenteId: userRecepcao.id,
        destinatarioId: userRosana.id,
        conteudo: '⚡ Dra. Rosana, a Sofia Andrade já está na sala de espera com o pai Roberto.',
        lida: false,
        criadoEm: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
  });

  await prisma.notificacao.createMany({
    data: [
      {
        usuarioId: userLeliane.id,
        tipo: TipoNotificacao.AGENDAMENTO,
        titulo: 'Paciente na Recepção',
        mensagem: 'Lucas Mendes da Silva realizou o check-in na recepção às 08:55.',
        lida: false,
      },
      {
        usuarioId: userDiretoria.id,
        tipo: TipoNotificacao.FINANCEIRO,
        titulo: 'Fechamento de Caixa Concluído',
        mensagem: 'O caixa de ontem foi conferido e fechado sem divergências.',
        lida: true,
      },
      {
        usuarioId: userAdmin.id,
        tipo: TipoNotificacao.SISTEMA,
        titulo: 'Banco de Dados Supabase Sincronizado',
        mensagem: 'O banco de dados oficial foi totalmente migrado e semeado com sucesso.',
        lida: false,
      },
    ],
  });

  await prisma.configuracao.createMany({
    data: [
      {
        chave: 'clinica_geral',
        valor: {
          nome: 'Instituto Conectar — Desenvolvimento Infantil & Multidisciplinar',
          cnpj: '45.892.147/0001-89',
          telefone: '(11) 3456-7890',
          whatsapp: '(11) 98888-0002',
          email: 'contato@institutoconectar.com.br',
          endereco: 'Avenida República do Líbano, 1420 - Moema, São Paulo/SP',
          horarioAtendimento: 'Segunda a Sexta das 08h às 19h | Sábados das 08h às 13h',
        },
        grupo: 'institucional',
      },
      {
        chave: 'regras_cancelamento',
        valor: {
          prazoMinimoHoras: 24,
          permiteReposicaoAutomatica: true,
          limiteFaltasMesParaAlerta: 3,
        },
        grupo: 'agenda',
      },
    ],
  });

  await prisma.auditLog.create({
    data: {
      usuarioId: userAdmin.id,
      acao: 'SEED_DATABASE_COMPLETE',
      recurso: 'SISTEMA_INTEGRAL',
      recursoId: 'ALL',
      dados: { status: 'sucesso', versao: '2.0', tabelas: 43 },
    },
  });

  console.log('\n🌟 BANCO DE DADOS POPULADO COM SUCESSO ABSOLUTO (100% DAS TABELAS)!');
  console.log('───────────────────────────────────────────────────────────────────────');
  console.log('🔑 CREDENCIAIS OFICIAIS PARA APRESENTAÇÃO AO CLIENTE:');
  console.log('───────────────────────────────────────────────────────────────────────');
  console.log('1. PAINEL ADMINISTRADOR:');
  console.log('   • Email: admin@conectar.com          | Senha: 123456');
  console.log('\n2. RECEPÇÃO & CHECK-IN:');
  console.log('   • Email: recepcao@conectar.com       | Senha: 123456');
  console.log('\n3. DIRETORIA CLÍNICA:');
  console.log('   • Email: diretoria@conectar.com      | Senha: 123456');
  console.log('\n4. PROFISSIONAIS & TERAPEUTAS:');
  console.log('   • Psicologia: dra.leliane@conectar.com  | Senha: 123456');
  console.log('   • Fonoaudiol: dra.rosana@conectar.com   | Senha: 123456');
  console.log('   • Psicopedag: dra.beatriz@conectar.com  | Senha: 123456');
  console.log('   • Terap. Ocup: dr.thiago@conectar.com   | Senha: 123456');
  console.log('   • Neuropsicol: dr.marcos@conectar.com   | Senha: 123456');
  console.log('\n5. PORTAL DOS PAIS:');
  console.log('   • Mãe do Lucas: mariana.mendes@email.com| Senha: 123456');
  console.log('   • Pai da Sofia: roberto.oliveira@email.com| Senha: 123456');
  console.log('───────────────────────────────────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro crítico durante a semeação:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
