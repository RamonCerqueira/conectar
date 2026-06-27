import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { UsuariosService } from './usuarios.service';

@ApiTags('usuarios')
@ApiBearerAuth()
@Controller('usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os usuários' })
  findAll() { return this.usuariosService.findAll(); }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar usuário por ID' })
  findOne(@Param('id') id: string) { return this.usuariosService.findOne(id); }

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  create(@Body() body: any) { return this.usuariosService.create(body); }

  @Put(':id')
  @ApiOperation({ summary: 'Atualizar usuário' })
  update(@Param('id') id: string, @Body() body: any) { return this.usuariosService.update(id, body); }

  @Put(':id/senha')
  @ApiOperation({ summary: 'Alterar senha' })
  changePassword(@Param('id') id: string, @Body() body: { novaSenha: string }) {
    return this.usuariosService.changePassword(id, body.novaSenha);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Inativar usuário' })
  remove(@Param('id') id: string) { return this.usuariosService.remove(id); }
}
