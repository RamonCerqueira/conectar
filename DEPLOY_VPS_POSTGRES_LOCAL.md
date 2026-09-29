# 🚀 Guia de Implantação do Conectar na VPS Linux (Sem Docker)
> **Servidor:** Ubuntu / Debian (VPS Limpa)  
> **Banco de Dados:** PostgreSQL nativo local + Redis nativo  
> **Gerenciador de Processos:** PM2  
> **Servidor Web / SSL:** Nginx + Certbot (Let's Encrypt)

---

## 📑 Sumário
1. [Preparação e Requisitos da VPS](#1-preparação-e-requisitos-da-vps)
2. [Instalação do Node.js 20, PNPM e PM2](#2-instalação-do-nodejs-20-pnpm-e-pm2)
3. [Instalação e Configuração do PostgreSQL Nativo](#3-instalação-e-configuração-do-postgresql-nativo)
4. [Instalação do Redis](#4-instalação-do-redis)
5. [Clonagem e Configuração do Projeto Conectar](#5-clonagem-e-configuração-do-projeto-conectar)
6. [Configuração do Arquivo `.env`](#6-configuração-do-arquivo-env)
7. [Build e Migrações do Banco de Dados](#7-build-e-migrações-do-banco-de-dados)
8. [Inicialização dos Serviços com PM2](#8-inicialização-dos-serviços-com-pm2)
9. [Configuração do Nginx (Proxy Reverso) e SSL HTTPS](#9-configuração-do-nginx-proxy-reverso-e-ssl-https)
10. [Comandos de Manutenção e Atualização Futura](#10-comandos-de-manutenção-e-atualização-futura)

---

## 1. Preparação e Requisitos da VPS

Acesse a VPS via terminal SSH (substitua pelo IP do seu servidor):
```bash
ssh root@SEU_IP_DA_VPS
```

Atualize os pacotes do sistema:
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget unzip build-essential ufw software-properties-common
```

Configure o Firewall (UFW):
```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status
```

---

## 2. Instalação do Node.js 20, PNPM e PM2

Instale o **Node.js LTS (v20)** via NodeSource:
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v # Deve exibir v20.x.x
npm -v
```

Instale o **pnpm** e o **PM2** globalmente:
```bash
sudo npm install -g pnpm pm2
```

---

## 3. Instalação e Configuração do PostgreSQL Nativo

Instale o PostgreSQL e utilitários:
```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### Criar o Usuário e o Banco de Dados do Conectar
Execute no terminal para entrar no console do PostgreSQL:
```bash
sudo -u postgres psql
```

Dentro do prompt do PostgreSQL (`postgres=#`), cole os comandos abaixo (troque `SuaSenhaSeguraPostgres123` por uma senha forte):
```sql
CREATE DATABASE conectar;
CREATE USER conectar_user WITH ENCRYPTED PASSWORD 'ramondev123Conectar';
GRANT ALL PRIVILEGES ON DATABASE conectar TO conectar_user;
ALTER DATABASE conectar OWNER TO conectar_user;

-- Permissões de schema necessárias para o Prisma ORM
\c conectar
GRANT ALL ON SCHEMA public TO conectar_user;
ALTER SCHEMA public OWNER TO conectar_user;
\q
```

Teste o acesso do novo usuário:
```bash
psql -U conectar_user -d conectar -h 127.0.0.1 -W
# Digite a senha cadastrada. Se conectar com sucesso, digite \q para sair.
```

---

## 4. Instalação do Redis

O backend Conectar utiliza filas Bull/Redis para agendamentos e notificações:
```bash
sudo apt install -y redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
redis-cli ping # Deve retornar: PONG
```

---

## 5. Clonagem e Configuração do Projeto Conectar

Crie a pasta de aplicações ou clone direto na home (`~`):
```bash
cd ~
git clone https://github.com/RamonCerqueira/conectar.git
cd ~/conectar
```

Instale todas as dependências do monorepo usando o `pnpm`:
```bash
pnpm install
```

---

## 6. Configuração do Arquivo `.env`

Crie o arquivo `.env` a partir do modelo:
```bash
cp .env.example .env
nano .env
```

Edite as seguintes variáveis principais para apontar para o PostgreSQL local da VPS:

```env
# ─── PostgreSQL Nativo Local ──────────────────────────────────
POSTGRES_HOST=127.0.0.1
POSTGRES_PORT=5432
POSTGRES_DB=conectar
POSTGRES_USER=conectar_user
POSTGRES_PASSWORD=ramondev123Conectar
DATABASE_URL="postgresql://conectar_user:ramondev123Conectar@127.0.0.1:5432/conectar?schema=public"
DIRECT_URL="postgresql://conectar_user:ramondev123Conectar@127.0.0.1:5432/conectar?schema=public"

# ─── Redis Nativo Local ────────────────────────────────────────
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_URL="redis://127.0.0.1:6379"

# ─── JWT & Segurança ──────────────────────────────────────────
# Dica: gere senhas longas ou execute: openssl rand -hex 32
JWT_SECRET=coloque_uma_chave_super_segura_com_mais_de_32_caracteres_aqui
JWT_REFRESH_SECRET=outra_chave_super_segura_com_mais_de_32_caracteres_aqui

# ─── URLs da Aplicação ────────────────────────────────────────
NODE_ENV=production
BACKEND_PORT=5101
# Se tiver domínio próprio, use: https://app.seudominio.com.br
FRONTEND_URL=http://SEU_IP_DA_VPS:5202
BACKEND_URL=http://SEU_IP_DA_VPS:5101

# ─── Gemini IA (opcional ou preencha a sua) ───────────────────
GEMINI_API_KEY=sua_chave_gemini_aqui
GEMINI_MODEL=gemini-2.0-flash-exp

# ─── Microserviços ────────────────────────────────────────────
WHATSAPP_SERVICE_URL=http://localhost:8002
WHATSAPP_SESSION_ID=conectar-session
```

Pressione `Ctrl + O`, depois `Enter` para salvar, e `Ctrl + X` para sair do editor `nano`.

Sincronize as variáveis entre os sub-pacotes:
```bash
pnpm run sync-env
```

---

## 7. Build e Migrações do Banco de Dados

Gere os clientes do Prisma e aplique as tabelas no PostgreSQL local:
```bash
# Gera o Prisma Client
pnpm run db:generate

# Roda as migrações no banco local (criação de todas as tabelas)
pnpm --filter backend run db:migrate:prod

# (Opcional) Popular o banco inicial (Admin/Seed)
pnpm run db:seed
```

Execute o Build de Produção de todas as aplicações:
```bash
pnpm run build
```

---

## 8. Inicialização dos Serviços com PM2

Inicie todas as aplicações mapeadas no `ecosystem.config.js`:
```bash
pm2 start ecosystem.config.js
```

Salve os processos e configure a inicialização automática no boot do Linux:
```bash
pm2 save
pm2 startup
# Execute o comando `sudo env PATH=...` que o PM2 exibir na tela
```

Verifique se todos os serviços estão em status `online`:
```bash
pm2 status
```

Para verificar logs de qualquer serviço:
```bash
pm2 logs conectar-backend --lines 40
pm2 logs conectar-frontend --lines 40
```

---

## 9. Configuração de DNS no Registro.br, Nginx e SSL Gratuito

### 🌐 9.1. Configuração de DNS no Registro.br
Acesse o painel do **Registro.br** no domínio **`institutoconectar.net.br`** e vá em **DNS > Editar Zona / Adicionar Registro**:

Crie as seguintes entradas do tipo **A** apontando para o IP da sua VPS (**`162.35.124.221`**):

| Tipo | Nome (Host) | Dados (IPv4) | Função |
| :--- | :--- | :--- | :--- |
| **A** | *(deixe em branco ou `@`)* | `162.35.124.221` | Landing Page Principal |
| **A** | `www` | `162.35.124.221` | Redirecionamento da Landing Page |
| **A** | `app` | `162.35.124.221` | Sistema Clínico & Portal da Família |
| **A** | `api` | `162.35.124.221` | Backend API NestJS + WebSockets |

> Salve as alterações na zona de DNS. O Registro.br leva de 5 a 30 minutos para propagar.

---

### 🌐 9.2. Instalação do Nginx e Certbot
Na VPS, instale o Nginx e o gerador de certificado SSL:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

---

### 🌐 9.3. Configurar os Sites no Nginx
Crie o arquivo de configuração para o domínio `institutoconectar.net.br`:
```bash
sudo nano /etc/nginx/sites-available/institutoconectar.conf
```

Cole a configuração completa abaixo:

```nginx
# 1. Landing Page Oficial (Porta 5303)
server {
    server_name institutoconectar.net.br www.institutoconectar.net.br;

    location / {
        proxy_pass http://127.0.0.1:5303;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 2. Sistema Clínico e Portal da Família (Porta 5202)
server {
    server_name app.institutoconectar.net.br;

    location / {
        proxy_pass http://127.0.0.1:5202;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# 3. API Backend NestJS + WebSockets Socket.IO (Porta 5101)
server {
    server_name api.institutoconectar.net.br;

    location / {
        proxy_pass http://127.0.0.1:5101;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        client_max_body_size 50M;
    }
}
```

Ative o arquivo e reinicie o Nginx:
```bash
sudo ln -s /etc/nginx/sites-available/institutoconectar.conf /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t
sudo systemctl restart nginx
```

---

### 🔒 9.4. Gerar Certificados SSL Gratuitos (HTTPS) com 1 Comando
Assim que o DNS propagar, rode o comando abaixo:
```bash
sudo certbot --nginx -d institutoconectar.net.br -d www.institutoconectar.net.br -d app.institutoconectar.net.br -d api.institutoconectar.net.br
```
O Certbot vai configurar o SSL automaticamente e ativar a renovação automática para você.

---

## 10. Comandos de Manutenção e Atualização Futura

Sempre que fizer novas alterações no Git e quiser atualizar a VPS:

```bash
cd ~/conectar
git pull origin main
pnpm install
pnpm --filter backend run db:migrate:prod
pnpm run build
pm2 restart ecosystem.config.js
pm2 status
```
