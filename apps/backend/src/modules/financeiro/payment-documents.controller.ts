import { Controller, Get, Put, Param, Body, Res, ForbiddenException, BadRequestException, NotFoundException, ServiceUnavailableException } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import * as QRCode from 'qrcode';
import { buildPix } from './pix';
const admins=['ADMINISTRADOR','DIRETOR'];
const financial=[...admins,'FINANCEIRO'];
@Controller('financeiro')
export class PaymentDocumentsController {
 constructor(private prisma:PrismaService) {}
 private async config():Promise<any>{const item=await this.prisma.configuracao.findUnique({where:{chave:'pagamentos_instituto'}});return item?.valor || {};}
 @Get('configuracao-pagamentos')
 async getConfig(@CurrentUser() user:any){if(!financial.includes(user.perfil))throw new ForbiddenException();return this.config();}
 @Put('configuracao-pagamentos')
 async saveConfig(@CurrentUser() user:any,@Body() body:any){
  if(!admins.includes(user.perfil))throw new ForbiddenException();
  const keys=['pixKey','nome','cidade','documento','endereco'];if(Object.keys(body).some(k=>!keys.includes(k)) || keys.some(k=>typeof body[k]!=='string' || body[k].length>250))throw new BadRequestException('Preencha os dados institucionais.');
  const data=Object.fromEntries(keys.map(k=>[k,body[k].trim()]));
  if(data.pixKey)buildPix(data.pixKey,data.nome,data.cidade,1,'VALIDACAO');
  return this.prisma.configuracao.upsert({where:{chave:'pagamentos_instituto'},create:{chave:'pagamentos_instituto',grupo:'financeiro',valor:data},update:{valor:data}});
 }
 private async entry(id:string,user:any,kind:'pix'|'recibo'|'holerite'){
  const entry=await this.prisma.lancamento.findUnique({where:{id},include:{paciente:{select:{nome:true}},colaborador:{select:{nome:true,cpfCnpj:true}}}});if(!entry)throw new NotFoundException();
  if(kind==='holerite'){
   if(!entry.colaboradorId || entry.tipo!=='DESPESA')throw new BadRequestException('Lançamento sem colaborador vinculado.');
   if(!financial.includes(user.perfil) && entry.colaboradorId!==user.id)throw new ForbiddenException();
  } else {
   if(entry.tipo!=='RECEITA')throw new BadRequestException('Este documento exige uma receita.');
   if(user.perfil==='PAIS'){const parent=await this.prisma.responsavel.findUnique({where:{id:user.id},select:{pacienteId:true,ativoPortal:true}});if(!parent?.ativoPortal || !entry.pacienteId || entry.pacienteId!==parent.pacienteId)throw new ForbiddenException();}
   else if(!financial.includes(user.perfil))throw new ForbiddenException();
  }
  return entry;
 }
 @Get(':id/pix')
 async pix(@Param('id') id:string,@CurrentUser() user:any){
  const entry=await this.entry(id,user,'pix');if(['PAGO','CANCELADO'].includes(entry.status))throw new BadRequestException('Cobrança já encerrada.');
  const config=await this.config();if(!config.pixKey || !config.nome || !config.cidade)throw new ServiceUnavailableException('PIX ainda não configurado pela administração.');
  const payload=buildPix(config.pixKey,config.nome,config.cidade,Number(entry.valor),entry.id);
  return {payload,qrCode:await QRCode.toDataURL(payload,{errorCorrectionLevel:'M',margin:2,width:300}),beneficiario:config.nome,chave:config.pixKey,valor:Number(entry.valor),confirmacao:'O pagamento será conferido pela equipe financeira.'};
 }
 @Get(':id/recibo')
 async receipt(@Param('id') id:string,@CurrentUser() user:any,@Res() res:Response){
  const e=await this.entry(id,user,'recibo');if(e.status!=='PAGO' || !e.pagamento)throw new BadRequestException('O recibo só pode ser emitido após a baixa do pagamento.');
  const c=await this.config();if(!c.nome || !c.documento || !c.endereco)throw new ServiceUnavailableException('Configure nome, CPF/CNPJ e endereço do emissor.');
  const lines=[`Emissor: ${c.nome}`,`CPF/CNPJ: ${c.documento}`,`Endereço: ${c.endereco}`,`Identificador: ${e.id}`,`Paciente: ${e.paciente?.nome || 'Não vinculado'}`,`Descrição: ${e.descricao}`,`Valor recebido: R$ ${Number(e.valor).toFixed(2).replace('.',',')}`,`Pagamento: ${e.pagamento.toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'})}`,`Forma: ${e.formaPagamento || 'Não informada'}`,'Recibo de pagamento registrado pelo Instituto. Não substitui nota fiscal.'];
  return this.pdf(res,'Recibo de pagamento',lines,`recibo-${e.id}.pdf`);
 }
 @Get(':id/holerite')
 async payslip(@Param('id') id:string,@CurrentUser() user:any,@Res() res:Response){const e=await this.entry(id,user,'holerite');const c=await this.config();return this.pdf(res,'Demonstrativo de pagamento',[`Instituto: ${c.nome || 'Instituto Conectar'}`,`CPF/CNPJ do emissor: ${c.documento || 'Não informado'}`,`Colaborador: ${e.colaborador!.nome}`,`CPF/CNPJ: ${e.colaborador!.cpfCnpj || 'Não informado'}`,`Referência: ${e.referencia || 'Não informada'}`,`Descrição: ${e.descricao}`,`Valor líquido: R$ ${Number(e.valor).toFixed(2).replace('.',',')}`,`Situação: ${e.status}`,`Pagamento: ${e.pagamento?.toLocaleDateString('pt-BR',{timeZone:'America/Sao_Paulo'}) || 'Ainda não pago'}`,`Detalhamento: ${e.observacoes || 'Não informado'}`],`holerite-${e.id}.pdf`);}
 private async pdf(res:Response,title:string,lines:string[],filename:string){
  const pdf=await PDFDocument.create();const font=await pdf.embedFont(StandardFonts.Helvetica);let page=pdf.addPage([595,842]),y=790;
  const safe=(v:string)=>v.replace(/[^\x20-\x7e\xa0-\xff]/g,' ');
  page.drawText(title,{x:40,y,size:20,font,color:rgb(.35,.2,.6)});y-=45;
  for(const line of lines){let part='';for(const word of safe(line).split(' ')){const next=part?part+' '+word:word;if(font.widthOfTextAtSize(next,11)>510 && part){page.drawText(part,{x:40,y,size:11,font});y-=19;part=word;}else part=next;if(y<60){page=pdf.addPage([595,842]);y=790;}}if(part){page.drawText(part,{x:40,y,size:11,font});y-=26;}}
  res.setHeader('Content-Type','application/pdf');res.setHeader('Content-Disposition',`attachment; filename="${filename}"`);res.setHeader('Cache-Control','private, no-store');return res.send(Buffer.from(await pdf.save()));
 }
}
