import { BadRequestException } from '@nestjs/common';
// BR Code: https://www.bcb.gov.br/content/estabilidadefinanceira/pix/Regulamento_Pix/II_ManualdePadroesparaIniciacaodoPix.pdf
export function buildPix(key: string, name: string, city: string, amount: number, txid: string) {
 const field=(id:string,value:string)=>id+Buffer.byteLength(value).toString().padStart(2,'0')+value;
 const ascii=(v:string,n:number)=>v.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toUpperCase().replace(/[^A-Z0-9 ]/g,'').slice(0,n);
 if(!key || Buffer.byteLength(key)>77 || !ascii(name,25) || !ascii(city,15) || !Number.isFinite(amount) || amount<=0 || amount>99999999.99) throw new BadRequestException('Dados PIX inválidos.');
 let payload=field('00','01')+field('26',field('00','br.gov.bcb.pix')+field('01',key))+field('52','0000')+field('53','986')+field('54',amount.toFixed(2))+field('58','BR')+field('59',ascii(name,25))+field('60',ascii(city,15))+field('62',field('05',txid.replace(/[^A-Za-z0-9]/g,'').slice(0,25) || '***'))+'6304';
 let crc=0xffff;for(const byte of Buffer.from(payload)){crc^=byte<<8;for(let i=0;i<8;i++)crc=crc&0x8000?(crc<<1)^0x1021:crc<<1;crc&=0xffff;}
 return payload+crc.toString(16).toUpperCase().padStart(4,'0');
}
