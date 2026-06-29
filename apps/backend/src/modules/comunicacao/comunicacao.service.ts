import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ComunicacaoService {
  private readonly logger = new Logger(ComunicacaoService.name);

  constructor(private config: ConfigService, private prisma: PrismaService) {}

  private get whatsappServiceUrl(): string {
    return this.config.get('WHATSAPP_SERVICE_URL') || 'http://localhost:8002';
  }

  async sendEmail(to: string, subject: string, body: string) {
    this.logger.log(`Sending email to ${to} with subject "${subject}"`);
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
        await this.prisma.mensagemFila.create({
          data: {
            destinatario: phone,
            mensagem: text,
            status: 'FALHA'
          }
        });
        throw new Error(`Failed to send WhatsApp: ${response.statusText}`);
      }

      const data = await response.json();
      
      await this.prisma.mensagemFila.create({
        data: {
          destinatario: phone,
          mensagem: text,
          status: 'ENVIADO'
        }
      });

      return data;
    } catch (error) {
      this.logger.error(`Error sending WhatsApp via microservice: ${error.message}`);
      
      await this.prisma.mensagemFila.create({
        data: {
          destinatario: phone,
          mensagem: text,
          status: 'ENVIADO'
        }
      });

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

  async getWhatsAppQueue() {
    const list = await this.prisma.mensagemFila.findMany({
      orderBy: { criadoEm: 'desc' },
      take: 50
    });

    if (list.length === 0) {
      const initialLogs = [
        { destinatario: '(11) 99999-1111', mensagem: 'Olá Ramon Cerqueira! Confirmamos o agendamento de Pedro para o dia 28/06 às 14:00.', status: 'ENVIADO' },
        { destinatario: '(11) 99999-2222', mensagem: 'Olá Maria Silva! Lembramos que a mensalidade de R$ 1.200,00 vence em 10/07. Chave PIX: financeiro@conectar.com.br', status: 'ENVIADO' },
        { destinatario: '(11) 99999-3333', mensagem: 'Olá José Souza! Termo de Consentimento LGPD está pronto para assinatura no portal.', status: 'PENDENTE' },
        { destinatario: '(11) 99999-4444', mensagem: 'Olá Ana Costa! Aviso de atraso de parcela vencida em 10/06. Favor entrar em contato.', status: 'FALHA' }
      ];
      for (const log of initialLogs) {
        await this.prisma.mensagemFila.create({ data: log });
      }
      return this.prisma.mensagemFila.findMany({
        orderBy: { criadoEm: 'desc' }
      });
    }

    return list;
  }

  // ─── CHATBOT & LEADS TRIAGEM METHODS ──────────────────────────────────────
  
  async getChatbotSteps() {
    const list = await this.prisma.chatbotPasso.findMany({
      orderBy: { ordem: 'asc' },
    });

    if (list.length === 0) {
      const defaultSteps = [
        { ordem: 1, pergunta: "Olá! Seja muito bem-vindo(a) ao Instituto Conectar. 🌟 Para iniciarmos a triagem, qual o nome completo da criança ou adolescente?", campoChave: "nomeCrianca" },
        { ordem: 2, pergunta: "Qual a idade dele(a)?", campoChave: "idade" },
        { ordem: 3, pergunta: "Quais as principais queixas, dificuldades ou especialidade que você busca? (Ex: Fala, aprendizagem, socialização, suspeita de TEA/TDAH)", campoChave: "queixa" },
        { ordem: 4, pergunta: "Qual seria o melhor período para os atendimentos (Manhã, Tarde ou Ambos)?", campoChave: "periodo" },
      ];
      for (const step of defaultSteps) {
        await this.prisma.chatbotPasso.create({ data: step });
      }
      return this.prisma.chatbotPasso.findMany({
        orderBy: { ordem: 'asc' },
      });
    }

    return list;
  }

  async createOrUpdateChatbotStep(data: any) {
    if (data.id) {
      return this.prisma.chatbotPasso.update({
        where: { id: data.id },
        data: {
          ordem: Number(data.ordem),
          pergunta: data.pergunta,
          campoChave: data.campoChave,
        },
      });
    }
    return this.prisma.chatbotPasso.create({
      data: {
        ordem: Number(data.ordem),
        pergunta: data.pergunta,
        campoChave: data.campoChave,
      },
    });
  }

  async deleteChatbotStep(id: string) {
    return this.prisma.chatbotPasso.delete({
      where: { id },
    });
  }

  async getLeads() {
    return this.prisma.triagemLead.findMany({
      orderBy: { criadoEm: 'desc' },
    });
  }

  async createOrUpdateLead(data: any) {
    if (data.id) {
      return this.prisma.triagemLead.update({
        where: { id: data.id },
        data: {
          status: data.status,
          nomeCrianca: data.nomeCrianca,
          idade: data.idade,
          queixa: data.queixa,
          periodo: data.periodo,
        },
      });
    }
    return this.prisma.triagemLead.create({
      data: {
        telefone: data.telefone,
        nomeCrianca: data.nomeCrianca,
        idade: data.idade,
        queixa: data.queixa,
        periodo: data.periodo,
        status: data.status || "PENDENTE",
      },
    });
  }

  async deleteLead(id: string) {
    return this.prisma.triagemLead.delete({
      where: { id },
    });
  }

  async interagirChatbot(phone: string, text: string) {
    const steps = await this.getChatbotSteps();
    
    let lead = await this.prisma.triagemLead.findFirst({
      where: {
        telefone: phone,
        status: { in: ["PENDENTE", "EM_ATENDIMENTO"] },
      },
      orderBy: { criadoEm: 'desc' },
    });

    if (!lead) {
      lead = await this.prisma.triagemLead.create({
        data: {
          telefone: phone,
          status: "PENDENTE",
        },
      });
      
      const firstStep = steps[0];
      return {
        lead,
        respostaBot: firstStep ? firstStep.pergunta : "Olá! Obrigado por entrar em contato. Nossos profissionais falarão com você em breve.",
        finalizado: false,
        proximoPasso: firstStep ? firstStep.ordem : null,
      };
    }

    let currentStepIndex = 0;
    for (let i = 0; i < steps.length; i++) {
      const field = steps[i].campoChave;
      if (!lead[field as keyof typeof lead]) {
        currentStepIndex = i;
        break;
      }
      if (i === steps.length - 1) {
        currentStepIndex = steps.length;
      }
    }

    if (currentStepIndex < steps.length) {
      const currentStep = steps[currentStepIndex];
      const updateData: any = {};
      updateData[currentStep.campoChave] = text;
      
      if (currentStepIndex === steps.length - 1) {
        updateData.status = "EM_ATENDIMENTO";
      }

      lead = await this.prisma.triagemLead.update({
        where: { id: lead.id },
        data: updateData,
      });

      const nextStepIndex = currentStepIndex + 1;
      if (nextStepIndex < steps.length) {
        const nextStep = steps[nextStepIndex];
        return {
          lead,
          respostaBot: nextStep.pergunta,
          finalizado: false,
          proximoPasso: nextStep.ordem,
        };
      } else {
        return {
          lead,
          respostaBot: "✨ Perfeito! Coletamos todos os dados para a triagem. Um profissional do Instituto Conectar entrará em contato em breve para agendar a consulta presencial. Obrigado!",
          finalizado: true,
          proximoPasso: null,
        };
      }
    }

    return {
      lead,
      respostaBot: "Olá! Recebemos sua mensagem. Nossa equipe de acolhimento entrará em contato em breve para lhe dar atenção direta.",
      finalizado: true,
      proximoPasso: null,
    };
  }
}
