import { Transform } from 'class-transformer';
import { IsString, IsOptional, Length, Matches } from 'class-validator';
export class CreateListaEsperaDto {
 @IsString() @Length(2,120) nome!: string;
 @Transform(({value})=>typeof value === 'string' ? value.replace(/\D/g,'') : value)
 @IsString() @Matches(/^\d{10,13}$/) telefone!: string;
 @IsOptional() @IsString() @Length(1,120) especialidade?: string;
 @IsOptional() @IsString() @Length(0,2000) observacoes?: string;
}
