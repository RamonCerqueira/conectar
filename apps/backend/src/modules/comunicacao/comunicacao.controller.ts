import { Controller, Post, Get, Body, Delete, Param, Put } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { ComunicacaoService } from './comunicacao.service';

@ApiTags('comunicacao')
@ApiBearerAuth()
@Controller('comunicacao')
export class ComunicacaoController {
  constructor(private readonly comunicacaoService: ComunicacaoService) {}

  @Get('whatsapp/fila')
  @ApiOperation({ summary: 'Listar histórico/fila de mensagens enviadas do WhatsApp' })
  getWhatsAppQueue() {
    return this.comunicacaoService.getWhatsAppQueue();
  }

  @Post('email')
  sendEmail(@Body() body: { to: string; subject: string; content: string }) {
    return this.comunicacaoService.sendEmail(body.to, body.subject, body.content);
  }

  @Post('whatsapp')
  sendWhatsApp(@Body() body: { phone: string; text: string }) {
    return this.comunicacaoService.sendWhatsApp(body.phone, body.text);
  }

  @Post('whatsapp/confirmacao')
  sendConfirmacao(@Body() body: { pacienteNome: string; responsavelPhone: string; dataHora: string }) {
    return this.comunicacaoService.sendAgendamentoConfirmacao(body.pacienteNome, body.responsavelPhone, body.dataHora);
  }

  @Post('whatsapp/cobranca')
  sendCobranca(@Body() body: { responsavelNome: string; responsavelPhone: string; valor: string; vencimento: string }) {
    return this.comunicacaoService.sendLembreteCobranca(body.responsavelNome, body.responsavelPhone, body.valor, body.vencimento);
  }

  // ─── CHATBOT & LEADS TRIAGEM ENDPOINTS ───────────────────────────────────

  @Get('chatbot/passos')
  @ApiOperation({ summary: 'Listar passos do chatbot de triagem' })
  getChatbotSteps() {
    return this.comunicacaoService.getChatbotSteps();
  }

  @Post('chatbot/passos')
  @ApiOperation({ summary: 'Criar ou atualizar passo do chatbot' })
  createOrUpdateStep(@Body() body: any) {
    return this.comunicacaoService.createOrUpdateChatbotStep(body);
  }

  @Delete('chatbot/passos/:id')
  @ApiOperation({ summary: 'Excluir passo do chatbot' })
  deleteStep(@Param('id') id: string) {
    return this.comunicacaoService.deleteChatbotStep(id);
  }

  @Get('chatbot/leads')
  @ApiOperation({ summary: 'Listar todos os leads capturados na triagem' })
  getLeads() {
    return this.comunicacaoService.getLeads();
  }

  @Post('chatbot/leads')
  @ApiOperation({ summary: 'Criar ou editar lead' })
  createOrUpdateLead(@Body() body: any) {
    return this.comunicacaoService.createOrUpdateLead(body);
  }

  @Delete('chatbot/leads/:id')
  @ApiOperation({ summary: 'Excluir lead' })
  deleteLead(@Param('id') id: string) {
    return this.comunicacaoService.deleteLead(id);
  }

  @Post('chatbot/interagir')
  @ApiOperation({ summary: 'Simular mensagem do cliente respondida pelo chatbot' })
  interagirChatbot(@Body() body: { phone: string; text: string }) {
    return this.comunicacaoService.interagirChatbot(body.phone, body.text);
  }
}
