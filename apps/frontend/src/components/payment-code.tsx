"use client";
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { toast } from 'sonner';
export function PaymentCode({id}:{id:string}) {
 const [data,setData]=useState<any>(null),[error,setError]=useState('');
 useEffect(()=>{let active=true;setData(null);setError('');api.get(`/financeiro/${id}/pix`).then(r=>{if(active)setData(r.data)}).catch(e=>{if(active)setError(e.response?.data?.message || 'Não foi possível carregar o PIX.')});return()=>{active=false}},[id]);
 if(error)return <p role="alert" className="text-sm text-red-700">{error}</p>;
 if(!data)return <p role="status">Carregando dados de pagamento…</p>;
 return <div className="space-y-3 text-center"><img src={data.qrCode} alt="QR Code PIX desta cobrança" width={240} height={240} className="mx-auto"/><p className="font-bold">{data.beneficiario}</p><p className="text-sm">R$ {Number(data.valor).toFixed(2).replace('.',',')}</p><label className="block text-sm">PIX Copia e Cola<textarea readOnly value={data.payload} className="block w-full border rounded-xl p-2 text-xs mt-2 break-all" rows={4}/></label><button className="bg-purple-600 text-white rounded-xl px-4 py-3" onClick={()=>navigator.clipboard.writeText(data.payload).then(()=>toast.success('Código copiado.')).catch(()=>toast.error('Selecione e copie o código acima.'))}>Copiar código PIX</button><p className="text-xs text-gray-500">Confira o beneficiário no seu banco. A baixa acontece após conferência do financeiro.</p></div>;
}
