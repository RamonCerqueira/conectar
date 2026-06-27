import { Module } from '@nestjs/common';
import { SalasController } from './salas.controller';
import { SalasService } from './salas.service';
import { WebsocketModule } from '../websocket/websocket.module';
@Module({ imports: [WebsocketModule], controllers: [SalasController], providers: [SalasService], exports: [SalasService] })
export class SalasModule {}
