"use client";
import { PaymentSettings } from "@/components/payment-settings";
import { Building2, ShieldCheck, KeyRound, Database } from "lucide-react";
export function ConfiguracoesPage() {
 const cards = [
  { icon:Building2, title:"Instituto Conectar", text:"Edifício Aero — Av. Santos Dumont, nº 1883 (Km 1.5), Centro, Lauro de Freitas - BA, CEP 42702-400", detail:"Telefone de atendimento em atualização." },
  { icon:ShieldCheck, title:"Acesso ao sistema", text:"Os acessos usam contas autenticadas. No Portal dos Pais, cada responsável tem acesso aos dados da criança vinculada à sua conta.", detail:"Cadastre e atualize as contas pela área de colaboradores e profissionais." },
  { icon:KeyRound, title:"Integrações", text:"As credenciais de e-mail, WhatsApp e inteligência artificial são configuradas no servidor.", detail:"Solicite ao administrador a alteração das credenciais e a validação de cada integração." },
  { icon:Database, title:"Cópias de segurança", text:"A manutenção e a restauração do banco são realizadas pelo administrador do servidor.", detail:"Antes de atualizações, preserve uma cópia do banco e dos arquivos enviados." },
 ];
 return <div className="space-y-6"><div><h1 className="text-2xl font-bold">Configurações do Instituto</h1><p className="text-sm text-muted-foreground mt-1">Informações institucionais e orientações de administração.</p></div><PaymentSettings/><div className="grid md:grid-cols-2 gap-5">{cards.map(card=><section key={card.title} className="rounded-2xl border bg-card p-6 space-y-4"><div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center"><card.icon size={22}/></div><h2 className="font-bold text-lg">{card.title}</h2><p className="text-sm leading-relaxed">{card.text}</p><p className="text-sm text-muted-foreground leading-relaxed">{card.detail}</p></section>)}</div></div>;
}
