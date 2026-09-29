# 🌐 Tabela Oficial de URLs e Acessos — Instituto Conectar

> **Servidor VPS:** `162.35.124.221`  
> **Domínio Principal:** `institutoconectar.net.br`  
> **Status:** Produção ativa com Nginx, PM2, PostgreSQL nativo e SSL Let's Encrypt

---

## 🚀 1. URLs Públicas de Produção (com HTTPS)

| Aplicação / Módulo | URL Completa | Descrição / Finalidade |
| :--- | :--- | :--- |
| 🌸 **Landing Page Oficial** | [https://institutoconectar.net.br](https://institutoconectar.net.br) | Site institucional oficial, captação de pacientes, apresentação dos serviços e equipe. |
| 🌸 **Landing Page (WWW)** | [https://www.institutoconectar.net.br](https://www.institutoconectar.net.br) | Alias redirecionado da Landing Page oficial. |
| 🏥 **Sistema Clínico Principal** | [https://app.institutoconectar.net.br](https://app.institutoconectar.net.br) | Painel de gestão completa: Prontuários, Agenda Geral, Recepção, Faturamento e Configurações. |
| 👨‍👩‍👧 **Portal da Família** | [https://app.institutoconectar.net.br/portal](https://app.institutoconectar.net.br/portal) | Acesso exclusivo dos pais e responsáveis: linha do tempo, relatórios, confirmação de presença e recibos. |
| ⚡ **Backend API REST** | [https://api.institutoconectar.net.br/api](https://api.institutoconectar.net.br/api) | Endpoints da API em NestJS consumidos pelos frontends e webhooks. |
| 📖 **Documentação Swagger API** | [https://api.institutoconectar.net.br/api/docs](https://api.institutoconectar.net.br/api/docs) | Interface interativa de testes e documentação dos contratos de API. |

---

## ⚙️ 2. Mapeamento de Portas e Serviços Internos na VPS

| Processo no PM2 | Porta Local | URL Direta via IP (Sem Nginx) | Tecnologia |
| :--- | :---: | :--- | :--- |
| `conectar-landingpage` | **5303** | `http://162.35.124.221:5303` | Next.js 15 App Router |
| `conectar-frontend` | **5202** | `http://162.35.124.221:5202` | Next.js 15 App Router |
| `conectar-backend` | **5101** | `http://162.35.124.221:5101/api` | NestJS + Socket.IO |
| `conectar-whatsapp-service` | **8002** | `http://localhost:8002` | Node.js + Baileys WhatsApp API |
| `conectar-ai-service` | **8003** | `http://localhost:8003` | Node.js + Google Gemini 2.0 Flash |
| **PostgreSQL Nativo** | **5432** | `localhost:5432` | Banco local `conectar` |
| **Redis Nativo** | **6379** | `localhost:6379` | Filas assíncronas Bull e cache de sessão |

---

## 📋 3. Configuração de DNS (Registro.br)

Configuração apontada no painel da **Registro.br** para o domínio **`institutoconectar.net.br`**:

```
institutoconectar.net.br     A     162.35.124.221
www.institutoconectar.net.br A     162.35.124.221
app.institutoconectar.net.br A     162.35.124.221
api.institutoconectar.net.br A     162.35.124.221
```

---

## 🛠️ 4. Comandos de Manutenção Rápida via SSH

Para conectar no servidor:
```bash
ssh root@162.35.124.221
```

### Ver status das aplicações:
```bash
pm2 status
```

### Ver logs em tempo real:
```bash
# Frontend e Portal
pm2 logs conectar-frontend --lines 30

# Backend NestJS
pm2 logs conectar-backend --lines 30

# Landing Page
pm2 logs conectar-landingpage --lines 30
```

### Reiniciar todos os serviços:
```bash
pm2 restart all
```

### Testar status das portas locais via terminal:
```bash
curl -I http://127.0.0.1:5303  # Landing Page
curl -I http://127.0.0.1:5202  # Frontend / Portal
curl -I http://127.0.0.1:5101/api  # Backend
```
