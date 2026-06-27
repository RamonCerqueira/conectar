"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Shield,
  Building,
  Key,
  Database,
  Lock,
  Eye,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ConfiguracoesPage() {
  const [activeSection, setActiveSection] = useState("clinica");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("Configurações gravadas com sucesso no banco!");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
          Configurações do Sistema
        </h1>
        <p className="text-sm text-muted-foreground">
          Gerenciamento técnico do monorepo, integrações de APIs, chaves de segurança e dados da clínica.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Navegação de Seções (1 coluna) */}
        <div className="lg:col-span-1 space-y-2">
          {[
            { id: "clinica", label: "Dados da Clínica", icon: Building },
            { id: "seguranca", label: "Segurança & RBAC", icon: Shield },
            { id: "integracoes", label: "APIs e Integrações", icon: Key },
            { id: "backup", label: "Backup de Dados", icon: Database },
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer text-left",
                activeSection === sec.id
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              <sec.icon className="h-4 w-4 shrink-0" />
              <span>{sec.label}</span>
            </button>
          ))}
        </div>

        {/* Formulário (3 colunas) */}
        <form
          onSubmit={handleSave}
          className="lg:col-span-3 p-6 rounded-2xl border bg-card space-y-6 text-xs"
          style={{ borderColor: "hsl(var(--border))" }}
        >
          {successMsg && (
            <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-xl font-bold flex items-center gap-2">
              <CheckCircle className="h-4 w-4" /> {successMsg}
            </div>
          )}

          {activeSection === "clinica" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Identidade do Instituto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Razão Social</label>
                  <input
                    type="text"
                    defaultValue="Instituto Conectar Apoio à Aprendizagem LTDA"
                    className="w-full p-2.5 rounded-xl border outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">CNPJ</label>
                  <input
                    type="text"
                    defaultValue="12.345.678/0001-99"
                    className="w-full p-2.5 rounded-xl border outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Telefone Comercial</label>
                  <input
                    type="text"
                    defaultValue="(11) 98765-4321"
                    className="w-full p-2.5 rounded-xl border outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">E-mail de Contato</label>
                  <input
                    type="email"
                    defaultValue="contato@institutoconectar.com.br"
                    className="w-full p-2.5 rounded-xl border outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeSection === "seguranca" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Políticas de Acesso (RBAC)</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-border text-purple-500 outline-none"
                  />
                  Forçar expiração de sessão JWT a cada 24 horas
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="rounded border-border text-purple-500 outline-none"
                  />
                  Bloquear login após 5 tentativas mal-sucedidas
                </label>
                <label className="flex items-center gap-2 cursor-pointer font-bold text-foreground">
                  <input
                    type="checkbox"
                    className="rounded border-border text-purple-500 outline-none"
                  />
                  Habilitar autenticação de 2 fatores (2FA) para Administradores
                </label>
              </div>
            </div>
          )}

          {activeSection === "integracoes" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Chaves e Credenciais de APIs</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Google Gemini API Key</label>
                  <div className="flex gap-2">
                    <input
                      type="password"
                      defaultValue="AIzaSyA1234567890-ExampleKey"
                      className="w-full p-2.5 rounded-xl border outline-none"
                    />
                  </div>
                  <p className="text-[10px] text-muted-foreground">Chave de API necessária para rodar sugestões de planos terapêuticos e resumos clínicos.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Servidor WhatsApp Microservice URL</label>
                  <input
                    type="text"
                    defaultValue="http://localhost:5002"
                    className="w-full p-2.5 rounded-xl border outline-none"
                  />
                  <p className="text-[10px] text-muted-foreground">Endpoints do microserviço de gatilhos automáticos do WhatsApp Web.</p>
                </div>
              </div>
            </div>
          )}

          {activeSection === "backup" && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-foreground">Backups Automáticos</h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Frequência do pg_dump</label>
                  <select className="w-full p-2.5 rounded-xl border bg-card outline-none">
                    <option>Diário (Às 03:00 da manhã)</option>
                    <option>Semanal (Domingos)</option>
                    <option>Mensal</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Retenção de Arquivos de Backup</label>
                  <select className="w-full p-2.5 rounded-xl border bg-card outline-none">
                    <option>Manter últimos 30 backups</option>
                    <option>Manter últimos 15 backups</option>
                    <option>Manter todos</option>
                  </select>
                </div>

                <button
                  type="button"
                  className="px-4 py-2.5 rounded-xl border font-bold hover:bg-muted transition-colors text-purple-500 cursor-pointer"
                  style={{ borderColor: "hsl(var(--border))" }}
                >
                  Executar Backup pg_dump Manual Agora
                </button>
              </div>
            </div>
          )}

          <div className="pt-4 border-t flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
            >
              Gravar Configurações
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
