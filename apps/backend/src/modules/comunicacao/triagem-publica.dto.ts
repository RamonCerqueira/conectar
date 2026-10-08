import { Transform } from 'class-transformer';
import { IsIn, IsString, Length, Matches } from 'class-validator';
export class TriagemPublicaDto {
  @IsString() @Length(3, 120) nomeCrianca!: string;
  @IsString() @Length(1, 30) idade!: string;
  @Transform(({ value }) => typeof value === 'string' ? value.replace(/\D/g, '') : value)
  @IsString() @Matches(/^\d{10,13}$/) telefone!: string;
  @IsString() @Length(10, 2000) queixa!: string;
  @IsIn(['Manhã', 'Tarde', 'Ambos']) periodo!: string;
}
