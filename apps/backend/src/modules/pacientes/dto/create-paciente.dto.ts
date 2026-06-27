import {
  IsString, IsOptional, IsEnum, IsDateString, IsArray,
  ValidateNested, IsEmail, IsBoolean, ArrayMaxSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Sexo, TipoResponsavel } from '@prisma/client';

export class CreateResponsavelDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  telefone?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  whatsapp?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ enum: TipoResponsavel })
  @IsEnum(TipoResponsavel)
  grauParent: TipoResponsavel;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  profissao?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isPrincipal?: boolean;
}

export class CreateDiagnosticoDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cid?: string;

  @ApiProperty()
  @IsString()
  descricao: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacoes?: string;
}

export class CreatePacienteDto {
  @ApiProperty()
  @IsString()
  nome: string;

  @ApiPropertyOptional({ enum: Sexo })
  @IsOptional()
  @IsEnum(Sexo)
  sexo?: Sexo;

  @ApiProperty()
  @IsDateString()
  dataNascimento: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rg?: string;

  // Endereço
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cep?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  logradouro?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  numero?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  complemento?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  bairro?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  cidade?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  estado?: string;

  // Escola
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  escola?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  serie?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  turnoEscolar?: string;

  // Informações médicas
  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  alergias?: string[];

  @ApiPropertyOptional({ type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  medicamentos?: string[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  convenio?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  observacoes?: string;

  // Responsáveis
  @ApiPropertyOptional({ type: [CreateResponsavelDto] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  @ValidateNested({ each: true })
  @Type(() => CreateResponsavelDto)
  responsaveis?: CreateResponsavelDto[];

  // Diagnósticos
  @ApiPropertyOptional({ type: [CreateDiagnosticoDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateDiagnosticoDto)
  diagnosticos?: CreateDiagnosticoDto[];
}
