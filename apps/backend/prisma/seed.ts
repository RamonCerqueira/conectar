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
} from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando semeação completa do banco de dados do Instituto Conectar...');

  const hashedPassword = await bcrypt.hash('123456', 10);

  // ─────────────────────────────────────────────────────────────────────────────
  // 1. USUÁRIOS E PERFIS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('👤 Criando usuários do sistema...');

  const admin = await prisma.usuario.upsert({
    where: { email: 'admin@conectar.com' },
    update: { senha: hashedPassword },
    create: {
      nome: 'Administrador Conectar',
      email: 'admin@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.ADMINISTRADOR,
      ativo: true,
      telefone: '(11) 98888-0001',
    },
  });

  const recepcao = await prisma.usuario.upsert({
    where: { email: 'recepcao@conectar.com' },
    update: { senha: hashedPassword },
    create: {
      nome: 'Recepção Principal',
      email: 'recepcao@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.RECEPCAO,
      ativo: true,
      telefone: '(11) 98888-0002',
    },
  });

  const diretor = await prisma.usuario.upsert({
    where: { email: 'diretoria@conectar.com' },
    update: { senha: hashedPassword },
    create: {
      nome: 'Dra. Helena Diretora',
      email: 'diretoria@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.DIRETOR,
      ativo: true,
      telefone: '(11) 98888-0003',
    },
  });

  // Usuários Terapeutas/Profissionais
  const userLeliane = await prisma.usuario.upsert({
    where: { email: 'dra.leliane@conectar.com' },
    update: { senha: hashedPassword },
    create: {
      nome: 'Dra. Leliane Rocha',
      email: 'dra.leliane@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.PSICOLOGO,
      ativo: true,
      telefone: '(11) 97777-1001',
    },
  });

  const userBeatriz = await prisma.usuario.upsert({
    where: { email: 'dra.beatriz@conectar.com' },
    update: { senha: hashedPassword },
    create: {
      nome: 'Dra. Beatriz Lima',
      email: 'dra.beatriz@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.PSICOPEDAGOGO,
      ativo: true,
      telefone: '(11) 97777-1002',
    },
  });

  const userRosana = await prisma.usuario.upsert({
    where: { email: 'dra.rosana@conectar.com' },
    update: { senha: hashedPassword },
    create: {
      nome: 'Dra. Rosana Alves',
      email: 'dra.rosana@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.FONOAUDIOLOGO,
      ativo: true,
      telefone: '(11) 97777-1003',
    },
  });

  const userThiago = await prisma.usuario.upsert({
    where: { email: 'dr.thiago@conectar.com' },
    update: { senha: hashedPassword },
    create: {
      nome: 'Dr. Thiago Martins',
      email: 'dr.thiago@conectar.com',
      senha: hashedPassword,
      perfil: PerfilUsuario.TERAPEUTA_OCUPACIONAL,
      ativo: true,
      telefone: '(11) 97777-1004',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 2. SALAS DE ATENDIMENTO
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('🏛️ Criando salas de atendimento...');

  let sala1 = await prisma.sala.findFirst({ where: { nome: 'Sala 01 - Integração Sensorial (T.O.)' } });
  if (!sala1) {
    sala1 = await prisma.sala.create({
      data: {
        id: 'sala-1',
        nome: 'Sala 01 - Integração Sensorial (T.O.)',
        descricao: 'Equipada com balanços, piscina de bolinhas e textura para T.O.',
        capacidade: 2,
        cor: '#3b82f6',
        status: StatusSala.DISPONIVEL,
      },
    });
  }

  let sala2 = await prisma.sala.findFirst({ where: { nome: 'Sala 02 - Psicologia e Ludoterapia' } });
  if (!sala2) {
    sala2 = await prisma.sala.create({
      data: {
        id: 'sala-2',
        nome: 'Sala 02 - Psicologia e Ludoterapia',
        descricao: 'Ambiente acolhedor com jogos lúdicos e espaço de escuta.',
        capacidade: 3,
        cor: '#8b5cf6',
        status: StatusSala.DISPONIVEL,
      },
    });
  }

  let sala3 = await prisma.sala.findFirst({ where: { nome: 'Sala 03 - Fonoaudiologia & Cabine' } });
  if (!sala3) {
    sala3 = await prisma.sala.create({
      data: {
        id: 'sala-3',
        nome: 'Sala 03 - Fonoaudiologia & Cabine',
        descricao: 'Cabine de audiometria e material de estimulação de fala.',
        capacidade: 2,
        cor: '#ec4899',
        status: StatusSala.DISPONIVEL,
      },
    });
  }

  let sala4 = await prisma.sala.findFirst({ where: { nome: 'Sala 04 - Psicopedagogia & Aprendizagem' } });
  if (!sala4) {
    sala4 = await prisma.sala.create({
      data: {
        id: 'sala-4',
        nome: 'Sala 04 - Psicopedagogia & Aprendizagem',
        descricao: 'Mesa de atividades, computadores para biofeedback e materiais didáticos.',
        capacidade: 4,
        cor: '#10b981',
        status: StatusSala.DISPONIVEL,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 3. PROFISSIONAIS & ALOCAÇÕES
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('👨‍⚕️ Criando profissionais e vinculando às salas...');

  const profLeliane = await prisma.profissional.upsert({
    where: { usuarioId: userLeliane.id },
    update: {},
    create: {
      usuarioId: userLeliane.id,
      tipo: TipoProfissional.PSICOLOGO,
      especialidade: 'Terapia Cognitivo-Comportamental (TCC) e TEA',
      especialidades: ['TCC Infantil', 'Autismo', 'Regulação Emocional'],
      registro: 'CRP 06/145892',
      orgaoRegistro: 'CRP SP',
      cor: '#8b5cf6',
      bio: 'Especialista em Análise do Comportamento Aplicada (ABA) e intervenção precoce.',
    },
  });

  const profBeatriz = await prisma.profissional.upsert({
    where: { usuarioId: userBeatriz.id },
    update: {},
    create: {
      usuarioId: userBeatriz.id,
      tipo: TipoProfissional.PSICOPEDAGOGO,
      especialidade: 'Dificuldades de Aprendizagem, Dislexia e Discalculia',
      especialidades: ['Psicopedagogia Clínica', 'Neuropsicopedagogia'],
      registro: 'ABPp 4521/SP',
      orgaoRegistro: 'ABPp',
      cor: '#10b981',
      bio: 'Mestre em Educação Especial com 10 anos de experiência em alfabetização atípica.',
    },
  });

  const profRosana = await prisma.profissional.upsert({
    where: { usuarioId: userRosana.id },
    update: {},
    create: {
      usuarioId: userRosana.id,
      tipo: TipoProfissional.FONOAUDIOLOGO,
      especialidade: 'Linguagem, Apraxia de Fala Infantil e Deglutição',
      especialidades: ['Comunicação Alternativa (PECS)', 'Fonoaudiologia Neurofuncional'],
      registro: 'CRFa 2-18965',
      orgaoRegistro: 'CRFa 2ª Região',
      cor: '#ec4899',
      bio: 'Certificada no Método PROMPT para Apraxia de Fala Infantil.',
    },
  });

  const profThiago = await prisma.profissional.upsert({
    where: { usuarioId: userThiago.id },
    update: {},
    create: {
      usuarioId: userThiago.id,
      tipo: TipoProfissional.TERAPEUTA_OCUPACIONAL,
      especialidade: 'Integração Sensorial de Ayres e Autonomia Infantil',
      especialidades: ['Integração Sensorial', 'Atividades da Vida Diária (AVD)'],
      registro: 'CREFITO 3/98745-TO',
      orgaoRegistro: 'CREFITO-3',
      cor: '#3b82f6',
      bio: 'Especialista em desenvolvimento motor fino e adequação postural.',
    },
  });

  // Vincular profissionais às salas
  await prisma.profissionalSala.deleteMany({});
  await prisma.profissionalSala.createMany({
    data: [
      { profissionalId: profLeliane.id, salaId: sala2.id },
      { profissionalId: profBeatriz.id, salaId: sala4.id },
      { profissionalId: profRosana.id, salaId: sala3.id },
      { profissionalId: profThiago.id, salaId: sala1.id },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 4. PACIENTES E RESPONSÁVEIS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('👶 Criando pacientes e responsáveis...');

  const paciente1 = await prisma.paciente.upsert({
    where: { cpf: '458.962.130-11' },
    update: {},
    create: {
      id: 'pac-lucas',
      nome: 'Lucas Mendes da Silva',
      cpf: '458.962.130-11',
      sexo: Sexo.MASCULINO,
      dataNascimento: new Date('2017-06-14'),
      status: StatusPaciente.ATIVO,
      alergias: ['Proteína do Leite de Vaca (APLV)'],
      medicamentos: ['Ritalina LA 10mg'],
      escola: 'Colégio Integração Infantil',
      serie: '3º ano do Ensino Fundamental I',
    },
  });

  const paciente2 = await prisma.paciente.upsert({
    where: { cpf: '512.369.870-22' },
    update: {},
    create: {
      id: 'pac-sofia',
      nome: 'Sofia Andrade Oliveira',
      cpf: '512.369.870-22',
      sexo: Sexo.FEMININO,
      dataNascimento: new Date('2019-11-20'),
      status: StatusPaciente.ATIVO,
      escola: 'Escola Infantil Sementinhas',
      serie: 'Jardim II',
    },
  });

  const paciente3 = await prisma.paciente.upsert({
    where: { cpf: '369.852.140-33' },
    update: {},
    create: {
      id: 'pac-gabriel',
      nome: 'Gabriel Souza Santos',
      cpf: '369.852.140-33',
      sexo: Sexo.MASCULINO,
      dataNascimento: new Date('2015-02-08'),
      status: StatusPaciente.ATIVO,
      escola: 'Escola Estadual Monteiro Lobato',
      serie: '5º ano do Ensino Fundamental I',
    },
  });

  // Responsáveis
  let respLucas = await prisma.responsavel.findFirst({ where: { email: 'mariana.mendes@email.com' } });
  if (!respLucas) {
    respLucas = await prisma.responsavel.create({
      data: {
        nome: 'Mariana Mendes da Silva',
        email: 'mariana.mendes@email.com',
        senhaPortal: hashedPassword,
        ativoPortal: true,
        pacienteId: paciente1.id,
        grauParent: TipoResponsavel.MAE,
        telefone: '(11) 99123-4567',
        profissao: 'Engenheira de Software',
        isPrincipal: true,
      },
    });
  }

  let respSofia = await prisma.responsavel.findFirst({ where: { email: 'roberto.oliveira@email.com' } });
  if (!respSofia) {
    respSofia = await prisma.responsavel.create({
      data: {
        nome: 'Roberto Oliveira',
        email: 'roberto.oliveira@email.com',
        senhaPortal: hashedPassword,
        ativoPortal: true,
        pacienteId: paciente2.id,
        grauParent: TipoResponsavel.PAI,
        telefone: '(11) 99876-5432',
        profissao: 'Advogado',
        isPrincipal: true,
      },
    });
  }

  // ─────────────────────────────────────────────────────────────────────────────
  // 5. AGENDAMENTOS DE CONSULTAS
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('📅 Criando agendamentos de atendimento...');

  const hojeStr = new Date().toISOString().split('T')[0];

  await prisma.agendamento.deleteMany({});

  await prisma.agendamento.create({
    data: {
      pacienteId: paciente1.id,
      profissionalId: profLeliane.id,
      salaId: sala2.id,
      data: new Date(`${hojeStr}T09:00:00.000Z`),
      dataFim: new Date(`${hojeStr}T09:50:00.000Z`),
      status: StatusAgendamento.PRESENTE,
      tipo: TipoAtendimento.PRESENCIAL,
      observacoes: 'Sessão focada em regulação emocional durante os jogos.',
    },
  });

  await prisma.agendamento.create({
    data: {
      pacienteId: paciente2.id,
      profissionalId: profRosana.id,
      salaId: sala3.id,
      data: new Date(`${hojeStr}T10:00:00.000Z`),
      dataFim: new Date(`${hojeStr}T10:50:00.000Z`),
      status: StatusAgendamento.CONFIRMADO,
      tipo: TipoAtendimento.PRESENCIAL,
      observacoes: 'Treino de articulação dos fonemas /r/ e /l/.',
    },
  });

  await prisma.agendamento.create({
    data: {
      pacienteId: paciente3.id,
      profissionalId: profBeatriz.id,
      salaId: sala4.id,
      data: new Date(`${hojeStr}T14:00:00.000Z`),
      dataFim: new Date(`${hojeStr}T14:50:00.000Z`),
      status: StatusAgendamento.AGENDADO,
      tipo: TipoAtendimento.PRESENCIAL,
      observacoes: 'Raciocínio lógico-matemático com blocos lógicos.',
    },
  });

  await prisma.agendamento.create({
    data: {
      pacienteId: paciente1.id,
      profissionalId: profThiago.id,
      salaId: sala1.id,
      data: new Date(`${hojeStr}T15:30:00.000Z`),
      dataFim: new Date(`${hojeStr}T16:20:00.000Z`),
      status: StatusAgendamento.AGENDADO,
      tipo: TipoAtendimento.PRESENCIAL,
      observacoes: 'Estimulação vestibuloproproprioceptiva.',
    },
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 6. PRONTUÁRIOS ELETRÔNICOS E PLANO TERAPÊUTICO
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('📝 Criando prontuários e metas terapêuticas...');

  await prisma.prontuario.deleteMany({});
  await prisma.prontuario.create({
    data: {
      pacienteId: paciente1.id,
      profissionalId: profLeliane.id,
      queixaPrincipal: 'Dificuldade de manter o foco e reagir com calmaria ao perder jogos.',
      objetivosSessao: 'Trabalhar a tolerância à frustração ao perder nos jogos de tabuleiro.',
      atividadesRealizadas: 'Jogo da Memória e Quebra-cabeça com regras modificadas.',
      resultados: 'O paciente apresentou autorregulação com auxílio de cartões visuais.',
      orientacoesPais: 'Manter a rotina de apoio visual em casa nos horários de transição.',
      proximaMeta: 'Iniciar treino de autodescrição de estados emocionais.',
    },
  });

  // Metas Terapêuticas do Lucas
  await prisma.planoTerapeutico.deleteMany({});
  const planoTerapeutico = await prisma.planoTerapeutico.create({
    data: {
      pacienteId: paciente1.id,
      titulo: 'Plano Terapêutico Integrado 2026 — Lucas Mendes',
      descricao: 'Desenvolver autonomia social, regulação emocional e comunicação assertiva.',
    },
  });

  await prisma.metaTerapeutica.createMany({
    data: [
      {
        planoId: planoTerapeutico.id,
        objetivo: 'Aumentar o tempo de atenção sustentada nas tarefas escolares para 25 min',
        descricao: 'Treino de foco com timer visual Pomodoro infantil.',
        progresso: 75,
        status: StatusMeta.EM_ANDAMENTO,
      },
      {
        planoId: planoTerapeutico.id,
        objetivo: 'Identificar e nomear 4 emoções básicas (Alegria, Tristeza, Raiva, Medo)',
        descricao: 'Uso de termômetro das emoções.',
        progresso: 100,
        status: StatusMeta.CONCLUIDO,
      },
      {
        planoId: planoTerapeutico.id,
        objetivo: 'Aceitar a troca de atividades sem crises de autorregulação',
        descricao: 'Uso de avisos prévios de transição (5 min e 2 min).',
        progresso: 50,
        status: StatusMeta.EM_ANDAMENTO,
      },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 7. LANÇAMENTOS FINANCEIROS & DRE
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('💰 Criando lançamentos financeiros...');

  await prisma.lancamento.deleteMany({});
  await prisma.lancamento.createMany({
    data: [
      {
        descricao: 'Mensalidade Pacote Terapêutico — Lucas Mendes da Silva',
        tipo: TipoLancamento.RECEITA,
        valor: 1400.00,
        formaPagamento: FormaPagamento.PIX,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
        pacienteId: paciente1.id,
      },
      {
        descricao: 'Avaliação Neuropsicológica — Sofia Andrade Oliveira',
        tipo: TipoLancamento.RECEITA,
        valor: 1800.00,
        formaPagamento: FormaPagamento.CARTAO_CREDITO,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
        pacienteId: paciente2.id,
      },
      {
        descricao: 'Compra de Jogos Terapêuticos e Materiais Lúdicos (Empório do Brinquedo)',
        tipo: TipoLancamento.DESPESA,
        valor: 450.00,
        formaPagamento: FormaPagamento.PIX,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
      },
      {
        descricao: 'Aluguel do Imóvel da Clínica — Julho/2026',
        tipo: TipoLancamento.DESPESA,
        valor: 4500.00,
        formaPagamento: FormaPagamento.BOLETO,
        status: StatusPagamento.PAGO,
        vencimento: new Date(`${hojeStr}T00:00:00.000Z`),
        pagamento: new Date(`${hojeStr}T00:00:00.000Z`),
      },
    ],
  });

  // ─────────────────────────────────────────────────────────────────────────────
  // 8. CHAT INTERNO 1:1 (MENSAGENS ENTRE RECEPÇÃO E PROFISSIONAIS)
  // ─────────────────────────────────────────────────────────────────────────────
  console.log('💬 Criando histórico de mensagens no Chat Interno 1:1...');

  await prisma.mensagemChatInterno.deleteMany({});
  await prisma.mensagemChatInterno.createMany({
    data: [
      {
        remetenteId: recepcao.id,
        destinatarioId: userLeliane.id,
        conteudo: '⚡ O paciente Lucas Mendes acabou de chegar na recepção.',
        lida: true,
        lidaEm: new Date(),
        criadoEm: new Date(Date.now() - 30 * 60 * 1000),
      },
      {
        remetenteId: userLeliane.id,
        destinatarioId: recepcao.id,
        conteudo: 'Perfeito! Já estou buscando o paciente na recepção.',
        lida: true,
        lidaEm: new Date(),
        criadoEm: new Date(Date.now() - 28 * 60 * 1000),
      },
      {
        remetenteId: recepcao.id,
        destinatarioId: userRosana.id,
        conteudo: '⚡ Próximo paciente Sofia Andrade aguardando na sala de espera.',
        lida: false,
        criadoEm: new Date(Date.now() - 5 * 60 * 1000),
      },
    ],
  });

  console.log('\n✨ BANCO DE DADOS SEMEADO COM SUCESSO!');
  console.log('──────────────────────────────────────────────────────────────');
  console.log('🔑 CREDENCIAIS DE ACESSO PARA TESTES:');
  console.log('• Admin:       admin@conectar.com     | Senha: 123456');
  console.log('• Recepção:    recepcao@conectar.com  | Senha: 123456');
  console.log('• Diretoria:   diretoria@conectar.com | Senha: 123456');
  console.log('• Psicóloga:   dra.leliane@conectar.com| Senha: 123456');
  console.log('• Fono:        dra.rosana@conectar.com| Senha: 123456');
  console.log('• Portal Pais: mariana.mendes@email.com| Senha: 123456');
  console.log('──────────────────────────────────────────────────────────────\n');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante a semeação:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
