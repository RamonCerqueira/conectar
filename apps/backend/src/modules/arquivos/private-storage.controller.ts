import { Controller, Get, Query, Res, NotFoundException, ForbiddenException } from '@nestjs/common';
import { Response } from 'express';
import { resolve, sep } from 'path';
import { realpath, stat } from 'fs/promises';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
@Controller('arquivos')
export class PrivateStorageController {
 constructor(private prisma: PrismaService) {}
 @Get('download')
 async download(@Query('path') path: string, @CurrentUser() user: any, @Res() res: Response) {
  if (!path || !path.startsWith('/storage/') || path.includes('\\') || path.includes('\0')) throw new NotFoundException();
  let root: string, file: string;
  try { root = await realpath(resolve(process.cwd(), process.env.STORAGE_PATH || './storage')); file = await realpath(resolve(root, path.slice('/storage/'.length))); } catch { throw new NotFoundException('Arquivo não encontrado.'); }
  if (!file.startsWith(root+sep) || !(await stat(file)).isFile()) throw new NotFoundException();
  const [arquivo,contrato,laudo,exercicio,lancamento] = await Promise.all([
   this.prisma.arquivo.findFirst({where:{caminho:path}}), this.prisma.contrato.findFirst({where:{caminho:path}}),
   this.prisma.laudo.findFirst({where:{caminhoPdf:path}}), this.prisma.exercicioCasa.findFirst({where:{url:{endsWith:path}}}),
   this.prisma.lancamento.findFirst({where:{comprovante:path}}),
  ]);
  if (!arquivo && !contrato && !laudo && !exercicio && !lancamento) throw new NotFoundException();
  if (user.perfil === 'PAIS') {
   const parent=await this.prisma.responsavel.findUnique({where:{id:user.id},select:{pacienteId:true,ativoPortal:true}});
   const allowed = parent?.ativoPortal && ((arquivo?.pacienteId===parent.pacienteId) || (contrato?.pacienteId===parent.pacienteId) || (laudo?.publicado && laudo.pacienteId===parent.pacienteId) || (exercicio?.pacienteId===parent.pacienteId) || (lancamento?.tipo==='RECEITA' && lancamento.pacienteId===parent.pacienteId));
   if (!allowed) throw new ForbiddenException('Este documento não pertence à sua família.');
  } else {
   const clinical=['ADMINISTRADOR','DIRETOR','COORDENADOR','RECEPCAO','PSICOLOGO','PSICOPEDAGOGO','NEUROPSICÓLOGO','FONOAUDIOLOGO','TERAPEUTA_OCUPACIONAL','PEDAGOGO','SUPERVISOR'];
   const financial=['ADMINISTRADOR','DIRETOR','FINANCEIRO'];
   if (!(lancamento ? financial.includes(user.perfil) || lancamento.colaboradorId===user.id : clinical.includes(user.perfil))) throw new ForbiddenException();
  }
  res.setHeader('Cache-Control','private, no-store');res.setHeader('X-Content-Type-Options','nosniff');
  return res.download(file, arquivo?.nomeOriginal || file.split(sep).pop() || 'documento');
 }
}
