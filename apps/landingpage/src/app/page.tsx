"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { X } from "lucide-react";

// Import Modular Components matching the design specifications
import ReferenceLanding from "@/components/ReferenceLanding";


const apiBase = (process.env.NEXT_PUBLIC_API_URL || (process.env.NODE_ENV === "production" ? "https://api.institutoconectar.net.br/api" : "http://localhost:5101/api")).replace(/\/+$/, "");

export default function Home() {
  const reducedMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  // Contact form state
  const [leadModalOpen, setLeadModalOpen] = useState(false);
  // Lead Form state
  const [leadForm, setLeadForm] = useState({
    nomeCrianca: "",
    idade: "",
    telefone: "",
    queixa: "",
    periodo: "Tarde",
  });

  // Zod-like validation errors state
  const [sending, setSending] = useState(false);
  const [notice, setNotice] = useState("");
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (!leadModalOpen) return;
    const previous = document.activeElement as HTMLElement | null;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const frame = requestAnimationFrame(() => dialogRef.current?.querySelector<HTMLElement>("input")?.focus());
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") { event.preventDefault(); setLeadModalOpen(false); }
      if (event.key !== "Tab") return;
      const fields = Array.from(dialogRef.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input, textarea, select, a[href]") || []);
      const first = fields[0], last = fields[fields.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first?.focus(); }
    };
    document.addEventListener("keydown", keydown);
    return () => { cancelAnimationFrame(frame); document.removeEventListener("keydown", keydown); document.body.style.overflow = oldOverflow; previous?.focus(); };
  }, [leadModalOpen]);

  const validateLeadForm = () => {
    const newErrors: any = {};
    if (leadForm.nomeCrianca.trim().length < 3) {
      newErrors.nomeCrianca =
        "O nome do seu filho deve ter pelo menos 3 caracteres.";
    }
    if (!leadForm.idade.trim()) {
      newErrors.idade = "Por favor, preencha a idade do seu filho.";
    }
    const cleanPhone = leadForm.telefone.replace(/\D/g, "");
    if (cleanPhone.length < 10 || cleanPhone.length > 13) {
      newErrors.telefone =
        "Número de telefone inválido (mínimo 10 dígitos com DDD).";
    }
    if (leadForm.queixa.trim().length < 10) {
      newErrors.queixa =
        "Por favor, explique um pouco mais sobre as dificuldades da criança (mínimo 10 caracteres).";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmitLeadForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (sending || !validateLeadForm()) return;
    setSending(true);
    setNotice("");

    try {
      const response = await fetch(`${apiBase}/comunicacao/triagem`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(leadForm),
      });
      if (!response.ok) throw new Error("Falha no envio da triagem");
      setNotice("Solicitação enviada! Nossa equipe entrará em contato.");
      setLeadForm({
        nomeCrianca: "",
        idade: "",
        telefone: "",
        queixa: "",
        periodo: "Tarde",
      });
      setErrors({});
    } catch (err) {
      console.error(err);
      setNotice("Não foi possível enviar. Seus dados foram mantidos; tente novamente.");
    } finally {
      setSending(false);
    }
  };

  const handleOpenLeadModal = () => {
    setErrors({});
    setNotice("");
    setLeadModalOpen(true);
  };


  return (
    <div className="min-h-screen bg-white text-[#4A4A4A] font-sans overflow-x-hidden antialiased">
      <ReferenceLanding onChat={handleOpenLeadModal} />

      {/* Lead capture modal */}
      <AnimatePresence>
        {leadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4 text-xs">
            <div
              className="absolute inset-0"
              onClick={() => setLeadModalOpen(false)}
            />
            <motion.div
              ref={dialogRef}
              role="dialog" aria-modal="true" aria-label="Solicitar contato do Instituto Conectar"
              initial={{ scale: reducedMotion ? 1 : 0.95, opacity: reducedMotion ? 1 : 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: reducedMotion ? 1 : 0.95, opacity: 0 }}
              className="relative w-full max-w-sm max-h-[90dvh] overflow-y-auto rounded-2xl shadow-2xl border bg-white p-6 space-y-4"
              style={{ borderColor: "#E7E7E7" }}
            >
              <div className="flex justify-between items-center border-b pb-2">
                <div className="text-left">
                  <h3 className="font-bold text-sm text-[#4A4A4A]">
                    Solicitar Triagem Clínica
                  </h3>
                  <p className="text-[10px] text-zinc-400 mt-0.5">
                    Preencha as informações básicas do seu filho.
                  </p>
                </div>
                <button
                  onClick={() => setLeadModalOpen(false)}
                  className="p-1 hover:bg-zinc-100 rounded text-zinc-400 border-0 bg-transparent cursor-pointer"
                  aria-label="Fechar formulário de triagem"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {notice && <p role="status" className="text-sm text-[#493763]">{notice}</p>}
              <form
                onSubmit={handleSubmitLeadForm}
                className="space-y-3 text-left"
              >
                <div className="space-y-1">
                  <label htmlFor="lead-nomeCrianca" className="text-[9px] font-bold text-zinc-500 uppercase">
                    Nome da Criança
                  </label>
                  <input id="lead-nomeCrianca"
                    type="text"
                    value={leadForm.nomeCrianca}
                    onChange={(e) =>
                      setLeadForm({ ...leadForm, nomeCrianca: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none text-zinc-800"
                  />
                  {errors.nomeCrianca && (
                    <p className="text-[#E98BAE] text-[8px] font-bold mt-0.5">
                      {errors.nomeCrianca}
                    </p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label htmlFor="lead-idade" className="text-[9px] font-bold text-zinc-500 uppercase">
                      Idade
                    </label>
                    <input id="lead-idade"
                      type="text"
                      placeholder="Ex: 6 anos"
                      value={leadForm.idade}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, idade: e.target.value })
                      }
                      className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none text-zinc-800"
                    />
                    {errors.idade && (
                      <p className="text-[#E98BAE] text-[8px] font-bold mt-0.5">
                        {errors.idade}
                      </p>
                    )}
                  </div>
                  <div className="space-y-1">
                    <label htmlFor="lead-telefone" className="text-[9px] font-bold text-zinc-500 uppercase">
                      Telefone Responsável
                    </label>
                    <input id="lead-telefone"
                      type="text"
                      placeholder="(DD) 99999-9999"
                      value={leadForm.telefone}
                      onChange={(e) =>
                        setLeadForm({ ...leadForm, telefone: e.target.value })
                      }
                      className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none text-zinc-800"
                    />
                    {errors.telefone && (
                      <p className="text-[#E98BAE] text-[8px] font-bold mt-0.5">
                        {errors.telefone}
                      </p>
                    )}
                  </div>
                </div>
                <div className="space-y-1">
                  <label htmlFor="lead-queixa" className="text-[9px] font-bold text-zinc-500 uppercase">
                    Principais queixas ou dificuldades
                  </label>
                  <textarea id="lead-queixa"
                    rows={3}
                    placeholder="Ex: Atraso de fala, gagueira, hiperatividade..."
                    value={leadForm.queixa}
                    onChange={(e) =>
                      setLeadForm({ ...leadForm, queixa: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none resize-none text-zinc-800"
                  />
                  {errors.queixa && (
                    <p className="text-[#E98BAE] text-[8px] font-bold mt-0.5">
                      {errors.queixa}
                    </p>
                  )}
                </div>
                <div className="space-y-1">
                  <label htmlFor="lead-periodo" className="text-[9px] font-bold text-zinc-500 uppercase">
                    Período de preferência
                  </label>
                  <select id="lead-periodo"
                    value={leadForm.periodo}
                    onChange={(e) =>
                      setLeadForm({ ...leadForm, periodo: e.target.value })
                    }
                    className="w-full p-2.5 rounded-lg border bg-zinc-50 outline-none cursor-pointer text-zinc-800"
                  >
                    <option value="Manhã">Manhã</option>
                    <option value="Tarde">Tarde</option>
                    <option value="Ambos">Ambos</option>
                  </select>
                </div>

                <div className="pt-3 border-t flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setLeadModalOpen(false)}
                    className="px-4 py-2 border rounded-xl font-bold hover:bg-zinc-100 text-[10px] uppercase transition-colors cursor-pointer bg-transparent"
                    style={{ borderColor: "#E7E7E7" }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit" disabled={sending}
                    className="px-5 py-2 rounded-xl font-bold text-white bg-[#69C4B5] hover:bg-[#58b3a4] shadow-md border-0 cursor-pointer text-[10px] uppercase tracking-wider"
                  >
                    {sending ? "Enviando…" : "Enviar Solicitação"}
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
