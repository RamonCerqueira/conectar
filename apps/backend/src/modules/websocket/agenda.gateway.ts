import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: { origin: process.env.FRONTEND_URL || 'http://localhost:5000', credentials: true },
  namespace: '/',
})
export class AgendaGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;
  private logger = new Logger('AgendaGateway');

  afterInit() {
    this.logger.log('🔌 WebSocket Gateway iniciado');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Cliente conectado: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Cliente desconectado: ${client.id}`);
  }

  // ─── Entrar em sala de profissional ─────────────────────────
  @SubscribeMessage('join:profissional')
  handleJoinProfissional(client: Socket, profissionalId: string) {
    client.join(`profissional:${profissionalId}`);
  }

  // ─── Emitir eventos do servidor ──────────────────────────────
  emitAgendamentoAtualizado(agendamento: any) {
    this.server.emit('agendamento:atualizado', agendamento);
    if (agendamento.profissionalId) {
      this.server.to(`profissional:${agendamento.profissionalId}`)
        .emit('agenda:refresh');
    }
  }

  emitNovoAgendamento(agendamento: any) {
    this.server.emit('agendamento:novo', agendamento);
  }

  emitNotificacao(usuarioId: string, notificacao: any) {
    this.server.to(`usuario:${usuarioId}`).emit('notificacao', notificacao);
  }

  emitSalaAtualizada(sala: any) {
    this.server.emit('sala:atualizada', sala);
  }

  emitPagamentoRecebido(lancamento: any) {
    this.server.emit('pagamento:recebido', lancamento);
  }
}
