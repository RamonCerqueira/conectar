import * as nodemailer from 'nodemailer';
import { Injectable, Logger, ServiceUnavailableException, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ComunicacaoService {
  private readonly logger = new Logger(ComunicacaoService.name);

  constructor(private config: ConfigService, private prisma: PrismaService) {}

  private get whatsappServiceUrl(): string {
    return this.config.get('WHATSAPP_SERVICE_URL') || 'http://localhost:8002';
  }

  private smtp() {
    const host=this.config.get<string>('SMTP_HOST'),from=this.config.get<string>('SMTP_FROM'),user=this.config.get<string>('SMTP_USER'),pass=this.config.get<string>('SMTP_PASS');
    if(!host || !from || !user || !pass)throw new ServiceUnavailableException('E-mail não configurado. Configure SMTP_HOST, SMTP_USER, SMTP_PASS e SMTP_FROM no servidor.');
    const port=Number(this.config.get('SMTP_PORT') || 587);
    return {from,transport:nodemailer.createTransport({host,port,secure:port===465,requireTLS:port!==465,auth:{user,pass},connectionTimeout:10000,socketTimeout:15000})};
  }
  async integrationStatus(includeQr=false) {
    let whatsapp:any={status:'INDISPONIVEL'};
    try { const r=await fetch(`${this.whatsappServiceUrl}/status`,{signal:AbortSignal.timeout(5000)});if(r.ok){const d=await r.json();whatsapp={status:d.status,...(includeQr && d.qrCode?{qrCode:d.qrCode}: {})};} }catch{}
    return {email:{configurado:!!(this.config.get('SMTP_HOST') && this.config.get('SMTP_FROM') && this.config.get('SMTP_USER') && this.config.get('SMTP_PASS'))},whatsapp};
  }
  async verifyEmail() {const {transport}=this.smtp();try {await transport.verify();return {success:true};}catch{throw new ServiceUnavailableException('Não foi possível autenticar no servidor SMTP.');}finally{transport.close();}}
  async sendEmail(to: string, subject: string, body: string) {
    if(typeof to!=='string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to) || typeof subject!=='string' || !subject.trim() || subject.length>200 || typeof body!=='string' || !body.trim() || body.length>10000)throw new BadRequestException('Destinatário, assunto e mensagem inválidos.');
    const {from,transport}=this.smtp();const item=await this.prisma.mensagemFila.create({data:{destinatario:to,mensagem:body,status:'PENDENTE',canal:'EMAIL'}});
    try {const result=await transport.sendMail({from,to,subject,text:body});if(!result.accepted.length)throw Error();await this.prisma.mensagemFila.update({where:{id:item.id},data:{status:'ENVIADO'}});return {success:true,messageId:result.messageId};}
    catch {await this.prisma.mensagemFila.update({where:{id:item.id},data:{status:'FALHA'}});throw new ServiceUnavailableException('E-mail não aceito pelo provedor. Tente novamente após verificar a integração.');}finally{transport.close();}
  }
  async sendWhatsApp(phone: string, text: string) {
    if(typeof phone!=='string' || !/^\+?\d{10,15}$/.test(phone.replace(/[ ()-]/g,'')) || typeof text!=='string' || !text.trim() || text.length>10000)throw new BadRequestException('Telefone com DDI e mensagem são obrigatórios.');
    const item=await this.prisma.mensagemFila.create({data:{destinatario:phone,mensagem:text,status:'PENDENTE',canal:'WHATSAPP'}});
    try {
      const response=await fetch(`${this.whatsappServiceUrl}/send`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({phone,message:text}),signal:AbortSignal.timeout(20000)});
      if(!response.ok)throw Error();const data=await response.json();if(!data.success || data.simulado || !data.messageId)throw Error();
      await this.prisma.mensagemFila.update({where:{id:item.id},data:{status:'ENVIADO'}});return data;
    }catch {await this.prisma.mensagemFila.update({where:{id:item.id},data:{status:'FALHA'}});throw new ServiceUnavailableException('WhatsApp não enviado. Confira a conexão do número oficial.');}
  }
  async sendAgendamentoConfirmacao(pacienteNome: string, responsavelPhone: string, dataHora: string) {
    return this.sendWhatsApp(responsavelPhone,`Olá! Confirmamos o agendamento de ${pacienteNome} para ${dataHora}. Caso precise desmarcar, avise com 24h de antecedência.`);
  }
  async sendLembreteCobranca(responsavelNome: string, responsavelPhone: string, valor: string, vencimento: string) {
    return this.sendWhatsApp(responsavelPhone,`Olá ${responsavelNome}! Lembramos que a mensalidade de R$ ${valor} vence em ${vencimento}. Confira os dados de pagamento no Portal dos Pais ou com a recepção.`);
  }
  async getWhatsAppQueue() {return this.prisma.mensagemFila.findMany({orderBy:{criadoEm:'desc'},take:50});}

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
