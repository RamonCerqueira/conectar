# 🏥 Sistema de Gestão Clínica — Instituto Conectar

Bem-vindo ao monorepo do **Instituto Conectar**, uma plataforma completa de gestão clínica especializada no atendimento de crianças com dificuldades de aprendizagem (TDAH, TEA, Dislexia, Discalculia e afins). 

O sistema centraliza toda a operação clínica em uma arquitetura moderna e escalável, abrangendo agendamento, prontuários, financeiro, comunicação em tempo real, integração com WhatsApp e Inteligência Artificial.

---

## 🏗️ Arquitetura do Sistema

O projeto é estruturado como um monorepo gerenciado por **pnpm Workspaces** e **Turborepo**:

```
conectar/
│
├── apps/
│   ├── frontend/          # Next.js 15 + TypeScript + Tailwind CSS 4 + Shadcn/UI
│   ├── backend/           # NestJS + Prisma ORM + PostgreSQL + Socket.IO + BullMQ
│   ├── whatsapp-service/  # Microserviço whatsapp-web.js para disparos e bot
│   └── ai-service/        # Microserviço de IA integrado ao Google Gemini
│
├── packages/
│   ├── ui/                # Componentes compartilhados de interface
│   ├── types/             # Tipagem compartilhada TypeScript
│   └── utils/             # Funções utilitárias de uso comum
│
├── docker/                # Configurações de infraestrutura isoladas
│   ├── nginx/
│   ├── postgres/
│   └── redis/
│
├── scripts/               # Scripts auxiliares de automação e backup
├── docker-compose.yml     # Orquestração local do banco e cache
├── turbo.json             # Pipeline de builds e execução do Turborepo
└── README.md              # Documentação principal do sistema
```

---

## 🛠️ Requisitos Prévios

Certifique-se de ter instalado em sua máquina:

- **Node.js**: `v20.0.0` ou superior.
- **pnpm**: `v9.0.0` ou superior.
- **Docker e Docker Compose** (para rodar o banco de dados e cache localmente).

---

## ⚙️ Configuração das Variáveis de Ambiente

O monorepo utiliza arquivos `.env` para gerenciar as credenciais. Como as aplicações rodam de forma isolada, as variáveis de ambiente precisam estar presentes tanto na raiz quanto na pasta de cada serviço.

### Passo 1: Criar o `.env` principal
Copie o arquivo de exemplo na raiz do projeto:
```bash
cp .env.example .env
```
*Edite o arquivo `.env` recém-criado na raiz com as suas credenciais locais de banco, chaves de API, etc.*

### Passo 2: Sincronizar com os subprojetos
Para facilitar o desenvolvimento, criamos um script automatizado que copia o `.env` principal para todas as pastas de aplicações (`apps/frontend`, `apps/backend`, `apps/ai-service`, e `apps/whatsapp-service`):

```bash
pnpm sync-env
```
*Sempre que atualizar o `.env` na raiz, rode este comando para replicar as mudanças em todos os locais.*

---

## 🚀 Como Executar o Sistema

### 📦 1. Instalar as dependências
Execute o comando a seguir na raiz para instalar todas as dependências do monorepo:
```bash
pnpm install
```

### 🐋 2. Iniciar os Serviços Auxiliares (Banco de Dados + Cache)
Suba os containers do PostgreSQL e Redis configurados no Docker Compose:
```bash
pnpm docker:up
```
*(Para parar os serviços auxiliares, utilize `pnpm docker:down`)*

### 🗄️ 3. Inicializar o Banco de Dados (Prisma)
Gere os tipos do cliente e rode as migrations para estruturar as tabelas do banco de dados:
```bash
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

---

### 🌐 Opção A: Executar o Monorepo Inteiro (Simultaneamente)
Para rodar todas as aplicações ao mesmo tempo em paralelo usando o Turborepo:
```bash
pnpm dev
```
Isso iniciará o Frontend, Backend, AI Service e WhatsApp Service simultaneamente.

---

### 🔍 Opção B: Executar os Serviços Separadamente

Você pode optar por rodar apenas o frontend, backend ou microserviços específicos. Existem duas formas de fazer isso:

#### Método 1: A partir da Raiz do Monorepo (Recomendado)
Você pode usar os atalhos ou os filtros do pnpm na raiz sem precisar navegar pelas pastas:

*   **Frontend apenas:**
    ```bash
    pnpm frontend
    # ou alternativamente:
    pnpm --filter frontend dev
    ```
*   **Backend apenas:**
    ```bash
    pnpm backend
    # ou alternativamente:
    pnpm --filter backend dev
    ```
*   **AI Service apenas:**
    ```bash
    pnpm ai-service
    # ou alternativamente:
    pnpm --filter ai-service dev
    ```
*   **WhatsApp Service apenas:**
    ```bash
    pnpm whatsapp-service
    # ou alternativamente:
    pnpm --filter whatsapp-service dev
    ```

#### Método 2: Diretamente dentro de cada pasta (Isolado)
Você pode entrar na pasta da aplicação correspondente e rodar o script `dev` local utilizando o `pnpm`:

*   **Frontend (Next.js):**
    ```bash
    cd apps/frontend
    pnpm dev
    ```
    *Roda em: http://localhost:5000*

*   **Backend (NestJS API):**
    ```bash
    cd apps/backend
    pnpm dev
    ```
    *Roda em: http://localhost:3001/api (Swagger disponível em http://localhost:3001/api/docs)*

*   **AI Service (Gemini Microservice):**
    ```bash
    cd apps/ai-service
    pnpm dev
    ```
    *Roda em: http://localhost:5003*

*   **WhatsApp Service (whatsapp-web.js):**
    ```bash
    cd apps/whatsapp-service
    pnpm dev
    ```
    *Roda em: http://localhost:3002*

---

## 📋 Portas das Aplicações

| Serviço | Porta Local | Descrição |
|---|---|---|
| **Frontend** | `5000` | Interface Next.js do usuário |
| **Backend** | `3001` | API Rest NestJS, WebSockets, etc. |
| **WhatsApp Service** | `3002` | Gerenciamento de sessão e envio do WhatsApp |
| **AI Service** | `5003` | Integração de IA com Google Gemini |
| **PostgreSQL** | `5432` | Banco de dados relacional primário |
| **Redis** | `6379` | Cache e processamento de filas com BullMQ |

---

## 🛠️ Comandos Úteis do Monorepo

| Comando | Descrição |
|---|---|
| `pnpm install` | Instala e vincula dependências em todo o workspace |
| `pnpm sync-env` | Replica o arquivo `.env` da raiz em todos os sub-apps |
| `pnpm build` | Compila todos os pacotes e aplicações para produção |
| `pnpm lint` | Executa o linter em busca de inconsistências no código |
| `pnpm clean` | Remove arquivos de build e pastas `node_modules` |
| `pnpm db:generate` | Gera o cliente do Prisma com base no schema |
| `pnpm db:migrate` | Roda as migrations pendentes no banco |
| `pnpm db:seed` | Popula o banco com dados de teste/iniciais |
| `pnpm db:studio` | Abre o console visual do Prisma para explorar dados |
| `pnpm docker:up` | Sobe o banco de dados PostgreSQL e cache Redis |
| `pnpm docker:down` | Derruba os containers locais de banco e cache |
