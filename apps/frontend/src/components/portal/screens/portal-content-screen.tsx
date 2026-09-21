"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  BookOpen,
  CheckCircle2,
  Download,
  Share2,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Home,
  Check,
  Award,
} from "lucide-react";
import { toast } from "sonner";

interface PortalContentScreenProps {
  exercicios: any[];
  onCompleteExercise: (exercise: any) => void;
}

export function PortalContentScreen({
  exercicios,
  onCompleteExercise,
}: PortalContentScreenProps) {
  const [activeTab, setActiveTab] = useState<"documentos" | "psicoeducacao" | "atividades">("documentos");
  const [selectedArticle, setSelectedArticle] = useState<any | null>(null);

  // Lista de Documentos e Laudos com download
  const documentos = [
    {
      id: "doc-1",
      titulo: "Laudo de Avaliação Neuropsicológica Completo",
      tipo: "Laudo Diagnóstico",
      emissor: "Dra. Leliane Rocha (Psicóloga)",
      data: "15/09/2026",
      paginas: 8,
      tamanho: "2.4 MB",
    },
    {
      id: "doc-2",
      titulo: "Plano Educacional Individualizado (PEI Semestral)",
      tipo: "Relatório Escolar",
      emissor: "Dra. Beatriz Lima (Psicopedagoga)",
      data: "01/08/2026",
      paginas: 5,
      tamanho: "1.8 MB",
    },
    {
      id: "doc-3",
      titulo: "Parecer Fonoaudiológico de Linguagem e Fala",
      tipo: "Parecer Técnico",
      emissor: "Dra. Rosana Alves (Fonoaudióloga)",
      data: "20/07/2026",
      paginas: 4,
      tamanho: "1.2 MB",
    },
    {
      id: "doc-4",
      titulo: "Declaração de Comparecimento e Frequência Terapêutica",
      tipo: "Declaração Oficial",
      emissor: "Recepção / Instituto Conectar",
      data: "21/09/2026",
      paginas: 1,
      tamanho: "420 KB",
    },
  ];

  // Artigos de Psicoeducação Acolhedores para os Pais
  const artigos = [
    {
      id: "art-1",
      titulo: "Como criar uma Rotina Visual Previsível em Casa",
      resumo: "Crianças no espectro autista e com TDAH se beneficiam intensamente da previsibilidade visual antes das transições de tarefas.",
      tempoLeitura: "4 min",
      categoria: "Rotina & Comportamento",
      cor: "#8D5BD1",
      conteudo: `A previsibilidade reduz a ansiedade de forma comprovada. Utilizar um quadro com cartões ilustrados (acordar, escovar dentes, café da manhã, escola, almoço, terapia e brincar) ajuda a criança a antecipar o que vem a seguir sem crises de sobrecarga. Dica da equipe: use fotos reais da própria criança realizando cada etapa para criar engajamento imediato!`,
    },
    {
      id: "art-2",
      titulo: "Manejo Sensorial: O que fazer durante uma sobrecarga?",
      resumo: "Entenda a diferença entre uma birra comportamental e uma crise de desorganização sensorial (meltdown).",
      tempoLeitura: "6 min",
      categoria: "Integração Sensorial",
      cor: "#10B981",
      conteudo: `Ao contrário da birra, a sobrecarga sensorial não tem um objetivo manipulativo. O sistema nervoso da criança atingiu o limite de estímulos (sons altos, luzes fluorescentes, texturas incômodas). Nossa orientação: leve a criança para um local calmo, reduza sua fala (evite excesso de perguntas), ofereça um abraço com pressão profunda se ela aceitar, e use abafadores de ruído até que ela retome o equilíbrio.`,
    },
    {
      id: "art-3",
      titulo: "Estímulo à Linguagem em Momentos Cotidianos",
      resumo: "Pequenos jogos durante o banho ou alimentação que expandem o vocabulário e a intenção comunicativa.",
      tempoLeitura: "3 min",
      categoria: "Linguagem & Fala",
      cor: "#0284C7",
      conteudo: `Você não precisa de brinquedos caros para estimular a fala. Dê pausas propositais antes de entregar o que a criança quer, permitindo que ela faça o contato visual e tente emitir o som ou gesto funcional. Comemore efusivamente cada tentativa sonora!`,
    },
  ];

  const handleDownload = (doc: any) => {
    toast.success(`Download iniciado: ${doc.titulo}`, {
      description: "Arquivo PDF timbrado oficial gerado com sucesso.",
    });
  };

  return (
    <div className="space-y-3.5 select-none pb-4">
      <div>
        <h1 className="text-[17px] font-extrabold text-[#29232F]">Conteúdos & Documentos</h1>
        <p className="text-[10px] text-[#77717E] font-medium">Laudos clínicos oficiais, guias e tarefas para casa</p>
      </div>

      {/* Tabs Principais */}
      <div className="flex p-1 rounded-2xl bg-[#FAF8FF] border border-[#EEE8FA] gap-1 text-[11px] font-bold">
        {[
          { id: "documentos", label: "Laudos & PDFs", icon: FileText },
          { id: "psicoeducacao", label: "Guias para Pais", icon: BookOpen },
          { id: "atividades", label: "Para Casa", icon: Home },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setSelectedArticle(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1 transition-all cursor-pointer ${
                isActive
                  ? "bg-white text-[#8D5BD1] shadow-2xs font-extrabold"
                  : "text-[#77717E] hover:text-[#29232F]"
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* ─── TAB 1: LAUDOS E DOCUMENTOS CLÍNICOS ─── */}
      {activeTab === "documentos" && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
          <div className="p-3 rounded-[16px] bg-[#DDF6ED] border border-[#C5EFE0] text-[10px] text-[#29232F] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
            <p className="font-medium">
              Todos os documentos contam com <strong>assinatura digital com carimbo ICP-Brasil</strong> e validade legal para escolas, convênios e INSS.
            </p>
          </div>

          <div className="space-y-2">
            {documentos.map((doc) => (
              <div
                key={doc.id}
                className="p-3.5 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs hover:border-[#8D5BD1]/30 transition-all flex items-center justify-between group"
              >
                <div className="flex items-start gap-3 flex-1 min-w-0 pr-2">
                  <div className="w-10 h-10 rounded-[12px] bg-[#FFDDE0] text-[#E11D48] flex items-center justify-center shrink-0 mt-0.5">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 space-y-0.5">
                    <span className="text-[8.5px] font-extrabold px-2 py-0.5 rounded-md bg-[#FAF8FF] border border-[#EEE8FA] text-[#8D5BD1]">
                      {doc.tipo}
                    </span>
                    <h3 className="text-[12px] font-extrabold text-[#29232F] truncate leading-snug group-hover:text-[#8D5BD1] transition-colors">
                      {doc.titulo}
                    </h3>
                    <p className="text-[9.5px] text-[#77717E] truncate font-medium">
                      {doc.emissor}
                    </p>
                    <p className="text-[8.5px] text-[#77717E]">
                      {doc.data} • {doc.paginas} páginas • {doc.tamanho}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(doc)}
                  className="w-9 h-9 rounded-full bg-[#FAF8FF] border border-[#EEE8FA] text-[#8D5BD1] hover:bg-[#8D5BD1] hover:text-white flex items-center justify-center transition-all shrink-0 cursor-pointer shadow-2xs"
                  title="Baixar PDF Timbrado"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── TAB 2: PSICOEDUCAÇÃO PARA PAIS ─── */}
      {activeTab === "psicoeducacao" && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
          {selectedArticle ? (
            <div className="p-4 rounded-[18px] bg-white border border-[#EEEAF4] shadow-2xs space-y-3">
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-[10px] font-bold text-[#8D5BD1] hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>← Voltar aos artigos</span>
              </button>
              <div className="space-y-1">
                <span className="px-2 py-0.5 rounded-full text-[8.5px] font-extrabold bg-[#E8DEFF] text-[#8D5BD1]">
                  {selectedArticle.categoria}
                </span>
                <h2 className="text-[14px] font-extrabold text-[#29232F]">{selectedArticle.titulo}</h2>
                <p className="text-[9.5px] text-[#77717E] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#8D5BD1]" />
                  <span>Leitura estimada: {selectedArticle.tempoLeitura}</span>
                </p>
              </div>
              <div className="border-t border-[#EEE8FA] pt-3 text-[11px] text-[#29232F] leading-relaxed whitespace-pre-line font-medium">
                {selectedArticle.conteudo}
              </div>
            </div>
          ) : (
            artigos.map((art) => (
              <div
                key={art.id}
                onClick={() => setSelectedArticle(art)}
                className="p-3.5 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs hover:border-[#8D5BD1]/30 transition-all cursor-pointer space-y-2 group"
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[8.5px] font-extrabold px-2 py-0.5 rounded-md text-white"
                    style={{ backgroundColor: art.cor }}
                  >
                    {art.categoria}
                  </span>
                  <span className="text-[9px] text-[#77717E] flex items-center gap-1 font-medium">
                    <Clock className="w-3 h-3 text-[#8D5BD1]" />
                    {art.tempoLeitura}
                  </span>
                </div>
                <h3 className="text-[12.5px] font-extrabold text-[#29232F] group-hover:text-[#8D5BD1] transition-colors leading-snug">
                  {art.titulo}
                </h3>
                <p className="text-[10px] text-[#77717E] leading-relaxed font-medium line-clamp-2">
                  {art.resumo}
                </p>
                <div className="pt-1 flex items-center text-[9.5px] font-extrabold text-[#8D5BD1] gap-0.5">
                  <span>Ler orientação completa</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            ))
          )}
        </motion.div>
      )}

      {/* ─── TAB 3: TAREFAS E EXERCÍCIOS PARA CASA ─── */}
      {activeTab === "atividades" && (
        <motion.div initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} className="space-y-2.5">
          <div className="p-3 rounded-[16px] bg-[#FFF8EC] border border-[#FFE4A3] text-[10px] text-[#29232F] flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#D97706] shrink-0" />
            <p className="font-medium">
              Atividades semanais sugeridas pelos terapeutas para reforçar em família os aprendizados de consultório.
            </p>
          </div>

          <div className="space-y-2">
            {exercicios.length > 0 ? (
              exercicios.map((ex) => (
                <div
                  key={ex.id}
                  className="p-3.5 rounded-[16px] bg-white border border-[#EEEAF4] shadow-2xs space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <h4 className="text-[12px] font-extrabold text-[#29232F]">{ex.titulo}</h4>
                      <p className="text-[10px] text-[#77717E] leading-relaxed font-medium">{ex.descricao}</p>
                    </div>
                    <span
                      className={`text-[8.5px] font-extrabold px-2 py-0.5 rounded-full ${
                        ex.realizado ? "bg-[#DDF6ED] text-[#10B981]" : "bg-[#FFF0C9] text-[#D97706]"
                      }`}
                    >
                      {ex.realizado ? "Concluído" : "Pendente"}
                    </span>
                  </div>

                  {!ex.realizado ? (
                    <button
                      onClick={() => onCompleteExercise(ex)}
                      className="w-full py-2 rounded-[10px] bg-[#D97706] hover:bg-[#B45309] text-white font-extrabold text-[10px] flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                      <span>Marcar como Realizado em Casa</span>
                    </button>
                  ) : (
                    <div className="p-2 rounded-[10px] bg-[#DDF6ED]/60 text-[#10B981] text-[9.5px] font-extrabold flex items-center justify-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Realizado com carinho pela família!</span>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="p-8 rounded-[16px] bg-[#FAF8FF] text-center space-y-2 text-[#77717E]">
                <Award className="w-8 h-8 mx-auto text-[#D97706]/70" />
                <p className="text-[12px] font-bold text-[#29232F]">Tudo em dia!</p>
                <p className="text-[10px]">Todas as orientações domiciliares da semana foram cumpridas. Parabéns!</p>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
