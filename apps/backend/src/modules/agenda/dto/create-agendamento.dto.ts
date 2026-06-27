import { IsString, IsOptional, IsDateString, IsEnum, IsBoolean, IsInt, Min, Max } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TipoAtendimento } from '@prisma/client';

export class CreateAgendamentoDto {
  @ApiProperty()
  @IsString()
  pacienteId: string;

  @ApiProperty()
  @IsString()
  profissionalId: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  salaId?: string;

  @ApiProperty({ example: '2026-06-27T09:00:00' })
  @IsDateString()
  data: string;

  @ApiProperty({ example: '2026-06-27T10:00:00' })
  @IsDateString()
  dataFim: string;

  @ApiPropertyOptional({ enum: TipoAtendimento, default: 'PRESENCIAL' })
  @IsOptional()
  @IsEnum(TipoAtendimento)
  tipo?: TipoAtendimento;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacoes?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  linkOnline?: string;

  @ApiPropertyOptional({ description: 'Repetir semanalmente?' })
  @IsOptional()
  @IsBoolean()
  repetirSemanal?: boolean;

  @ApiPropertyOptional({ description: 'Quantas semanas repetir (máx 52)', minimum: 1, maximum: 52 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(52)
  semanas?: number;
}
