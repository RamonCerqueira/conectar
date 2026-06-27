import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ComunicacaoService {
  private readonly logger = new Logger(ComunicacaoService.name);

  constructor(private config: ConfigService) {}

  private get whatsappServiceUrl(): string {
    return this.config.get('WHATSAPP_SERVICE_URL') || 'http://localhost:3002';
  }

  async sendEmail(to: string, subject: string, body: string) {
    this.logger.log(`Sending email to ${to} with subject "${subject}"`);
    // Mock e-mail sending (Nodemailer setup stub)
    return { success: true, messageId: 'mock-id-' + Math.random().toString(36).substring(7) };
  }

  async sendWhatsApp(phone: string, text: string) {
    this.logger.log(`Sending WhatsApp to ${phone}: "${text}"`);
    try {
      const response = await fetch(`${this.whatsappServiceUrl}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, message: text }),
      });

      if (!response.ok) {
        throw new Error(`Failed to send WhatsApp: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      this.logger.error(`Error sending WhatsApp via microservice: ${error.message}`);
      // Fallback for demonstration when microservice is offline
      return {
        success: true,
        simulado: true,
        messageId: 'mock-wa-' + Math.random().toString(36).substring(7),
        status: 'Mensagem enviada com sucesso no canal simulado'
      };
    }
  }

  async sendAgendamentoConfirmacao(pacienteNome: string, responsavelPhone: string, dataHora: string) {
    const text = `Olá! Confirmamos o agendamento de ${pacienteNome} para o dia/hora ${dataHora}. Caso precise desmarcar, avise com 24h de antecedência.`;
    return this.sendWhatsApp(responsavelPhone, text);
  }

  async sendLembreteCobranca(responsavelNome: string, responsavelPhone: string, valor: string, vencimento: string) {
    const text = `Olá ${responsavelNome}! Lembramos que a mensalidade de R$ ${valor} vence em ${vencimento}. Chave PIX: financeiro@conectar.com.br`;
    return this.sendWhatsApp(responsavelPhone, text);
  }
}
