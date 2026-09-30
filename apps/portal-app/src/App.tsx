import React, { useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { 
  Home, 
  Calendar, 
  Users, 
  FileText, 
  DollarSign, 
  User, 
  Bell, 
  Sparkles,
  CheckCircle2,
  Download,
  QrCode,
  ShieldCheck,
  ChevronRight,
  Clock,
  Heart
} from "lucide-react";

// Tela 1: Início / Dashboard
function HomeScreen() {
  const navigate = useNavigate();
  return (
    <div className="space-y-5 pb-24">
      {/* Banner Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#8D5BD1] via-[#7B46C4] to-[#6332A8] p-6 text-white shadow-xl shadow-[#8D5BD1]/25">
        <div className="relative z-10 flex items-start justify-between">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Portal da Família
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight">Olá, Família da Clara! 👋</h1>
            <p className="mt-1 text-sm text-purple-100">
              Próxima sessão: <span className="font-semibold text-white">Psicologia às 14:00</span>
            </p>
          </div>
          <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-2xl shadow-inner">
            🦉
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button 
            onClick={() => navigate("/agenda")}
            className="flex-1 rounded-2xl bg-white px-4 py-2.5 text-xs font-bold text-[#8D5BD1] shadow-md active:scale-95 transition-transform"
          >
            Confirmar Presença
          </button>
          <button 
            onClick={() => navigate("/familia")}
            className="rounded-2xl bg-white/15 px-4 py-2.5 text-xs font-semibold text-white border border-white/20 active:scale-95 transition-transform"
          >
            Ver Equipe
          </button>
        </div>
      </div>

      {/* Grid de Acessos Rápidos */}
      <div className="grid grid-cols-2 gap-3.5">
        <button 
          onClick={() => navigate("/agenda")}
          className="flex flex-col items-start p-4 rounded-3xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100/80 shadow-sm text-left active:scale-[0.98] transition-transform"
        >
          <div className="p-2.5 rounded-2xl bg-emerald-500/10 text-emerald-600 mb-3">
            <Calendar className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-800">Agenda & Presença</span>
          <span className="text-xs text-slate-500 mt-0.5">Confirmação em 1 toque</span>
        </button>

        <button 
          onClick={() => navigate("/conteudos")}
          className="flex flex-col items-start p-4 rounded-3xl bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100/80 shadow-sm text-left active:scale-[0.98] transition-transform"
        >
          <div className="p-2.5 rounded-2xl bg-[#8D5BD1]/10 text-[#8D5BD1] mb-3">
            <FileText className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-800">Laudos & Guias</span>
          <span className="text-xs text-slate-500 mt-0.5">Assinatura digital</span>
        </button>

        <button 
          onClick={() => navigate("/financeiro")}
          className="flex flex-col items-start p-4 rounded-3xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100/80 shadow-sm text-left active:scale-[0.98] transition-transform"
        >
          <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-600 mb-3">
            <DollarSign className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-800">Recibos & IRPF</span>
          <span className="text-xs text-slate-500 mt-0.5">Reembolso convênio</span>
        </button>

        <button 
          onClick={() => navigate("/familia")}
          className="flex flex-col items-start p-4 rounded-3xl bg-gradient-to-br from-blue-50 to-sky-50 border border-blue-100/80 shadow-sm text-left active:scale-[0.98] transition-transform"
        >
          <div className="p-2.5 rounded-2xl bg-blue-500/10 text-blue-600 mb-3">
            <Users className="w-5 h-5" />
          </div>
          <span className="text-sm font-bold text-slate-800">Evolução & Equipe</span>
          <span className="text-xs text-slate-500 mt-0.5">Linha do tempo</span>
        </button>
      </div>

      {/* Card Mascote e Dica do Dia */}
      <div className="rounded-3xl bg-white p-5 border border-purple-100/80 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center text-2xl shrink-0">
            🦁
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Dica da Terapeuta Ocupacional</h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              "Hoje a Clara alcançou 100% de autonomia ao calçar o tênis sozinha! Elogie esse esforço em casa."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tela 2: Agenda
function AgendaScreen() {
  const [confirmed, setConfirmed] = useState(false);
  return (
    <div className="space-y-4 pb-24">
      <div className="rounded-3xl bg-white p-5 border border-purple-100/80 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-[#8D5BD1] uppercase tracking-wider">Hoje • 14:00</span>
            <h2 className="text-lg font-bold text-slate-900 mt-0.5">Sessão de Psicoterapia</h2>
            <p className="text-xs text-slate-500">Dra. Camila Vasconcelos • Sala 03</p>
          </div>
          <div className="h-10 w-10 rounded-2xl bg-purple-50 flex items-center justify-center text-[#8D5BD1]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-medium text-slate-600">Presença no local:</span>
          {confirmed ? (
            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-4 h-4" /> Presença Confirmada!
            </span>
          ) : (
            <button
              onClick={() => setConfirmed(true)}
              className="bg-[#8D5BD1] text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md active:scale-95 transition-all"
            >
              Confirmar em 1 Toque
            </button>
          )}
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 border border-purple-100/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Próximos Dias</h3>
        <div className="space-y-3">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Fonoaudiologia</p>
              <p className="text-[11px] text-slate-500">Quinta-feira • 15:30</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Agendado</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-slate-800">Terapia Ocupacional</p>
              <p className="text-[11px] text-slate-500">Sexta-feira • 10:00</p>
            </div>
            <span className="text-xs font-semibold text-slate-400">Agendado</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tela 3: Família & Evolução
function FamilyScreen() {
  return (
    <div className="space-y-4 pb-24">
      <div className="rounded-3xl bg-white p-5 border border-purple-100/80 shadow-sm flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#8D5BD1] to-purple-400 flex items-center justify-center text-white text-2xl font-bold shadow-md">
          C
        </div>
        <div>
          <h2 className="text-lg font-bold text-slate-900">Clara Cerqueira</h2>
          <p className="text-xs text-slate-500">6 anos • Acompanhamento Multidisciplinar</p>
          <div className="mt-2 flex items-center gap-1.5">
            <span className="text-[11px] font-semibold bg-emerald-100 text-emerald-700 px-2.5 py-0.5 rounded-full">
              Em evolução contínua
            </span>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 border border-purple-100/80 shadow-sm">
        <h3 className="text-sm font-bold text-slate-800 mb-3">Equipe Conectar</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-[#8D5BD1] flex items-center justify-center font-bold text-xs">
                CV
              </div>
              <div>
                <p className="text-xs font-bold text-slate-800">Dra. Camila Vasconcelos</p>
                <p className="text-[11px] text-slate-500">Psicóloga Infantil (CRP 03/12345)</p>
              </div>
            </div>
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Tela 4: Conteúdos & Laudos
function ContentScreen() {
  return (
    <div className="space-y-4 pb-24">
      <div className="rounded-3xl bg-white p-5 border border-purple-100/80 shadow-sm">
        <h2 className="text-base font-bold text-slate-900">Laudos e Documentos Oficiais</h2>
        <p className="text-xs text-slate-500 mt-1">Carimbo e assinatura digital verificável pela clínica.</p>

        <div className="mt-4 space-y-3">
          <div className="p-4 rounded-2xl bg-purple-50/50 border border-purple-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[#8D5BD1]" />
              <div>
                <p className="text-xs font-bold text-slate-800">Relatório Neuropsicológico 2026.pdf</p>
                <p className="text-[10px] text-slate-500">Emitido em 15/03/2026 • 2.4 MB</p>
              </div>
            </div>
            <button className="p-2 rounded-xl bg-white border border-purple-200 text-[#8D5BD1] active:scale-95">
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Tela 5: Financeiro e Recibos de Reembolso
function FinanceScreen() {
  return (
    <div className="space-y-4 pb-24">
      <div className="rounded-3xl bg-white p-5 border border-purple-100/80 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold text-emerald-600 uppercase">Mensalidade Março/2026</span>
            <h2 className="text-2xl font-bold text-slate-900 mt-1">R$ 1.450,00</h2>
            <p className="text-xs text-slate-500">Plano Terapêutico Integrado</p>
          </div>
          <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-600">
            <QrCode className="w-6 h-6" />
          </div>
        </div>

        <div className="mt-5 flex gap-2">
          <button className="flex-1 bg-emerald-600 text-white text-xs font-bold py-2.5 rounded-xl shadow-md active:scale-95">
            Pagar com PIX
          </button>
          <button className="bg-slate-100 text-slate-700 text-xs font-semibold px-4 py-2.5 rounded-xl active:scale-95">
            Ver Fatura
          </button>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-5 border border-purple-100/80 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-slate-800">Recibos de Reembolso (IRPF & Convênios)</h3>
          <ShieldCheck className="w-4 h-4 text-purple-600" />
        </div>
        <p className="text-xs text-slate-500 leading-relaxed mb-4">
          Recibos com carimbo oficial, CRM/CRP e CNPJ do Instituto Conectar para reembolso no Bradesco, Amil, Unimed e SulAmérica.
        </p>

        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-800">Recibo_Fev_2026_Assinado.pdf</p>
            <p className="text-[10px] text-emerald-600 font-medium">Validado para Imposto de Renda</p>
          </div>
          <button className="text-xs font-bold text-[#8D5BD1] flex items-center gap-1">
            Baixar <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// App Principal com Bottom Navigation Mobile
export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { label: "Início", path: "/", icon: Home },
    { label: "Agenda", path: "/agenda", icon: Calendar },
    { label: "Família", path: "/familia", icon: Users },
    { label: "Laudos", path: "/conteudos", icon: FileText },
    { label: "Recibos", path: "/financeiro", icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-[#FAF7FD] text-slate-800 flex flex-col justify-between">
      {/* Header Mobile com Safe Area */}
      <header className="sticky top-0 z-30 bg-[#FAF7FD]/90 backdrop-blur-md px-5 pt-12 pb-3 flex items-center justify-between border-b border-purple-100/50">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#8D5BD1] flex items-center justify-center text-white font-black text-sm shadow-md shadow-[#8D5BD1]/30">
            C
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#8D5BD1]">Instituto</span>
            <h1 className="text-sm font-black leading-none text-slate-800">Conectar Família</h1>
          </div>
        </div>

        <button className="w-9 h-9 rounded-xl bg-white border border-purple-100 flex items-center justify-center text-slate-600 shadow-sm active:scale-95">
          <Bell className="w-4 h-4 text-[#8D5BD1]" />
        </button>
      </header>

      {/* Conteúdo Principal com scroll suave */}
      <main className="flex-1 px-5 pt-4">
        <Routes>
          <Route path="/" element={<HomeScreen />} />
          <Route path="/agenda" element={<AgendaScreen />} />
          <Route path="/familia" element={<FamilyScreen />} />
          <Route path="/conteudos" element={<ContentScreen />} />
          <Route path="/financeiro" element={<FinanceScreen />} />
        </Routes>
      </main>

      {/* Bottom Bar Nativa Fixa */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-purple-100/80 px-4 pt-2.5 pb-7 flex items-center justify-around shadow-lg shadow-purple-900/5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1 active:scale-90 transition-transform"
            >
              <div className={`p-1.5 rounded-xl transition-colors ${isActive ? "bg-[#8D5BD1] text-white" : "text-slate-400"}`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={`text-[10px] font-bold ${isActive ? "text-[#8D5BD1]" : "text-slate-400"}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
