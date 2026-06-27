import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { PacientesController } from './pacientes.controller';
import { PacientesService } from './pacientes.service';

@Module({
  imports: [
    MulterModule.register({
      dest: './storage/pacientes',
    }),
  ],
  controllers: [PacientesController],
  providers: [PacientesService],
  exports: [PacientesService],
})
export class PacientesModule {}
