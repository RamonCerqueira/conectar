# 🚀 Guia Oficial: Atualização do Sistema Conectar na VPS

Este guia contém os comandos exatos e testados para atualizar o sistema Conectar no servidor de produção (VPS Linux).

---

## ⚡ 1. Comando Rápido (1 Linha)

Copie e cole no terminal da VPS:

```bash
cd ~/conectar && git pull origin main && pnpm install && npm run build && pm2 restart ecosystem.config.js && pm2 status
```

*(Se o seu servidor não tiver o comando `pnpm` global, utilize `npm run build` normalmente conforme o passo a passo abaixo).*

---

## 📋 2. Passo a Passo Detalhado

### Passo 1: Acessar a pasta do projeto e puxar as alterações do Git
```bash
cd ~/conectar
git pull origin main
```
> **Nota de Correção Aplicada:** Este `git pull` trará a correção definitiva que remove os erros de compilação do Webpack (`@capacitor/status-bar` e `@capacitor/haptics`) e adiciona a versão completa modular do **Portal da Família**.

---

### Passo 2: Atualizar dependências (se necessário)
```bash
pnpm install
```
*(Ou se não usar pnpm: `npm install`)*

---

### Passo 3: Limpar o cache antigo do Next.js (Garante build 100% limpo)
```bash
rm -rf apps/frontend/.next
```

---

### Passo 4: Executar o Build de Produção
```bash
npm run build
```
*(Ou `pnpm build`)*

Você verá a compilação de todos os módulos (`backend`, `frontend`, `landingpage`) gerando as 33 páginas estáticas do frontend com sucesso:
```
✓ Compiled successfully
✓ Generating static pages (33/33)
```

---

### Passo 5: Reiniciar os Serviços no PM2
```bash
pm2 restart ecosystem.config.js
```
*(Ou para reiniciar apenas o frontend: `pm2 restart conectar-frontend`)*

---

### Passo 6: Verificar o Status e os Logs
Para conferir se todos os serviços estão `online`:
```bash
pm2 status
```

Para conferir os logs em tempo real:
```bash
pm2 logs conectar-frontend --lines 30
```

---

## 🔍 3. Verificação Rápida de Funcionamento

Teste o funcionamento diretamente pelo terminal da VPS:

```bash
# Testar Frontend do Portal
curl -I http://localhost:5202/portal

# Testar Backend NestJS
curl -I http://localhost:5101/api
```

---

## 🛠️ Resumo das Novidades do Portal da Família

1. **App 100% Completo**:
   - `/portal` e `/portal/dashboard`: Tela Inicial oficial com paleta `#8D5BD1`, Banner Hero, Mascot e 6 Cards Pastéis em 3 colunas.
   - `/portal/familia`: Perfil da criança, equipe multidisciplinar, dados escolares e linha do tempo de conquistas.
   - `/portal/agenda`: Agenda com **Confirmação de Presença em 1 toque (Tarefa 19)** e histórico.
   - `/portal/conteudos`: Download de laudos com carimbo e assinatura digital, guias práticos de psicoeducação para os pais e tarefas para casa.
   - `/portal/financeiro`: Pagamento PIX e **Emissão de Recibos para Reembolso de Convênios & IRPF (Tarefa 20)**.
   - `/portal/perfil`: Preferências de notificações, WhatsApp da recepção e configurações.
2. **Zero Dependências Nativas no Servidor**: O código detecta o ambiente nativo em runtime sem quebrar o Webpack no Linux.
