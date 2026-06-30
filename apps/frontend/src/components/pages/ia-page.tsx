"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Brain,
  Wand2,
  FileText,
  TrendingUp,
  Cpu,
  ChevronRight,
  Send,
  X,
  Play,
  RotateCw,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";

const aiFeatures = [
  {
    id: "resumo",
    title: "Resumo Clínico da Sessão",
    description: "Gere um resumo estruturado e profissional a partir de tópicos ou rascunhos rápidos anotados durante o atendimento.",
    icon: FileText,
    promptPlaceholder: "Cole suas notas rápidas aqui (ex: 'Lucas estava agitado, leu bem os cards, focou 15 min, tarefa de casa enviada')...",
    sampleOutput: "O paciente Lucas Mendes da Silva apresentou-se agitado na recepção clínica inicial, manifestando hiperatividade motora transitória. Durante a aplicação do protocolo de leitura silábica assistida por cartões interativos, obteve progresso qualitativo de 75% na junção fonêmica de sílabas simples. O foco sustentado na tarefa de mesa foi mantido por aproximadamente 15 minutos sem interrupções. Conduta: Tarefa domiciliar de pareamento silábico impressa entregue aos responsáveis.",
  },
  {
    id: "plano",
    title: "Sugestão de Plano Terapêutico",
    description: "Insira diagnósticos ou queixas e obtenha metas específicas e condutas sugeridas pela inteligência artificial.",
    icon: Brain,
    promptPlaceholder: "Digite a queixa clínica e diagnóstico (ex: 'Criança de 6 anos com suspeita de Dislexia, dificuldade de reconhecer letras')...",
    sampleOutput: "1. Meta de Curto Prazo (30 dias): Reconhecimento visual de 10 grafemas vogais e consoantes de alta frequência por pareamento lúdico. \n2. Meta de Médio Prazo (90 dias): Leitura fonológica de palavras dissílabas simples. \n3. Condutas Clínicas Sugeridas: Uso diário de caixa de areia sensorial para escrita tátil de grafemas e treino fonêmico apoiado por imagens de alta fidelidade visual.",
  },
  {
    id: "laudo",
    title: "Minuta de Laudo Técnico",
    description: "Crie rascunhos de laudos e declarações clínicas a partir do histórico de sessões do paciente.",
    icon: Wand2,
    promptPlaceholder: "Descreva a conclusão diagnóstica para compor o laudo...",
    sampleOutput: "DECLARAÇÃO TÉCNICA CLÍNICA \n\nDeclaramos, para os devidos fins de acompanhamento acadêmico, que o paciente Lucas Mendes da Silva encontra-se em intervenção psicopedagógica neste estabelecimento. Após aplicação de escalas e anamnese evolutiva, identificou-se discrepância no processamento auditivo central e dificuldades compatíveis com quadro de TDAH do tipo desatento. Recomendamos adaptações escolares de tempo adicional em provas e instrução oral simplificada das avaliações.",
  },
];

export function IaPage() {
  const [selectedFeature, setSelectedFeature] = useState(aiFeatures[0]);
  const [pacientes, setPacientes] = useState<{ id: string; nome: string }[]>([]);
  const [pacienteId, setPacienteId] = useState("");
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.get("/pacientes")
      .then((res) => {
        const data = Array.isArray(res.data) ? res.data : (res.data?.data || []);
        if (data.length > 0) {
          setPacientes(data);
          setPacienteId(data[0].id);
        }
      })
      .catch((err) => {
        console.error("Could not load patients", err);
      });
  }, []);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt) return;

    setLoading(true);
    setResponse("");

    try {
      if (selectedFeature.id === "resumo") {
        const res = await api.post("/ia/resumir-notas", { notas: prompt });
        setResponse(res.data.resumo);
      } else if (selectedFeature.id === "plano") {
        if (!pacienteId) {
          toast.error("Selecione um paciente para sugestão do plano terapêutico.");
          setLoading(false);
          return;
        }
        const res = await api.post(`/ia/plano-terapeutico/${pacienteId}`);
        setResponse(res.data.sugestao);
      } else if (selectedFeature.id === "laudo") {
        if (!pacienteId) {
          toast.error("Selecione um paciente para gerar o laudo.");
          setLoading(false);
          return;
        }
        const res = await api.post(`/ia/gerar-laudo/${pacienteId}`, { tipoLaudo: prompt });
        setResponse(res.data.laudo);
      }
    } catch (error: any) {
      console.error("Error generating AI content:", error);
      setResponse(
        `Erro ao se comunicar com o serviço de IA. Verifique se o backend e o microserviço de IA estão rodando e se a chave GEMINI_API_KEY está configurada no seu .env.\n\nDetalhes do erro: ${error.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
          Assistente de IA Clínico Conectar
        </h1>
        <p className="text-sm text-muted-foreground">
          Ferramenta de apoio baseada em inteligência artificial (Google Gemini) para agilizar burocracias clínicas e laudos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lado Esquerdo: Funcionalidades (1 coluna) */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Funcionalidades Disponíveis
          </h3>

          <div className="space-y-3">
            {aiFeatures.map((feat) => (
              <button
                key={feat.id}
                onClick={() => {
                  setSelectedFeature(feat);
                  setResponse("");
                  setPrompt("");
                }}
                className={cn(
                  "w-full text-left p-4 rounded-2xl border transition-all cursor-pointer space-y-2 relative overflow-hidden bg-card",
                  selectedFeature.id === feat.id
                    ? "border-purple-500 shadow-md ring-1 ring-purple-500/20"
                    : "border-border hover:border-border-hover"
                )}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      "p-2 rounded-xl shrink-0",
                      selectedFeature.id === feat.id ? "bg-purple-500/10 text-purple-500" : "bg-muted text-muted-foreground"
                    )}
                  >
                    <feat.icon className="h-4 w-4" />
                  </div>
                  <span className="font-bold text-xs text-foreground leading-tight">{feat.title}</span>
                </div>
                <p className="text-[10px] text-muted-foreground leading-relaxed">
                  {feat.description}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Lado Direito: Editor e Resposta (2 colunas) */}
        <div className="lg:col-span-2 space-y-6 flex flex-col">
          {/* Editor e Input */}
          <div
            className="p-5 rounded-2xl border bg-card space-y-4"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex justify-between items-center flex-wrap gap-2">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2 uppercase tracking-wide">
                <Cpu className="h-4 w-4 text-purple-500" /> {selectedFeature.title}
              </h3>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground font-semibold">Paciente:</span>
                <select
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                  className="p-1 rounded border bg-card outline-none"
                >
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <form onSubmit={handleGenerate} className="space-y-4">
              <textarea
                required
                placeholder={selectedFeature.promptPlaceholder}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={4}
                className="w-full p-4 rounded-xl border text-xs outline-none bg-muted/20 focus:bg-card focus:ring-1 focus:ring-purple-500"
              />

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer disabled:opacity-55"
                >
                  {loading ? (
                    <>
                      <RotateCw className="h-4 w-4 animate-spin" />
                      <span>Processando com Gemini...</span>
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4" />
                      <span>Gerar Minuta por IA</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Resposta Gerada */}
          <div
            className="p-5 rounded-2xl border bg-card flex-1 flex flex-col space-y-4 min-h-[250px]"
            style={{ borderColor: "hsl(var(--border))" }}
          >
            <div className="flex justify-between items-center border-b pb-3">
              <span className="text-xs font-bold text-purple-600 flex items-center gap-1">
                <Sparkles className="h-4 w-4 animate-pulse" /> Resultado Gemini AI
              </span>
              {response && (
                <button
                  onClick={() => setResponse("")}
                  className="text-[10px] font-semibold text-muted-foreground hover:text-foreground cursor-pointer"
                >
                  Limpar
                </button>
              )}
            </div>

            <div className="flex-1 text-xs text-foreground leading-relaxed whitespace-pre-wrap font-mono overflow-y-auto max-h-[300px]">
              {loading ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                  <RotateCw className="h-6 w-6 animate-spin text-purple-500" />
                  <p className="animate-pulse">Analisando dados do prontuário e redigindo texto...</p>
                </div>
              ) : response ? (
                response
              ) : (
                <span className="italic text-muted-foreground">O resultado da inteligência artificial aparecerá aqui após o envio.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
