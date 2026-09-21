# 🚀 ROADMAP OFICIAL — SISTEMA CONECTAR (META: 100% TOTAL)

> **REGRA CRÍTICA DE EXECUÇÃO OBRIGATÓRIA**:
> Toda vez que este projeto for aberto, ou o usuário enviar mensagens como *"continuar"*, *"continue"*, *"prossiga"* ou vazias, o agente de IA é **OBRIGADO** a:
> 1. Ler este arquivo (`ROADMAP_100.md`).
> 2. Localizar o primeiro item marcado como `[ ]` (pendente) ou `[/]` (em andamento).
> 3. Implementar a solução completa (código backend + frontend).
> 4. Testar a compilação e funcionamento.
> 5. Atualizar o status do item para `[x]` (concluído) e salvar este arquivo.
> 6. Prosseguir imediatamente para o próximo item até alcançar 100%.

---

## 📊 Progresso Geral de Completude

- **Status Inicial**: 78% (Módulos estruturados, alguns com dados mockados)
- **Status Atual**: 84%
- **Meta Final**: 100% (Todos os 19 módulos 100% integrados ao banco de dados e operacionais)

```
[█████████████████░░░] 84% Concluído
```

---

## 📋 Lista Mestra de Tarefas (1 a 24)

### 🔹 FASE 1: Conexão Real de Dados e Persistência (Substituição de Mocks)
- [x] **Tarefa 01** — **Acompanhamento Escolar**: Conectar `escolar-page.tsx` aos endpoints do backend (`GET /escolar`, `POST /escolar/contatos`, `POST /escolar/reunioes`, `DELETE`), eliminando dados mockados.
- [x] **Tarefa 02** — **Arquivos e Exames com Upload Real**: Implementar upload físico `multipart/form-data` no backend NestJS (`POST /arquivos/upload` com Multer) e conectar em `arquivos-page.tsx`.
- [ ] **Tarefa 03** — **Avaliações Clínicas Configuráveis**: Conectar `tab-avaliacoes.tsx` ao `POST /avaliacoes` para salvar no Postgres via Prisma, e implementar formulários dinâmicos para escalas M-CHAT (TEA) e SNAP-IV (TDAH) com cálculo de escore.
- [ ] **Tarefa 04** — **Frequência & Presença**: Conectar modal de ajuste de presença em `tab-frequencia.tsx` ao `PUT /frequencia/:id` e criar tela de chamada rápida em lote para a recepção.
- [ ] **Tarefa 05** — **Plano Terapêutico Singular (PTS)**: Conectar atualização da barra de metas (%) em `tab-plano-terapeutico.tsx` ao endpoint `PATCH /plano-terapeutico/meta/:id/progresso`, persistindo histórico com notas.

---

### 🔹 FASE 2: Geração e Exportação de Documentos Reais (PDF & Excel)
- [ ] **Tarefa 06** — **Relatórios Gerenciais (Excel & PDF)**: Conectar `relatorios-page.tsx` aos endpoints reais (`/relatorios/pacientes`, `/relatorios/financeiro`, `/relatorios/atendimentos`) e implementar gerador real de XLSX e PDF timbrado.
- [ ] **Tarefa 07** — **Central de Emissão de Laudos & Pareceres**: Criar página/modal `/laudos` permitindo redigir, selecionar modelos (`ModeloLaudo`) e exportar em PDF timbrado com carimbo e assinatura digital.
- [ ] **Tarefa 08** — **Espelho de Ponto Mensal (Portaria 671 MTE)**: Implementar emissão de folha/espelho de ponto mensal em PDF no módulo `ponto-page.tsx` com todas as marcações e saldo de horas.
- [ ] **Tarefa 09** — **Dossiê Clínico do Paciente (Prontuário Unificado)**: Criar botão no `prontuarios-page.tsx` para emissão do prontuário histórico unificado em PDF.

---

### 🔹 FASE 3: Ativação dos Serviços em Background & IA
- [ ] **Tarefa 10** — **IA Gemini no Prontuário**: Inserir botão de 1 clique "Resumir com IA" diretamente na evolução do paciente (`tab-evolucoes.tsx`), integrando com o `ai-service`.
- [ ] **Tarefa 11** — **Fallback Inteligente no ai-service**: Garantir modo autônomo e resiliente no serviço Node/Gemini caso a chave de API não esteja configurada ou oscile.
- [ ] **Tarefa 12** — **WhatsApp Service & Fila de Disparos**: Exibir monitor de conexão WhatsApp (QR Code / Status) em `comunicacao-page.tsx` e tela de fila com reenvio.
- [ ] **Tarefa 13** — **Cron Job de Lembretes Automáticos**: Ativar rotina diária no backend NestJS para enfileirar lembretes de consulta aos responsáveis 24h antes.

---

### 🔹 FASE 4: Regras de Negócio Avançadas, Notificações & Polimento
- [ ] **Tarefa 14** — **Chat Interno: Áudio & Imagens**: Adicionar bipe suave ao receber mensagem e suporte a colagem de imagem no `chat-floating-dock.tsx`.
- [ ] **Tarefa 15** — **Agenda Inteligente: Feriados Nacionais**: Importar lista de feriados brasileiros e bloquear horários automaticamente na `agenda-page.tsx`.
- [ ] **Tarefa 16** — **Lista de Espera Inteligente**: Conectar fluxo de cancelamento de consulta à sugestão imediata de pacientes em lista de espera.
- [ ] **Tarefa 17** — **Controle de Reposições de Consulta**: Regra para falta justificada gerar automaticamente crédito de reposição de sessão.
- [ ] **Tarefa 18** — **Alerta de Evasão Clínica**: Notificar recepção e terapeutas quando o paciente acumular 3 faltas no mês.
- [x] **Tarefa 19** — **Portal dos Pais: Confirmação de Presença**: Adicionar botão no portal para os responsáveis confirmarem comparecimento à consulta.
- [x] **Tarefa 20** — **Portal dos Pais: Recibos para Reembolso**: Aba para os pais emitirem recibos de pagamento para convênio e declaração de IRPF.
- [ ] **Tarefa 21** — **Colaboradores: Anexo de Documentos**: Upload e visualização de documentos profissionais (diplomas, contratos) no RH.
- [ ] **Tarefa 22** — **Contratos Digitais: Envio por WhatsApp**: Botão para enviar link de assinatura externa com token seguro direto no WhatsApp do pai.
- [ ] **Tarefa 23** — **Auditoria & Sincronização Offline**: Ativar listener de conexão no frontend para sincronizar automaticamente evoluções salvas no IndexedDB ao reconectar à internet.
- [ ] **Tarefa 24** — **Validação Final 100%**: Executar build completo de frontend e backend, testar todos os fluxos e atualizar percentual geral da proposta comercial para 100%.
