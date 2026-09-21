# REGRAS DO PROJETO CONECTAR — EXECUÇÃO CONTÍNUA ATÉ 100%

## 🔴 DIRETIVA PRIMÁRIA OBRIGATÓRIA (AUTO-RESUME)
Toda vez que uma nova conversa for iniciada, a sessão for retomada ou o usuário enviar mensagens como:
- `"continuar"`
- `"continue"`
- `"prossiga"`
- mensagem vazia ou solicitação de andamento

O agente de IA **DEVE OBRIGATORIAMENTE**:
1. Abrir e ler o arquivo [`ROADMAP_100.md`](file:///f:/PROJETOS/conectar/ROADMAP_100.md).
2. Identificar qual é a **primeira tarefa** que ainda não está marcada com `[x]`.
3. Executar o código e as alterações necessárias para concluir essa tarefa por completo (backend, banco, frontend, estilos).
4. Validar o funcionamento (testar compilação ou execução).
5. Marcar a tarefa como `[x]` no arquivo [`ROADMAP_100.md`](file:///f:/PROJETOS/conectar/ROADMAP_100.md) e atualizar o percentual geral.
6. Não parar até que todas as 24 tarefas estejam concluídas e o sistema atinja **100%**.

## 🛠️ DIRETIVAS TÉCNICAS
- **Frontend**: Next.js 15 App Router, TypeScript, TailwindCSS v4, Framer Motion, Lucide React, Sonner para notificações.
- **Backend**: NestJS, Prisma ORM, PostgreSQL, WebSockets Socket.IO.
- **Microserviços**: `ai-service` (Node.js/Gemini), `whatsapp-service` (Baileys/Node.js).
- **Sem Mocks em Módulos Finalizados**: Sempre persistir no banco PostgreSQL via Prisma e consumir via `api` do frontend.
