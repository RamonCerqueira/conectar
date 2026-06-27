import { Module } from '@nestjs/common';
import { EscolarController } from './escolar.controller';
import { EscolarService } from './escolar.service';

@Module({
  controllers: [EscolarController],
  providers: [EscolarService],
  exports: [EscolarService],
})
export class EscolarModule {}
