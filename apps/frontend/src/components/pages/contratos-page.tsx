"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Plus,
  X,
  Search,
  CheckCircle,
  Clock,
  User,
  ShieldAlert,
  Upload,
  Calendar,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";

// ─── DADOS MOCKADOS COMPLETOS ───────────────────────────────────────────────
const initialContratos = [
  {
    id: "cont-1",
    pacienteNome: "Lucas Mendes da Silva",
    tipo: "Contrato de Prestação de Serviços",
    caminho: "/storage/contratos/lucas_mendes_prestacao.pdf",
    assinado: true,
    assinadoEm: "2026-02-10T10:00:00Z",
    criadoEm: "2026-02-10",
  },
  {
    id: "cont-2",
    pacienteNome: "Lucas Mendes da Silva",
    tipo: "Termo de Consentimento LGPD",
    caminho: "/storage/contratos/lucas_mendes_lgpd.pdf",
    assinado: true,
    assinadoEm: "2026-02-10T10:05:00Z",
    criadoEm: "2026-02-10",
  },
  {
    id: "cont-3",
    pacienteNome: "Sofia Andrade Rezende",
    tipo: "Autorização de Uso de Imagem",
    caminho: "/storage/contratos/sofia_andrade_imagem.pdf",
    assinado: false,
    assinadoEm: null,
    criadoEm: "2026-06-02",
  },
  {
    id: "cont-4",
    pacienteNome: "Arthur Neves",
    tipo: "Contrato de Prestação de Serviços",
    caminho: "/storage/contratos/arthur_neves_prestacao.pdf",
    assinado: false,
    assinadoEm: null,
    criadoEm: "2026-06-25",
  },
];

export function ContratosPage() {
  const [contratos, setContratos] = useState(initialContratos);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form States
  const [paciente, setPaciente] = useState("");
  const [tipo, setTipo] = useState("Contrato de Prestação de Serviços");

  const handleCreateContrato = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paciente) return;

    const newCont = {
      id: `cont-${Date.now()}`,
      pacienteNome: paciente,
      tipo: tipo,
      caminho: `/storage/contratos/${paciente.toLowerCase().replace(/ /g, "_")}.pdf`,
      assinado: false,
      assinadoEm: null,
      criadoEm: new Date().toISOString().split("T")[0],
    };

    setContratos([newCont, ...contratos]);
    setIsModalOpen(false);
    setPaciente("");
  };

  const handleSign = (id: string) => {
    setContratos(
      contratos.map((c) =>
        c.id === id ? { ...c, assinado: true, assinadoEm: new Date().toISOString() } : c
      )
    );
  };

  const filteredContratos = contratos.filter((c) =>
    c.pacienteNome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.tipo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Contratos, LGPD & Autorizações
          </h1>
          <p className="text-sm text-muted-foreground">
            Gestão de termos de consentimento, contratos de prestação de serviço clínico e assinaturas digitais.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Novo Termo/Contrato</span>
        </motion.button>
      </div>

      {/* Filtros */}
      <div
        className="p-4 rounded-2xl border flex flex-col md:flex-row gap-4 bg-card"
        style={{ borderColor: "hsl(var(--border))" }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por paciente ou tipo de contrato..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors bg-muted border-transparent text-foreground"
          />
        </div>
      </div>

      {/* Grid de Contratos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContratos.map((cont) => (
          <motion.div
            layout
            key={cont.id}
            whileHover={{ y: -4 }}
            className="rounded-2xl border p-5 flex flex-col justify-between relative overflow-hidden transition-all shadow-sm bg-card"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            {/* Status Assinado */}
            <div className="absolute top-4 right-4">
              {cont.assinado ? (
                <span className="flex items-center gap-1 text-[9px] font-bold bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <CheckCircle className="h-3 w-3" /> Assinado
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[9px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full uppercase tracking-wider">
                  <Clock className="h-3 w-3" /> Pendente
                </span>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 pr-16">
                <div className="p-3 rounded-xl bg-purple-500/10 text-purple-500 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-sm text-foreground leading-tight truncate">
                    {cont.tipo}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1 truncate">
                    Paciente: {cont.pacienteNome}
                  </p>
                </div>
              </div>

              <div className="h-[1px] bg-border" />

              <div className="space-y-2 text-xs text-muted-foreground">
                <div className="flex justify-between">
                  <span>Criado em:</span>
                  <span className="font-medium text-foreground">{formatDate(cont.criadoEm)}</span>
                </div>
                {cont.assinado && cont.assinadoEm && (
                  <div className="flex justify-between">
                    <span>Assinado em:</span>
                    <span className="font-medium text-foreground">{formatDate(cont.assinadoEm)}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="h-[1px] bg-border my-4" />

            {/* Ações */}
            <div className="flex gap-2">
              <a
                href={cont.caminho}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                style={{ borderColor: "hsl(var(--border))", color: "hsl(var(--foreground))" }}
              >
                Visualizar PDF
              </a>

              {!cont.assinado && (
                <button
                  onClick={() => handleSign(cont.id)}
                  className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white gradient-primary shadow-sm hover:shadow-md transition-all cursor-pointer uppercase tracking-wider text-center"
                >
                  Assinar Digital
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* ─── MODAL NOVO TERMO ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="absolute inset-0" onClick={() => setIsModalOpen(false)} />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md rounded-2xl shadow-2xl border overflow-hidden bg-card"
              style={{ borderColor: "hsl(var(--border))" }}
            >
              {/* Header */}
              <div className="p-6 border-b flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-lg text-foreground">Novo Contrato ou Termo</h3>
                  <p className="text-xs text-muted-foreground mt-0.5">Associe um arquivo legal a uma criança.</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl hover:bg-muted text-muted-foreground cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleCreateContrato} className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Paciente</label>
                  <input
                    type="text"
                    required
                    placeholder="Nome completo do paciente"
                    value={paciente}
                    onChange={(e) => setPaciente(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs outline-none focus:ring-1 focus:ring-purple-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Tipo de Documento</label>
                  <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value)}
                    className="w-full p-2.5 rounded-xl border text-xs bg-card outline-none"
                  >
                    <option value="Contrato de Prestação de Serviços">Contrato de Prestação de Serviços</option>
                    <option value="Termo de Consentimento LGPD">Termo de Consentimento LGPD</option>
                    <option value="Autorização de Uso de Imagem">Autorização de Uso de Imagem</option>
                    <option value="Declaração de Frequência Clínica">Declaração de Frequência Clínica</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Upload do Arquivo PDF</label>
                  <div className="border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer hover:bg-muted/30 transition-colors">
                    <Upload className="h-8 w-8 text-purple-500 mb-2" />
                    <span className="text-xs font-semibold text-foreground">Clique para fazer upload</span>
                    <span className="text-[10px] text-muted-foreground mt-0.5">Apenas arquivos PDF (máx. 10MB)</span>
                  </div>
                </div>

                <div className="pt-4 border-t flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold hover:bg-muted transition-colors cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
                  >
                    Gerar Documento
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
