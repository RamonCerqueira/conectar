import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('contatos')
  async getContatos(@Req() req: any) {
    const usuarioId = req.user?.id || req.user?.sub;
    return this.chatService.getContatosChat(usuarioId);
  }

  @Get('mensagens/:outroUsuarioId')
  async getHistorico(
    @Req() req: any,
    @Param('outroUsuarioId') outroUsuarioId: string,
  ) {
    const usuarioId = req.user?.id || req.user?.sub;
    return this.chatService.getHistoricoMensagens(usuarioId, outroUsuarioId);
  }

  @Post('mensagens')
  async enviarMensagem(
    @Req() req: any,
    @Body() body: { destinatarioId: string; conteudo: string },
  ) {
    const remetenteId = req.user?.id || req.user?.sub;
    return this.chatService.enviarMensagem(
      remetenteId,
      body.destinatarioId,
      body.conteudo,
    );
  }

  @Patch('ler/:outroUsuarioId')
  async marcarComoLidas(
    @Req() req: any,
    @Param('outroUsuarioId') outroUsuarioId: string,
  ) {
    const usuarioLogadoId = req.user?.id || req.user?.sub;
    return this.chatService.marcarComoLidas(usuarioLogadoId, outroUsuarioId);
  }

  @Get('nao-lidas')
  async getTotalNaoLidas(@Req() req: any) {
    const usuarioId = req.user?.id || req.user?.sub;
    return this.chatService.getTotalNaoLidas(usuarioId);
  }
}
