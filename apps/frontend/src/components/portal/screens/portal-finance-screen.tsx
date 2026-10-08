"use client";
import { downloadDocument } from "@/lib/private-download";
import { toast } from "sonner";
import { CreditCard } from "lucide-react";
import { formatCurrency, formatDate } from "@/lib/utils";
interface Props { financeiro:any[]; childName:string; parentName:string; onOpenPix:(invoice:any)=>void; }
export function PortalFinanceScreen({ financeiro, childName, onOpenPix }:Props) {
 const invoices = financeiro.filter(item=>item.tipo === "RECEITA");
 const pending = invoices.filter(item=>item.status !== "PAGO" && item.status !== "CANCELADO").reduce((sum,item)=>sum+Number(item.valor),0);
 return <div className="space-y-4 pb-4"><h1 className="text-xl font-bold">Financeiro da família</h1><div className="rounded-3xl p-6 bg-purple-600 text-white"><CreditCard size={24}/><p className="text-sm mt-3">Valores pendentes · {childName}</p><p className="text-3xl font-bold mt-1">{formatCurrency(pending)}</p></div><p className="text-sm text-gray-500">Recibos de pagamentos confirmados estão disponíveis abaixo. Para notas fiscais, consulte a recepção.</p>{invoices.length ? invoices.map(item => <article key={item.id} className="rounded-2xl bg-white p-5 border border-purple-100 space-y-2"><h2 className="font-bold">{item.descricao || "Atendimento"}</h2><p className="text-sm text-gray-500">Vencimento: {item.vencimento ? formatDate(item.vencimento) : "Não informado"}</p><div className="flex justify-between gap-3"><strong>{formatCurrency(Number(item.valor))}</strong><span className="text-sm">{item.status === "PAGO" ? "Pago" : item.status === "CANCELADO" ? "Cancelado" : "Pendente"}</span></div>{item.status === "PAGO" && <button onClick={()=>downloadDocument(`/financeiro/${item.id}/recibo`,`recibo-${item.id}.pdf`).catch(()=>toast.error("Recibo indisponível. Consulte a recepção."))} className="rounded-xl p-3 w-full bg-green-50 text-green-800 font-semibold">Baixar recibo</button>}{!["PAGO","CANCELADO"].includes(item.status) && <button onClick={()=>onOpenPix(item)} className="rounded-xl p-3 w-full bg-purple-50 text-purple-700 font-semibold">Pagar com PIX</button>}</article>) : <p className="rounded-2xl bg-white p-5 text-sm text-gray-500">Nenhuma cobrança cadastrada.</p>}</div>;
}
