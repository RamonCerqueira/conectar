import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { ComunicacaoService } from './comunicacao.service';

@ApiTags('comunicacao')
@ApiBearerAuth()
@Controller('comunicacao')
export class ComunicacaoController {
  constructor(private readonly comunicacaoService: ComunicacaoService) {}

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
}
