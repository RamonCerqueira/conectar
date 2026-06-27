import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@conectar.com' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @ApiProperty({ example: '••••••••' })
  @IsString()
  @MinLength(6, { message: 'Mínimo 6 caracteres' })
  password: string;
}
