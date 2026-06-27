import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { StatusAgendamento } from '@prisma/client';

export class AgendaQueryDto {
  @ApiPropertyOptional() @IsOptional() @IsDateString() inicio?: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() fim?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() profissionalId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() pacienteId?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() salaId?: string;
  @ApiPropertyOptional({ enum: StatusAgendamento }) @IsOptional() @IsEnum(StatusAgendamento) status?: StatusAgendamento;
}
