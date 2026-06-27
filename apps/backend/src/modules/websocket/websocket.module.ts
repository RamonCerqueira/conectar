import { Module } from '@nestjs/common';
import { AgendaGateway } from './agenda.gateway';

@Module({
  providers: [AgendaGateway],
  exports: [AgendaGateway],
})
export class WebsocketModule {}
