import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: (origin: string, callback: any) => callback(null, true),
    credentials: true,
  },
  namespace: '/',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('ChatGateway');
  private usuariosConectados = new Map<string, string>(); // socketId -> usuarioId

  constructor(private chatService: ChatService) {}

  afterInit() {
    this.logger.log('💬 WebSocket Chat Gateway iniciado');
  }

  handleConnection(client: Socket) {
    const usuarioId = client.handshake.query.usuarioId as string;
    if (usuarioId) {
      this.usuariosConectados.set(client.id, usuarioId);
      client.join(`usuario:${usuarioId}`);
      this.logger.log(`Usuário ${usuarioId} entrou no chat via socket ${client.id}`);
      this.server.emit('chat:presenca', { usuarioId, online: true });
    }
  }

  handleDisconnect(client: Socket) {
    const usuarioId = this.usuariosConectados.get(client.id);
    if (usuarioId) {
      this.usuariosConectados.delete(client.id);
      this.logger.log(`Usuário ${usuarioId} desconectou do chat via socket ${client.id}`);
      this.server.emit('chat:presenca', { usuarioId, online: false });
    }
  }

  @SubscribeMessage('chat:join')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { usuarioId: string },
  ) {
    if (payload?.usuarioId) {
      this.usuariosConectados.set(client.id, payload.usuarioId);
      client.join(`usuario:${payload.usuarioId}`);
      this.logger.log(`Socket ${client.id} registrou usuario:${payload.usuarioId}`);
    }
  }

  @SubscribeMessage('chat:send')
  async handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { remetenteId: string; destinatarioId: string; conteudo: string },
  ) {
    try {
      const mensagem = await this.chatService.enviarMensagem(
        payload.remetenteId,
        payload.destinatarioId,
        payload.conteudo,
      );

      // Emitir em tempo real para o destinatário
      this.server.to(`usuario:${payload.destinatarioId}`).emit('chat:recebida', mensagem);

      // Confirmar para o próprio remetente (para atualização na UI)
      this.server.to(`usuario:${payload.remetenteId}`).emit('chat:enviada', mensagem);

      return { success: true, mensagem };
    } catch (error) {
      this.logger.error(`Erro ao processar mensagem via socket: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  @SubscribeMessage('chat:typing')
  handleTyping(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { remetenteId: string; destinatarioId: string; digitando: boolean },
  ) {
    this.server.to(`usuario:${payload.destinatarioId}`).emit('chat:digitando', {
      remetenteId: payload.remetenteId,
      digitando: payload.digitando,
    });
  }

  @SubscribeMessage('chat:marcar_lida')
  async handleMarkRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: { usuarioLogadoId: string; remetenteId: string },
  ) {
    await this.chatService.marcarComoLidas(payload.usuarioLogadoId, payload.remetenteId);
    
    // Notificar o remetente de que suas mensagens foram lidas pelo destinatário
    this.server.to(`usuario:${payload.remetenteId}`).emit('chat:lidas_confirmadas', {
      lidasPor: payload.usuarioLogadoId,
    });
  }
}
