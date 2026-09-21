"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Users,
  Heart,
  Sparkles,
  School,
  AlertTriangle,
  Pill,
  MessageCircle,
  Calendar,
  CheckCircle2,
  Award,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { calculateAge } from "@/lib/utils";
import { soundEffects } from "@/lib/sound-effects";
import { PortalConfetti } from "@/components/portal/portal-confetti";
import { toast } from "sonner";

interface PortalFamilyScreenProps {
  pacienteData: any;
  parentName: string;
  onOpenWhatsApp: (msg?: string) => void;
}

export function PortalFamilyScreen({
  pacienteData,
  parentName,
  onOpenWhatsApp,
}: PortalFamilyScreenProps) {
  const [activeSubTab, setActiveSubTab] = useState<"equipe" | "escola" | "saude" | "conquistas">("equipe");
  const [showConfetti, setShowConfetti] = useState(false);
  const [stampedList, setStampedList] = useState<Record<number, boolean>>({});
  const [reactionsMap, setReactionsMap] = useState<Record<number, Record<string, number>>>({
    0: { "💖": 12, "⭐": 8, "👏": 15, "🚀": 6 },
    1: { "💖": 9, "⭐": 14, "👏": 11, "🚀": 4 },
    2: { "💖": 7, "⭐": 10, "👏": 18, "🚀": 5 },
  });
  const [floatingParticles, setFloatingParticles] = useState<Array<{ id: number; char: string; x: number }>>([]);

  const childName = pacienteData?.nome || "Maria Júlia";
  const childAge = pacienteData?.dataNascimento ? `${calculateAge(pacienteData.dataNascimento)} anos` : "7 anos";

  // Equipe Multidisciplinar Dedicada à Criança
  const careTeam = [
    {
      nome: "Dra. Leliane Rocha",
      especialidade: "Psicologia Cognitivo-Comportamental",
      registro: "CRP 06/142980",
      dias: "Terças e Quintas às 09h",
      foto: "LR",
      cor: "#8D5BD1",
    },
    {
      nome: "Dra. Rosana Alves",
      especialidade: "Fonoaudiologia & Linguagem",
      registro: "CRFa 2-18920",
      dias: "Quartas às 14h",
      foto: "RA",
      cor: "#10B981",
    },
    {
      nome: "Dr. Thiago Martins",
      especialidade: "Terapia Ocupacional & Integração Sensorial",
      registro: "CREFITO 3/99214",
      dias: "Segundas às 10h",
      foto: "TM",
      cor: "#0284C7",
    },
    {
      nome: "Dra. Beatriz Lima",
      especialidade: "Psicopedagogia Clínica",
      registro: "ABPp 1204/SP",
      dias: "Sextas às 15h",
      foto: "BL",
      cor: "#F59E0B",
    },
  ];

  // Linha do tempo de marcos e conquistas da criança
  const conquistas = [
    {
      data: "18/09/2026",
      titulo: "Comunicação espontânea",
      descricao: "Maria Júlia formulou pedidos completos de 4 palavras na sessão sem necessidade de mediação visual.",
      terapeuta: "Dra. Rosana (Fono)",
      tag: "Linguagem",
    },
    {
      data: "05/09/2026",
      titulo: "Regulação sensorial no balanço",
      descricao: "Tolerou 15 minutos de estimulação vestibular no balanço terapêutico mantendo sorriso e autorregulação.",
      terapeuta: "Dr. Thiago (TO)",
      tag: "Sensorial",
    },
    {
      data: "22/08/2026",
      titulo: "Avanço na escrita e recorte",
      descricao: "Coordenação motora fina com apreensão trípode funcional da tesoura e corte contínuo em linha reta.",
      terapeuta: "Dra. Beatriz (Psicopedagogia)",
      tag: "Coordenação",
    },
  ];

  return (
    <div className="space-y-3.5 select-none pb-4">
      {/* ─── CARD HERO DA FAMÍLIA ─── */}
      <div className="rounded-[20px] bg-gradient-to-r from-[#8D5BD1] to-[#6C3FB8] p-4 text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 w-36 h-36 bg-white/10 rounded-full blur-xl pointer-events-none" />
        <div className="flex items-center gap-3.5 z-10 relative">
          <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/50 flex items-center justify-center text-white font-black text-xl shadow-sm">
            {childName.charAt(0)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-bold backdrop-blur-xs">
                Paciente Conectar
              </span>
              <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>
            <h1 className="text-[17px] font-extrabold truncate leading-tight">{childName}</h1>
            <p className="text-[11px] text-purple-100 font-medium truncate mt-0.5">
              {childAge} • {pacienteData?.diagnosticoPrincipal || "TEA Nível 1 de Suporte • TDAH"}
            </p>
          </div>
        </div>

        {/* Mini status bar */}
        <div className="mt-3.5 pt-2.5 border-t border-white/20 flex items-center justify-between text-[10px] text-purple-100">
          <span>Responsável: <strong className="text-white font-bold">{parentName}</strong></span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#FDE047]" />
            <span>4 Terapias Ativas</span>
          </span>
        </div>
      </div>

      {/* ─── SUB-NAV TABS EM GLASSMORPHISM ─── */}
      <div className="flex p-1 rounded-2xl bg-[#FAF8FF] border border-[#EEE8FA] gap-1 text-[11px] font-bold">
        {[
          { id: "equipe", label: "Equipe Clínica", icon: Users },
          { id: "conquistas", label: "Conquistas", icon: Award },
          { id: "escola", label: "Escola", icon: School },
          { id: "saude", label: "Saúde & Rotina", icon: Pill },
        ].map((tab) => {
          const isActive = activeSubTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-[#8D5BD1] shadow-2xs font-extrabold"
                  : "text-[#77717E] hover:text-[#29232F]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">{tab.label}</span>
              <span className="xs:hidden">{tab.label.split(" ")[0]}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: EQUIPE CLÍNICA MULTIDISCIPLINAR ─── */}
      {activeSubTab === "equipe" && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
          <p className="text-[10px] text-[#77717E] font-medium px-1">
            Profissionais dedicados ao plano terapêutico da sua criança:
          </p>

          {careTeam.map((prof, idx) => (
            <div
              key={idx}
              className="p-3 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs hover:border-[#8D5BD1]/30 transition-all space-y-2"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-extrabold text-xs shadow-2xs"
                    style={{ backgroundColor: prof.cor }}
                  >
                    {prof.foto}
                  </div>
                  <div>
                    <h3 className="text-[12.5px] font-extrabold text-[#29232F]">{prof.nome}</h3>
                    <p className="text-[10px] font-semibold text-[#8D5BD1]">{prof.especialidade}</p>
                    <span className="text-[8.5px] text-[#77717E]">{prof.registro}</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenWhatsApp(`Olá ${prof.nome}, tudo bem? Sou ${parentName}, responsável por ${childName}. Gostaria de tirar uma dúvida sobre a sessão.`)}
                  className="p-2 rounded-full bg-[#FAF8FF] text-[#8D5BD1] hover:bg-[#E8DEFF] transition-colors cursor-pointer"
                  title="Enviar mensagem para o terapeuta"
                >
                  <MessageCircle className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-[#EEE8FA] flex items-center justify-between text-[9.5px] text-[#77717E]">
                <span className="flex items-center gap-1 font-medium">
                  <Calendar className="w-3 h-3 text-[#8D5BD1]" />
                  <span>{prof.dias}</span>
                </span>
                <span className="text-[#10B981] font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Em Acompanhamento</span>
                </span>
              </div>
            </div>
          ))}
        </motion.div>
      )}

      {/* ─── TAB 2: CONQUISTAS E LINHA DO TEMPO ─── */}
      {activeSubTab === "conquistas" && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5 relative">
          <div className="p-3 rounded-[16px] bg-[#FFF8EC] border border-[#FFE4A3] flex items-center justify-between shadow-2xs">
            <div className="flex items-center gap-2.5">
              <Award className="w-6 h-6 text-[#D97706] shrink-0" />
              <p className="text-[10.5px] text-[#29232F] font-bold leading-tight">
                &quot;Celebrar pequenas vitórias constrói grandes futuros.&quot; 💜
              </p>
            </div>
            <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-[#D97706] text-white">
              {conquistas.length} Marcos
            </span>
          </div>

          <div className="space-y-2.5">
            {conquistas.map((c, idx) => {
              const isStamped = !!stampedList[idx];
              const reactions = reactionsMap[idx] || { "💖": 10, "⭐": 5, "👏": 12, "🚀": 3 };

              const handleReaction = (emoji: string, label: string) => {
                if (emoji === "💖") soundEffects.playHeartbeat();
                else if (emoji === "⭐") soundEffects.playSparkle();
                else if (emoji === "🚀") soundEffects.playChirp();
                else soundEffects.playPop();

                setReactionsMap((prev) => ({
                  ...prev,
                  [idx]: {
                    ...prev[idx],
                    [emoji]: (prev[idx]?.[emoji] || 0) + 1,
                  },
                }));

                const newId = Date.now();
                setFloatingParticles((prev) => [...prev, { id: newId, char: emoji, x: (Math.random() - 0.5) * 50 }]);
                setTimeout(() => {
                  setFloatingParticles((prev) => prev.filter((p) => p.id !== newId));
                }, 900);

                toast.success(`Carinho enviado: ${emoji} ${label}!`);
              };

              const handleStamp = () => {
                soundEffects.playAchievement();
                setShowConfetti(true);
                setTimeout(() => setShowConfetti(false), 2000);
                setStampedList((prev) => ({ ...prev, [idx]: true }));
                toast.success(`Vitória carimbada no coração da família! 🌟`, {
                  description: `Marco "${c.titulo}" comemorado com muito afeto.`,
                });
              };

              return (
                <motion.div
                  key={idx}
                  whileHover={{ y: -2 }}
                  className={`p-3.5 rounded-[16px] bg-white border shadow-2xs space-y-2.5 transition-all relative overflow-hidden ${
                    isStamped ? "border-[#F59E0B]/50 bg-gradient-to-br from-white to-[#FFFDF7]" : "border-[#EEEAF4] hover:border-[#8D5BD1]/30"
                  }`}
                >
                  {/* Selo Dourado Carimbado */}
                  {isStamped && (
                    <motion.div
                      initial={{ scale: 2, rotate: -25, opacity: 0 }}
                      animate={{ scale: 1, rotate: -8, opacity: 0.95 }}
                      transition={{ type: "spring", stiffness: 500, damping: 18 }}
                      className="absolute top-2 right-2 border-2 border-[#D97706] bg-[#FEF3C7] text-[#B45309] font-black text-[9px] px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs pointer-events-none select-none z-10"
                    >
                      ★ Celebrado em Família!
                    </motion.div>
                  )}

                  <div className="flex items-center justify-between pr-2">
                    <span className="px-2 py-0.5 rounded-full bg-[#E8DEFF] text-[#8D5BD1] text-[8.5px] font-extrabold">
                      {c.tag}
                    </span>
                    <span className="text-[9px] text-[#77717E] font-medium">{c.data}</span>
                  </div>

                  <div>
                    <h4 className="text-[12.5px] font-extrabold text-[#29232F]">{c.titulo}</h4>
                    <p className="text-[10px] text-[#77717E] leading-relaxed font-medium mt-0.5">{c.descricao}</p>
                  </div>

                  {/* Rodapé: Registrado por + Botão de Carimbar + Reações com Contador */}
                  <div className="pt-2 border-t border-[#EEE8FA] flex flex-col gap-2">
                    <div className="flex items-center justify-between text-[8.5px] text-[#8D5BD1] font-bold">
                      <span>Registrado por: {c.terapeuta}</span>

                      {!isStamped && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.92 }}
                          onClick={handleStamp}
                          className="px-2.5 py-1 rounded-full bg-[#FEF3C7] border border-[#FDE68A] text-[#B45309] font-extrabold text-[9px] flex items-center gap-1 cursor-pointer hover:bg-[#FDE68A] transition-colors shadow-2xs"
                        >
                          <span>🌟</span>
                          <span>Carimbar Vitória</span>
                        </motion.button>
                      )}
                    </div>

                    {/* Botões de Reação Rápida dos Pais com Contadores e Micro-animações */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[8px] text-[#77717E] font-bold uppercase tracking-wider">
                        Reações da Família:
                      </span>

                      <div className="flex items-center gap-1.5 relative">
                        {/* Partículas flutuantes ao reagir */}
                        <AnimatePresence>
                          {floatingParticles.map((p) => (
                            <motion.span
                              key={p.id}
                              initial={{ opacity: 1, scale: 0.6, y: 0, x: p.x }}
                              animate={{ opacity: 0, scale: 1.6, y: -45, x: p.x * 1.5 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.8 }}
                              className="absolute -top-3 left-1/2 pointer-events-none text-base z-30"
                            >
                              {p.char}
                            </motion.span>
                          ))}
                        </AnimatePresence>

                        {[
                          { emoji: "💖", label: "Amor" },
                          { emoji: "⭐", label: "Orgulho" },
                          { emoji: "👏", label: "Parabéns" },
                          { emoji: "🚀", label: "Voa alto" },
                        ].map((btn, bIdx) => (
                          <motion.button
                            key={bIdx}
                            whileHover={{ scale: 1.15 }}
                            whileTap={{ scale: 0.88 }}
                            onClick={() => handleReaction(btn.emoji, btn.label)}
                            className="px-2 py-0.5 rounded-full bg-[#FAF8FF] hover:bg-[#E8DEFF] border border-[#EEE8FA] flex items-center gap-1 text-[10px] font-bold text-[#29232F] cursor-pointer shadow-2xs transition-colors"
                            title={btn.label}
                          >
                            <span>{btn.emoji}</span>
                            <span className="text-[9px] font-black text-[#8D5BD1]">
                              {reactions[btn.emoji] || 0}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <PortalConfetti active={showConfetti} onComplete={() => setShowConfetti(false)} />
        </motion.div>
      )}

      {/* ─── TAB 3: ESCOLA E INTEGRAÇÃO ESCOLAR ─── */}
      {activeSubTab === "escola" && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
          <div className="p-3.5 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs space-y-2.5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#E8DEFF] flex items-center justify-center text-[#8D5BD1]">
                <School className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-[13px] font-extrabold text-[#29232F]">
                  {pacienteData?.escola || "Colégio Integração Infantil"}
                </h3>
                <p className="text-[10px] text-[#77717E] font-medium">
                  {pacienteData?.serie || "1º ano do Ensino Fundamental I"}
                </p>
              </div>
            </div>

            <div className="border-t border-[#EEE8FA] pt-2.5 space-y-2 text-[10.5px]">
              <div className="flex justify-between">
                <span className="text-[#77717E]">Professora Regente:</span>
                <span className="font-bold text-[#29232F]">Profª Cláudia Silva</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77717E]">Mediação Escolar:</span>
                <span className="font-bold text-[#10B981]">Profissional de Apoio Presente</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#77717E]">Última Visita Escolar:</span>
                <span className="font-bold text-[#8D5BD1]">14/09/2026 (Dra. Beatriz)</span>
              </div>
            </div>
          </div>

          <div className="p-3 rounded-[14px] bg-[#DDF6ED] border border-[#C5EFE0] text-[10px] text-[#29232F] space-y-1">
            <p className="font-bold text-[#10B981] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Plano Educacional Individualizado (PEI) Ativo</span>
            </p>
            <p className="text-[#77717E] leading-relaxed">
              O Instituto Conectar realiza reuniões periódicas com a coordenação pedagógica da escola para alinhar adaptações curriculares e sensoriais.
            </p>
          </div>
        </motion.div>
      )}

      {/* ─── TAB 4: SAÚDE, ALERGIAS E ROTINA SENSORIAL ─── */}
      {activeSubTab === "saude" && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
          <div className="p-3.5 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs space-y-2.5">
            <h3 className="text-[12.5px] font-extrabold text-[#29232F] flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-[#E11D48]" />
              <span>Alertas e Cuidados Médicos</span>
            </h3>

            <div className="space-y-2 text-[10.5px]">
              <div>
                <span className="text-[#77717E] block font-semibold mb-1">Alergias Alimentares ou de Contato:</span>
                <div className="flex flex-wrap gap-1">
                  {(pacienteData?.alergias && pacienteData.alergias.length > 0) ? (
                    pacienteData.alergias.map((a: string, i: number) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-[#FFDDE0] text-[#E11D48] font-bold text-[9.5px]">
                        {a}
                      </span>
                    ))
                  ) : (
                    <span className="px-2 py-0.5 rounded-md bg-[#FFDDE0] text-[#E11D48] font-bold text-[9.5px]">
                      Amendoim • Picada de Inseto
                    </span>
                  )}
                </div>
              </div>

              <div>
                <span className="text-[#77717E] block font-semibold mb-1">Medicamentos em Uso:</span>
                <p className="font-bold text-[#29232F]">
                  {pacienteData?.medicamentos?.join(", ") || "Nenhum medicamento psicotrópico de uso contínuo"}
                </p>
              </div>

              <div>
                <span className="text-[#77717E] block font-semibold mb-1">Estratégia de Acolhimento em Crise:</span>
                <p className="text-[#77717E] bg-[#FAF8FF] p-2 rounded-xl border border-[#EEE8FA] leading-relaxed">
                  Oferecer fone abafador de ruído, reduzir estímulos luminosos e permitir transição para o cantinho do aconchego com mordedor sensorial.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
