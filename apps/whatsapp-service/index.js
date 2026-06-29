const express = require('express');
const cors = require('cors');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 8002;
let qrCodeValue = '';
let clientStatus = 'DESCONECTADO'; // DESCONECTADO, AUTENTICANDO, PRONTO

// Inicializa cliente do WhatsApp Web com LocalAuth
const client = new Client({
  authStrategy: new LocalAuth({ clientId: "conectar-session" }),
  puppeteer: {
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  }
});

client.on('qr', (qr) => {
  qrCodeValue = qr;
  clientStatus = 'AGUARDANDO_QR';
  console.log('QR RECEIVED', qr);
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  clientStatus = 'PRONTO';
  qrCodeValue = '';
  console.log('WhatsApp Web Client is ready!');
});

client.on('authenticated', () => {
  clientStatus = 'PRONTO';
  console.log('WhatsApp Web Authenticated!');
});

client.on('auth_failure', (msg) => {
  clientStatus = 'FALHA_AUTENTICACAO';
  console.error('AUTHENTICATION FAILURE', msg);
});

client.on('disconnected', (reason) => {
  clientStatus = 'DESCONECTADO';
  console.log('Client was logged out', reason);
});

// Inicialização segura
client.initialize().catch(err => {
  console.error('Falha ao inicializar o WhatsApp client. Rodando em modo simulação.', err.message);
});

// ─── Endpoints da API ──────────────────────────────────────────

// Status do serviço
app.get('/status', (req, res) => {
  res.json({
    status: clientStatus,
    qrCode: qrCodeValue,
    timestamp: new Date()
  });
});

// Disparo de mensagem
app.post('/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ error: 'Telefone e mensagem são obrigatórios.' });
  }

  // Sanitiza número: adiciona sufixo se necessário
  let formattedPhone = phone.replace(/\D/g, '');
  if (!formattedPhone.endsWith('@c.us')) {
    formattedPhone = `${formattedPhone}@c.us`;
  }

  console.log(`Disparando WhatsApp para ${formattedPhone}: "${message}"`);

  if (clientStatus === 'PRONTO') {
    try {
      const response = await client.sendMessage(formattedPhone, message);
      return res.json({ success: true, messageId: response.id.id });
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
      return res.status(500).json({ error: 'Erro ao enviar mensagem no WhatsApp', details: err.message });
    }
  } else {
    // Modo simulação ativa se o robô não estiver conectado
    console.log('[MOCK WHATSAPP] Disparo simulado (robô offline)');
    return res.json({
      success: true,
      simulado: true,
      messageId: `mock-wa-${Math.random().toString(36).substring(7)}`,
      status: 'Mensagem enviada com sucesso no canal simulado'
    });
  }
});

app.listen(PORT, () => {
  console.log(`\n🟢 Microserviço WhatsApp rodando em http://localhost:${PORT}`);
});
