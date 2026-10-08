import { PrivateStorageController } from './private-storage.controller';
import { Module } from '@nestjs/common';
import { ArquivosController } from './arquivos.controller';
import { ArquivosService } from './arquivos.service';

@Module({
  controllers: [PrivateStorageController, ArquivosController],
  providers: [ArquivosService],
  exports: [ArquivosService],
})
export class ArquivosModule {}
