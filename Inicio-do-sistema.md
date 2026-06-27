# Sistema de Gestão Clínica — Instituto Conectar

Plataforma completa de gestão para clínica especializada no atendimento de crianças com dificuldades de aprendizagem (TDAH, TEA, Dislexia, Discalculia e afins). O sistema centraliza toda a operação clínica: agendamento, prontuário, financeiro, comunicação, relatórios e IA.

---

## User Review Required

> [!IMPORTANT]
> Este é um sistema de grande escala com 27+ módulos. A implementação será feita em **fases progressivas**, priorizando o núcleo operacional primeiro. Confirme a ordem de prioridade das fases abaixo antes de iniciarmos.

> [!WARNING]
> Integrações externas (WhatsApp via `whatsapp-web.js`, OpenAI/Gemini para IA, e envio de e-mails via Nodemailer) exigem credenciais e contas ativas do usuário. Essas partes serão estruturadas, mas não configuradas automaticamente.

> [!CAUTION]
> Assinatura digital de documentos e emissão de notas fiscais (NF-e) são funcionalidades que dependem de serviços de terceiros (ex: DocuSign, eCNPJ, prefeitura municipal). Serão desenhadas como integrações plugáveis.

---

## Open Questions

> [!IMPORTANT]
> **Q1 — Implantação inicial:** Você quer que eu inicie o projeto completo (monorepo com frontend + backend + serviços) ou prefere começar apenas pelo **frontend (Next.js)** com dados mockados para validar o design e o fluxo antes de conectar o backend?

> [!IMPORTANT]
> **Q2 — Multi-tenant (SaaS):** O sistema deve suportar **múltiplas clínicas** desde o início (multi-tenant), ou será para uso exclusivo do Instituto Conectar por enquanto?

> [!IMPORTANT]
> **Q3 — Provedor de IA:** Para os recursos de IA (geração de laudos, resumo de sessões, sugestões terapêuticas), qual provedor você prefere: **OpenAI (GPT-4o)**, **Google Gemini**, ou **Ollama** (open-source, roda na própria VPS)?

---

## Arquitetura Geral

```
                    Internet
                        │
                  HTTPS / SSL
                        │
                     Nginx
                        │
        ┌───────────────┼────────────────┐
        │               │                │
   Next.js 15      NestJS API     WhatsApp Service
  (Frontend)        (Backend)     (whatsapp-web.js)
        │               │                │
        └───────────────┼────────────────┘
                        │
                     Redis
              (Cache + BullMQ + Pub/Sub)
                        │
        ┌───────────────┼────────────────┐
        │               │                │
 PostgreSQL        AI Service      Socket.IO
  + Prisma      (OpenAI/Gemini)   (Tempo real)
        │
   Storage Local
 (/storage na VPS)
```

---

## Estrutura do Monorepo

```
conectar/
│
├── apps/
│   ├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS 4
│   ├── backend/           # NestJS + Prisma + PostgreSQL
│   ├── whatsapp-service/  # whatsapp-web.js microserviço
│   └── ai-service/        # OpenAI/Gemini/Ollama microserviço
│
├── packages/
│   ├── ui/                # Shadcn/UI + componentes compartilhados
│   ├── types/             # TypeScript types/interfaces compartilhados
│   ├── utils/             # Utilitários compartilhados
│   ├── config/            # Configurações compartilhadas
│   └── shared/            # Lógica de negócio compartilhada
│
├── storage/               # Armazenamento local na VPS
│   ├── pacientes/
│   ├── profissionais/
│   ├── laudos/
│   ├── exames/
│   ├── contratos/
│   ├── relatorios/
│   ├── anexos/
│   ├── whatsapp/
│   ├── temp/
│   └── backups/
│
├── docker/
│   ├── nginx/
│   ├── postgres/
│   └── redis/
│
├── scripts/               # Scripts de setup, backup, migração
├── docker-compose.yml
├── docker-compose.prod.yml
├── turbo.json             # Turborepo
└── README.md
```

---

## Fases de Implementação

### 🔴 FASE 1 — Fundação do Projeto (Semana 1)
Configuração do monorepo, infraestrutura Docker, autenticação e design system.

#### [NEW] Raiz do Monorepo
- `package.json` — Workspaces com pnpm
- `turbo.json` — Pipeline Turborepo
- `docker-compose.yml` — PostgreSQL, Redis, Nginx

#### [NEW] `apps/frontend/`
- Next.js 15 com TypeScript, Tailwind CSS 4, Shadcn/UI
- Design system com cores do Instituto Conectar
- Layout base com sidebar, header, dark/light mode
- Página de login com JWT + Refresh Token

#### [NEW] `apps/backend/`
- NestJS com Prisma ORM
- Schema PostgreSQL com todas as entidades
- Módulo de autenticação (JWT, BCrypt, Refresh Token, Cookies HttpOnly)
- Módulo de usuários e permissões (RBAC)
- Swagger configurado

---

### 🟠 FASE 2 — Módulos Core (Semanas 2–3)

#### [NEW] Módulo: Pacientes
- Cadastro completo (dados pessoais, foto, escola, responsáveis)
- Informações médicas (diagnósticos, CID, alergias, medicamentos, convênio)
- Listagem com busca full-text (nome, CPF, escola, responsável)
- Perfil detalhado do paciente com abas

#### [NEW] Módulo: Profissionais
- Cadastro de todos os tipos (Psicólogo, Psicopedagogo, Fono, TO, etc.)
- Registro de conselho (CRP, CREFITO, CREFONO)
- Horários de trabalho e salas vinculadas

#### [NEW] Módulo: Agenda Inteligente
- FullCalendar com drag-and-drop
- Multi-resource (por profissional e sala)
- Visão diária, semanal, mensal
- Tipos: presencial / online
- Repetição semanal, bloqueios, férias, almoço
- Lista de espera
- Confirmação de presença
- Integração Socket.IO (atualização em tempo real)

#### [NEW] Módulo: Salas
- Cadastro de salas
- Controle de disponibilidade em tempo real
- Prevenção de conflitos de agendamento

---

### 🟡 FASE 3 — Clínica Digital (Semanas 4–5)

#### [NEW] Módulo: Prontuário Eletrônico
- Registro por sessão com data, profissional, observações
- Campos: objetivos, atividades, resultados, comportamento, orientações aos pais, próxima meta
- Controle de acesso por profissional
- Histórico ordenado cronologicamente

#### [NEW] Módulo: Avaliações
- Anamnese configurável
- Avaliação Psicopedagógica, Neuropsicológica, Desenvolvimento Infantil
- Testes e Escalas com perguntas configuráveis

#### [NEW] Módulo: Plano Terapêutico
- Metas por paciente com % de progresso
- Gráficos Recharts de evolução
- Status (em andamento, concluída, pausada)

#### [NEW] Módulo: Frequência
- Registro de presença por sessão
- Status: Presente, Faltou, Falta Justificada, Cancelado, Reposição
- Relatório de frequência por paciente e período

---

### 🟢 FASE 4 — Financeiro & Documentos (Semanas 6–7)

#### [NEW] Módulo: Financeiro
- Lançamento de receitas e despesas
- Formas de pagamento: PIX, Cartão, Dinheiro, Convênio
- Mensalidades e pacotes de sessões
- Fluxo de caixa, comissões, inadimplência
- Dashboard financeiro com Recharts

#### [NEW] Módulo: Contratos & Documentos
- Upload e armazenamento de contratos, LGPD, autorizações
- Assinatura digital (plugável)
- Gerador de laudos, declarações, recibos em PDF

#### [NEW] Módulo: Arquivos
- Upload de PDFs, imagens, exames, vídeos, áudios
- Vinculados ao paciente
- React Dropzone + visualizador PDF

---

### 🔵 FASE 5 — Relatórios & Comunicação (Semana 8)

#### [NEW] Módulo: Relatórios
- Relatórios de pacientes (ativos, inativos, novos)
- Relatórios financeiros (receita, despesa, lucro, mensal, anual)
- Relatórios de atendimento (por profissional, sala, período)
- Relatórios de faltas e reposições
- Exportação PDF e Excel

#### [NEW] Módulo: Comunicação
- Envio de WhatsApp (confirmação, lembrete, cobrança, aniversário)
- E-mail via Nodemailer
- Notificações em tempo real via Socket.IO
- Templates configuráveis

---

### 🟣 FASE 6 — Portais & Funcionalidades Avançadas (Semana 9)

#### [NEW] Portal dos Pais
- Login separado para responsáveis
- Visualização de: agenda, relatórios, laudos, pagamentos, mensagens
- Exercícios para casa (PDF, vídeo, imagem)
- Marcar exercício como concluído/não realizado

#### [NEW] Portal dos Profissionais
- Login com permissões por perfil
- Acesso à agenda, pacientes, evoluções, documentos

#### [NEW] Módulo: Lista de Espera
- Gerenciamento de fila
- Envio automático de convite quando vaga abrir

#### [NEW] Módulo: Controle Escolar
- Registro de escola, professor, coordenador
- Relatórios enviados, reuniões, observações

---

### ⚫ FASE 7 — IA & Diferenciais (Semana 10)

#### [NEW] `apps/ai-service/`
- Integração OpenAI/Gemini/Ollama
- Resumo automático de sessões
- Sugestão de plano terapêutico
- Identificação de regressões
- Geração automática de laudos (para revisão)
- Comparação de evolução mensal
- Sugestão de atividades por objetivo
- Alertas de baixa adesão

#### [NEW] Módulo: QR Code Check-in
- Geração de QR Code por paciente
- Leitura via html5-qrcode na recepção
- Confirmação automática de presença

#### [NEW] `apps/whatsapp-service/`
- Bot completo com menu de atendimento
- Identificação de paciente por CPF/telefone
- Agendamento, remarcar, cancelar via WhatsApp
- Consulta de pagamentos e envio de PIX

---

### ⬛ FASE 8 — Segurança, LGPD & Infra (Semana 11)

#### [NEW] Módulo: Auditoria
- Log de todas as ações (login, alterações, exclusões)
- IP, navegador, usuário, data/hora

#### [NEW] Módulo: LGPD
- Controle de consentimento
- Registro de acesso a dados sensíveis
- Histórico de alterações
- Criptografia de dados sensíveis

#### [NEW] Módulo: Backup
- pg_dump automático (diário, semanal, mensal)
- Compressão tar.gz dos arquivos
- Retenção configurável

#### [NEW] Módulo: Monitoramento
- Health check de todos os serviços
- Dashboard de uso (CPU, memória, disco)
- Status: Redis, PostgreSQL, WhatsApp, IA

---

## Stack Tecnológico Consolidado

| Camada | Tecnologia |
|--------|-----------|
| Frontend | Next.js 15, TypeScript, Tailwind CSS 4, Shadcn/UI, Framer Motion |
| Estado | TanStack Query, Zustand |
| Formulários | React Hook Form + Zod |
| Calendário | FullCalendar (drag-and-drop, multi-resource) |
| Tabelas | TanStack Table |
| Gráficos | Recharts |
| Backend | NestJS, TypeScript |
| ORM | Prisma |
| Banco | PostgreSQL (JSONB, Full-text Search, Triggers) |
| Cache | Redis |
| Filas | BullMQ |
| Tempo real | Socket.IO |
| Auth | JWT + Refresh Token + HttpOnly Cookies + BCrypt |
| Upload | Multer + React Dropzone |
| PDF | React PDF Viewer + Puppeteer (geração) |
| WhatsApp | whatsapp-web.js (microserviço) |
| Email | Nodemailer |
| IA | OpenAI / Gemini / Ollama (microserviço) |
| Infra | Docker + Docker Compose + Nginx |
| Docs | Swagger |
| Logs | Winston |
| Segurança | Helmet, CORS, Rate Limit |

---

## Perfis de Acesso (RBAC)

| Perfil | Acesso |
|--------|--------|
| Administrador | Total |
| Diretor | Total exceto configurações técnicas |
| Coordenador | Pacientes, agenda, relatórios, equipe |
| Recepção | Agenda, cadastro básico, financeiro básico |
| Financeiro | Módulo financeiro completo |
| Psicólogo | Seus pacientes, prontuário, agenda |
| Psicopedagogo | Seus pacientes, prontuário, agenda |
| Neuropsicólogo | Seus pacientes, prontuário, avaliações |
| Fonoaudiólogo | Seus pacientes, prontuário, agenda |
| Terapeuta Ocupacional | Seus pacientes, prontuário, agenda |
| Pedagogo | Seus pacientes, prontuário, relatórios escolares |
| Supervisor | Todos os prontuários (leitura) |
| Pais | Portal dos pais (somente seus filhos) |

---

## Plano de Verificação

### Testes Automatizados
- `pnpm test` — Jest para backend (unit + integration)
- `pnpm test:e2e` — Playwright para fluxos críticos (agendamento, login, prontuário)
- Validação do schema Prisma com `prisma validate`

### Verificação Manual
- Dashboard responsivo e funcional (dark/light mode)
- Fluxo completo: Cadastrar paciente → Agendar → Registrar prontuário → Gerar laudo
- Agenda com drag-and-drop funcionando
- Relatório financeiro exportando PDF
- Portal dos pais acessando dados corretos

---

## Recomendação de Início

Sugiro começar pela **Fase 1** imediatamente após sua aprovação:

1. Inicializar o monorepo com **pnpm + Turborepo**
2. Criar o **frontend Next.js** com design system do Instituto Conectar
3. Criar o **backend NestJS** com schema completo do Prisma
4. Subir o ambiente Docker local (PostgreSQL + Redis)
5. Implementar autenticação e dashboard

Isso te dará uma base sólida e funcional para evoluir progressivamente.
