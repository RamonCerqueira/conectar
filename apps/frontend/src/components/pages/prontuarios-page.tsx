"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ClipboardList,
  Search,
  Plus,
  X,
  Clock,
  Sparkles,
  User,
  Brain,
  Share2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Prontuario } from "@/types/prontuario";
import { api } from "@/lib/api";
import { toast } from "sonner";

// Imports of refactored tab components
import { PacienteProfileBanner } from "./prontuarios/paciente-profile-banner";
import { TabEvolucoes } from "./prontuarios/tab-evolucoes";
import { TabPlanoTerapeutico } from "./prontuarios/tab-plano-terapeutico";
import { TabAvaliacoes } from "./prontuarios/tab-avaliacoes";
import { TabAtividades } from "./prontuarios/tab-atividades";
import { TabFrequencia } from "./prontuarios/tab-frequencia";
import { TabFichaPaciente } from "./prontuarios/tab-ficha-paciente";

// ─── CLINICAL WORKSPACE MOCK DATA ─────────────────────────────────────────────
const mockPacientes = [
  {
    id: "pac-1",
    nome: "Lucas Mendes da Silva",
    idade: 8,
    dataNascimento: "2018-05-15",
    sexo: "MASCULINO",
    status: "ATIVO",
    diagnosticos: [
      { id: "d1", cid: "F90.0", descricao: "TDAH" },
      { id: "d2", cid: "F81.0", descricao: "Dislexia" }
    ],
    medicamentos: ["Ritalina 10mg"],
    alergias: ["Lactose", "Dipirona"],
    sensibilidadeSensorial: "Maior desatenção e fadiga no final da tarde; hipersensibilidade ao toque leve.",
    hiperfoco: "Minecraft, blocos de montar e dinossauros",
    responsaveis: [
      { id: "r1", nome: "Mariana Mendes da Silva", telefone: "11987654321", grauParent: "MAE" }
    ],
    escola: "Colégio Santa Maria",
    serie: "3º ano Fundamental",
    turnoEscolar: "Manhã",
    cep: "01311-200",
    logradouro: "Avenida Paulista",
    numero: "1000",
    complemento: "Apto 42",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    nomeProf: "Profª Sandra",
    coordenador: "Helena Reis",
    ultimaConsulta: "24/06/2026",
    ultimoProfissional: "Dra. Ana Lima (Psicopedagoga)",
    proximaConsulta: "01/07/2026",
    statusFinanceiro: "PAGO",
  },
  {
    id: "pac-2",
    nome: "Sofia Andrade Rezende",
    idade: 6,
    dataNascimento: "2019-09-02",
    sexo: "FEMININO",
    status: "ATIVO",
    diagnosticos: [
      { id: "d3", cid: "F84.0", descricao: "TEA Nível 1" }
    ],
    medicamentos: [],
    alergias: [],
    sensibilidadeSensorial: "Hipersensibilidade auditiva alta a ruídos agudos, metálicos ou palmas.",
    hiperfoco: "Dinossauros (T-Rex) e quebra-cabeças complexos",
    responsaveis: [
      { id: "r2", nome: "Beatriz Andrade Rezende", telefone: "11999998888", grauParent: "MAE" }
    ],
    escola: "Escola Maple Bear",
    serie: "Pré-Escola 2",
    turnoEscolar: "Tarde",
    cep: "04012-000",
    logradouro: "Rua Domingos de Morais",
    numero: "500",
    complemento: "",
    bairro: "Vila Mariana",
    cidade: "São Paulo",
    estado: "SP",
    nomeProf: "Profª Camila",
    coordenador: "Renata Abreu",
    ultimaConsulta: "25/06/2026",
    ultimoProfissional: "Dra. Carla Souza (Fonoaudióloga)",
    proximaConsulta: "02/07/2026",
    statusFinanceiro: "PAGO",
  }
];

const initialProntuarios: Prontuario[] = [
  {
    id: "pr-1",
    pacienteId: "pac-1",
    pacienteNome: "Lucas Mendes da Silva",
    data: "2026-06-24T14:30:00Z",
    profissional: "Dra. Ana Lima (Psicopedagoga)",
    queixaPrincipal: "Dificuldade na leitura silábica e foco nas atividades escolares.",
    objetivosSessao: "Estimulação de processamento fonológico e fluidez de leitura.",
    atividadesRealizadas: "Leitura de cartões silábicos interativos e jogo de caça-palavras.",
    resultados: "Conseguiu ler 90% das sílabas simples e associar às imagens corretamente.",
    comportamento: "Criança focada, motivada pelo elemento lúdico do jogo.",
    orientacoesPais: "Recomenda-se realizar o caça-palavras impresso levado para casa.",
    proximaMeta: "Introduzir frases simples com encontros consonantais.",
  },
  {
    id: "pr-2",
    pacienteId: "pac-1",
    pacienteNome: "Lucas Mendes da Silva",
    data: "2026-06-17T14:30:00Z",
    profissional: "Dra. Ana Lima (Psicopedagoga)",
    queixaPrincipal: "Agitação motora inicial e resistência para sentar.",
    objetivosSessao: "Auto-regulação e pareamento de estímulos cognitivos.",
    atividadesRealizadas: "Atividades de respiração e pareamento lógico de cores/formas.",
    resultados: "Após 10 minutos de regulação, engajou na tarefa por 20 minutos seguidos.",
    comportamento: "Hiperativo no início, mas respondeu bem ao reforço positivo visual.",
    orientacoesPais: "Evitar telas 1h antes do horário da terapia.",
    proximaMeta: "Manter o tempo de foco por 25 minutos.",
  },
  {
    id: "pr-3",
    pacienteId: "pac-2",
    pacienteNome: "Sofia Andrade Rezende",
    data: "2026-06-25T15:30:00Z",
    profissional: "Dra. Carla Souza (Fonoaudióloga)",
    queixaPrincipal: "Atraso no desenvolvimento da fala e ecolalia tardia.",
    objetivosSessao: "Produção de fonemas fricativos (/s/, /z/) em palavras isoladas.",
    atividadesRealizadas: "Brincadeira livre com dinossauros associando sons e repetições orientadas.",
    resultados: "Produziu fonema /s/ de forma isolada com suporte visual de pista articulatória.",
    comportamento: "Demonstrou interesse, mas manifestou leve irritabilidade ao ser corrigida.",
    orientacoesPais: "Reforçar palavras contendo o fonema trabalhado durante as refeições.",
    proximaMeta: "Produção do fonema em frases curtas (ex: 'O sapo pulou').",
  },
];

const initialPlanos = [
  {
    id: "plano-1",
    pacienteId: "pac-1",
    pacienteNome: "Lucas Mendes da Silva",
    titulo: "Intervenção Psicopedagógica Integrada",
    descricao: "Foco no desenvolvimento da leitura, foco sostenido, processamento fonológico e alfabetização.",
    metas: [
      {
        id: "meta-1",
        objetivo: "Leitura fluida de frases simples",
        descricao: "Ler frases com até 8 palavras sem silabar.",
        progresso: 75,
        status: "EM_ANDAMENTO",
        prazo: "2026-08-30",
        historico: [
          { data: "2026-06-24", valor: 75, nota: "Lucas leu 4 frases completas com fluidez." },
          { data: "2026-06-10", valor: 60, nota: "Apresentou hesitação nas consoantes complexas." },
        ],
      },
      {
        id: "meta-2",
        objetivo: "Organização escolar autônoma",
        descricao: "Guardar cadernos e estojo após término das atividades sem auxílio.",
        progresso: 50,
        status: "EM_ANDAMENTO",
        prazo: "2026-09-15",
        historico: [
          { data: "2026-06-17", valor: 50, nota: "Guardou os cadernos, mas esqueceu o lápis." },
        ],
      },
    ],
  },
  {
    id: "plano-2",
    pacienteId: "pac-2",
    pacienteNome: "Sofia Andrade Rezende",
    titulo: "Estimulação Cognitiva e Sensorial",
    descricao: "Terapia integrada de linguagem e processamento tátil/sensorial para regulação.",
    metas: [
      {
        id: "meta-4",
        objetivo: "Expressão verbal de frustração",
        descricao: "Substituir gritos e choros por palavras simples como 'não quero' ou 'me ajuda'.",
        progresso: 40,
        status: "EM_ANDAMENTO",
        prazo: "2026-09-30",
        historico: [
          { data: "2026-06-25", valor: 40, nota: "Disse 'me ajuda' duas vezes na tarefa de encaixe." },
        ],
      },
    ],
  },
];

const initialAvaliacoes = [
  {
    id: "av-1",
    pacienteId: "pac-1",
    pacienteNome: "Lucas Mendes da Silva",
    tipo: "Avaliação Psicopedagógica",
    data: "2026-05-10",
    conclusao: "Apresenta comprometimento significativo no processamento fonológico, compatível com sinais de Dislexia do Desenvolvimento. Recomendado intervenção fonoaudiológica associada.",
    respostas: [
      { pergunta: "Histórico familiar de dificuldade de aprendizagem?", resposta: "Sim, pai relatou dificuldades severas na alfabetização." },
      { pergunta: "Desempenho em leitura de palavras isoladas:", resposta: "Abaixo da média para a idade cronológica." },
    ],
  },
  {
    id: "av-2",
    pacienteId: "pac-2",
    pacienteNome: "Sofia Andrade Rezende",
    tipo: "Anamnese Infantil de Desenvolvimento",
    data: "2026-06-02",
    conclusao: "Sinais de hipersensibilidade sensorial auditiva e padrão de interesses restritos. Conduta: Encaminhar para Terapia Ocupacional com foco em Integração Sensorial.",
    respostas: [
      { pergunta: "Marcos do desenvolvimento motor:", resposta: "Sentou aos 6 meses, andou com 1 ano e 2 memes." },
      { pergunta: "Desenvolvimento da fala:", resposta: "Primeiras palavras aos 2 anos, apresenta ecolalia atual." },
    ],
  },
];

const initialFrequencias = [
  {
    id: "freq-1",
    pacienteId: "pac-1",
    pacienteNome: "Lucas Mendes da Silva",
    data: "2026-06-24T14:30:00Z",
    profissional: "Dra. Ana Lima (Psicopedagoga)",
    status: "PRESENTE",
    justificativa: "",
  },
  {
    id: "freq-2",
    pacienteId: "pac-2",
    pacienteNome: "Sofia Andrade Rezende",
    data: "2026-06-25T15:30:00Z",
    profissional: "Dra. Carla Souza (Fonoaudióloga)",
    status: "PRESENTE",
    justificativa: "",
  },
  {
    id: "freq-3",
    pacienteId: "pac-1",
    pacienteNome: "Lucas Mendes da Silva",
    data: "2026-06-17T14:30:00Z",
    profissional: "Dra. Ana Lima (Psicopedagoga)",
    status: "FALTA_JUSTIFICADA",
    justificativa: "Criança com febre e atestado médico enviado.",
  },
];

const initialRecursos = [
  {
    id: "rec-1",
    pacienteId: "pac-1",
    titulo: "Laudo de Avaliação Neuropsicológica Inicial",
    tipo: "PDF",
    descricao: "Laudo completo detalhando o perfil cognitivo, atenção e funções executivas do Lucas.",
    url: "#",
    dataCriacao: "2026-05-12",
    compartilhado: true,
    tamanho: "2.4 MB"
  },
  {
    id: "rec-2",
    pacienteId: "pac-1",
    titulo: "Treinamento de Produção do Fonema /R/",
    tipo: "VIDEO",
    descricao: "Vídeo instrutivo com exercícios diários de posicionamento da língua e sopro.",
    url: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    dataCriacao: "2026-06-20",
    compartilhado: true,
    duracao: "03:45"
  },
  {
    id: "rec-3",
    pacienteId: "pac-1",
    titulo: "Jogo de Pareamento de Sílabas Complexas",
    tipo: "JOGO",
    descricao: "Jogo interativo do Wordwall para o Lucas treinar sílabas com LH, NH e CH brincando.",
    url: "https://wordwall.net/play/12345/678",
    dataCriacao: "2026-06-25",
    compartilhado: true,
    plataforma: "Wordwall"
  },
  {
    id: "rec-4",
    pacienteId: "pac-1",
    titulo: "Quiz Semanal de Monitoramento de Comportamento",
    tipo: "QUIZ",
    descricao: "Questionário rápido para os pais avaliarem o foco e regulação do Lucas em casa.",
    respostasPai: null,
    perguntas: [
      { id: "q1", texto: "Como estava o foco nas tarefas escolares em casa?", opcoes: ["Muito Baixo", "Regular", "Bom", "Excelente"] },
      { id: "q2", texto: "Houve episódios de irritabilidade ou sobrecarga sensorial?", opcoes: ["Sim, diários", "Sim, ocasionais", "Raramente", "Não"] },
      { id: "q3", texto: "Conseguiu se auto-regular após as atividades?", opcoes: ["Com dificuldade", "Com ajuda leve", "De forma autônoma", "Não precisou"] }
    ],
    dataCriacao: "2026-06-26",
    compartilhado: true
  },
  {
    id: "rec-5",
    pacienteId: "pac-2",
    titulo: "Atividade Visual de Rotina Diária",
    tipo: "PDF",
    descricao: "Quadro visual para recortar e montar em casa, auxiliando na previsibilidade da rotina.",
    url: "#",
    dataCriacao: "2026-06-10",
    compartilhado: true,
    tamanho: "1.1 MB"
  }
];

interface ProntuariosPageProps {
  defaultTab?: "evolucao" | "plano" | "avaliacoes" | "frequencia" | "cadastro";
}

export function ProntuariosPage({ defaultTab = "evolucao" }: ProntuariosPageProps) {
  // Navigation & Patients
  const [pacientes, setPacientes] = useState<any[]>(mockPacientes);
  const [selectedPacienteId, setSelectedPacienteId] = useState("pac-1");
  const [activeTab, setActiveTab] = useState<string>(defaultTab);

  // Search/Filter states
  const [searchPatientTerm, setSearchPatientTerm] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);

  // Clinical data states
  const [prontuarios, setProntuarios] = useState(initialProntuarios);
  const [planos, setPlanos] = useState(initialPlanos);
  const [avaliacoes, setAvaliacoes] = useState(initialAvaliacoes);
  const [frequencias, setFrequencias] = useState(initialFrequencias);
  const [recursos, setRecursos] = useState<any[]>(initialRecursos);

  // Modals Open State
  const [isModalOpen, setIsModalOpen] = useState(false); // Evolution
  const [isNewMetaModalOpen, setIsNewMetaModalOpen] = useState(false); // New Goal
  const [isNewAvaliacaoModalOpen, setIsNewAvaliacaoModalOpen] = useState(false); // New Assessment
  const [isNewRecursoModalOpen, setIsNewRecursoModalOpen] = useState(false); // New Resource / Media

  const getAge = (birthDateString: string) => {
    if (!birthDateString) return 0;
    const today = new Date();
    const birthDate = new Date(birthDateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    if (defaultTab) {
      setActiveTab(defaultTab);
    }
  }, [defaultTab]);

  useEffect(() => {
    const init = async () => {
      try {
        const res = await api.get("/pacientes");
        if (res.data && res.data.length > 0) {
          const mapped = res.data.map((p: any) => ({
            ...p,
            idade: p.dataNascimento ? getAge(p.dataNascimento) : 8,
          }));
          setPacientes(mapped);
          setSelectedPacienteId(mapped[0].id);
          loadAllPatientData(mapped[0].id);
        } else {
          setPacientes(mockPacientes);
          loadAllPatientData("pac-1");
        }
      } catch (err) {
        console.warn("API not accessible, loading mock patients.");
        setPacientes(mockPacientes);
        loadAllPatientData("pac-1");
      }
    };
    init();
  }, []);

  const loadAllPatientData = async (pacId: string) => {
    // 1. Evolutions
    try {
      const res = await api.get(`/prontuarios/paciente/${pacId}`);
      if (res.data && res.data.length > 0) setProntuarios(res.data);
    } catch (e) {
      console.warn("Using local prontuarios filter.");
      setProntuarios(initialProntuarios);
    }
    
    // 2. Plans / Metas
    try {
      const res = await api.get(`/planos/paciente/${pacId}`);
      if (res.data) setPlanos(res.data);
    } catch (e) {
      setPlanos(initialPlanos);
    }

    // 3. Assessments
    try {
      const res = await api.get(`/avaliacoes/paciente/${pacId}`);
      if (res.data) setAvaliacoes(res.data);
    } catch (e) {
      setAvaliacoes(initialAvaliacoes);
    }

    // 4. Frequencias
    try {
      const res = await api.get(`/frequencias/paciente/${pacId}`);
      if (res.data) setFrequencias(res.data);
    } catch (e) {
      setFrequencias(initialFrequencias);
    }
  };

  const handleSelectPatient = (pacId: string) => {
    setSelectedPacienteId(pacId);
    loadAllPatientData(pacId);
  };

  // callbacks to update parent state from child tab components
  const handleAddEvolution = (newPr: any) => {
    setProntuarios([newPr, ...prontuarios]);
  };

  const handleAddMeta = (planoId: string, newMeta: any) => {
    setPlanos(
      planos.map((plano) => {
        if (plano.id === planoId) {
          return { ...plano, metas: [newMeta, ...plano.metas] };
        }
        return plano;
      })
    );
    toast.success("Nova meta cadastrada!");
  };

  const handleUpdateMetaProgress = (
    planoId: string,
    metaId: string,
    val: number,
    nota: string
  ) => {
    setPlanos(
      planos.map((plano) => {
        if (plano.id === planoId) {
          return {
            ...plano,
            metas: plano.metas.map((meta) => {
              if (meta.id === metaId) {
                const histItem = {
                  data: new Date().toISOString().split("T")[0],
                  valor: val,
                  nota: nota || "Progresso atualizado.",
                };
                return {
                  ...meta,
                  progresso: val,
                  status: val >= 100 ? "CONCLUIDO" : "EM_ANDAMENTO",
                  historico: [histItem, ...meta.historico],
                };
              }
              return meta;
            }),
          };
        }
        return plano;
      })
    );
    toast.success("Progresso atualizado!");
  };

  const handleAddAvaliacao = (newAv: any) => {
    setAvaliacoes([newAv, ...avaliacoes]);
  };

  const activePaciente = pacientes.find((p) => p.id === selectedPacienteId);

  const filteredPatientsList = pacientes.filter((p) =>
    p.nome.toLowerCase().includes(searchPatientTerm.toLowerCase())
  );

  // Tab items metadata
  const clinicalTabs = [
    { id: "evolucao", label: "Prontuário & Evoluções", icon: ClipboardList },
    { id: "plano", label: "Plano Terapêutico (PTS)", icon: Sparkles },
    { id: "avaliacoes", label: "Avaliações & Escalas", icon: Brain },
    { id: "atividades", label: "Mídias & Atividades", icon: Share2 },
    { id: "frequencia", label: "Frequência & Presença", icon: Clock },
    { id: "cadastro", label: "Ficha do Paciente", icon: User },
  ] as const;

  return (
    <div className="space-y-6">
      
      {/* ─── SEARCH & AUTOCOMPLETE BAR (TOP ALIGN) ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-40 relative">
        <div className="relative w-full max-w-xl">
          <div className="relative">
            <Search className="absolute left-3.5 top-3.5 h-4.5 w-4.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Digite o nome do paciente para iniciar o atendimento..."
              value={searchPatientTerm}
              onChange={(e) => {
                setSearchPatientTerm(e.target.value);
                setSearchFocused(true);
              }}
              onFocus={() => setSearchFocused(true)}
              className="w-full pl-11 pr-10 py-3 rounded-2xl border text-sm bg-card text-foreground outline-none shadow-sm focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all border-border"
            />
            {searchPatientTerm && (
              <button
                type="button"
                onClick={() => {
                  setSearchPatientTerm("");
                  setSearchFocused(false);
                }}
                className="absolute right-3.5 top-3.5 p-0.5 rounded-full hover:bg-muted text-muted-foreground cursor-pointer bg-transparent border-0"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Floating Dropdown suggestions */}
          <AnimatePresence>
            {searchFocused && filteredPatientsList.length > 0 && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSearchFocused(false)} />
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute left-0 right-0 mt-2 p-2 rounded-2xl border bg-card shadow-xl z-50 max-h-60 overflow-y-auto scrollbar-thin border-border"
                >
                  {filteredPatientsList.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        handleSelectPatient(p.id);
                        setSearchPatientTerm("");
                        setSearchFocused(false);
                      }}
                      className="w-full flex items-center gap-3 p-2.5 rounded-xl text-left hover:bg-purple-500/10 hover:text-purple-700 dark:hover:text-purple-300 transition-colors text-xs text-foreground cursor-pointer bg-transparent border-0"
                    >
                      <div className="w-8 h-8 rounded-full gradient-primary text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {p.nome.split(" ").slice(0, 2).map((n: string) => n[0]).join("")}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{p.nome}</p>
                        <p className="text-[10px] text-muted-foreground">
                          {p.diagnosticos?.[0]?.descricao || "Sem diagnóstico"} • {p.idade || getAge(p.dataNascimento)} anos
                        </p>
                      </div>
                    </button>
                  ))}
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>

        {/* Contextual Action Buttons in top-right */}
        {activePaciente && (
          <div className="shrink-0 self-end sm:self-center">
            {activeTab === "evolucao" && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold text-white gradient-primary rounded-2xl shadow-md cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Evoluir Sessão
              </button>
            )}
            {activeTab === "plano" && (
              <button
                onClick={() => setIsNewMetaModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold text-white gradient-primary rounded-2xl shadow-md cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Meta
              </button>
            )}
            {activeTab === "avaliacoes" && (
              <button
                onClick={() => setIsNewAvaliacaoModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold text-white gradient-primary rounded-2xl shadow-md cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Nova Avaliação
              </button>
            )}
            {activeTab === "atividades" && (
              <button
                onClick={() => setIsNewRecursoModalOpen(true)}
                className="flex items-center gap-1.5 px-5 py-3 text-xs font-semibold text-white gradient-primary rounded-2xl shadow-md cursor-pointer border-0"
              >
                <Plus className="h-3.5 w-3.5" />
                Novo Recurso / Mídia
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── 360 PATIENT HEADER BANNER ─── */}
      {activePaciente ? (
        <PacienteProfileBanner paciente={activePaciente} prontuarios={prontuarios} />
      ) : (
        <div className="p-12 text-center text-xs text-muted-foreground border rounded-2xl bg-card border-border">
          Nenhum paciente selecionado. Digite o nome no campo de buscas acima para carregar o prontuário.
        </div>
      )}

      {/* ─── MAIN WORKSPACE CONTENTS ─── */}
      {activePaciente && (
        <div className="space-y-6">
          
          {/* Tabs bar */}
          <div className="border-b border-border">
            <div className="flex overflow-x-auto scrollbar-none">
              {clinicalTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 px-5 py-3.5 text-xs font-semibold whitespace-nowrap transition-all border-b-2 -mb-[2px] cursor-pointer bg-transparent border-t-0 border-x-0",
                      isActive
                        ? "border-purple-500 text-purple-600 dark:text-purple-400 font-bold"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Tab Panel */}
          <div className="min-h-[400px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.15 }}
              >
                {activeTab === "evolucao" && (
                  <TabEvolucoes
                    paciente={activePaciente}
                    prontuarios={prontuarios}
                    isModalOpen={isModalOpen}
                    setIsModalOpen={setIsModalOpen}
                    onAddEvolution={handleAddEvolution}
                  />
                )}

                {activeTab === "plano" && (
                  <TabPlanoTerapeutico
                    paciente={activePaciente}
                    planos={planos}
                    isNewMetaModalOpen={isNewMetaModalOpen}
                    setIsNewMetaModalOpen={setIsNewMetaModalOpen}
                    onAddMeta={handleAddMeta}
                    onUpdateMetaProgress={handleUpdateMetaProgress}
                  />
                )}

                {activeTab === "avaliacoes" && (
                  <TabAvaliacoes
                    paciente={activePaciente}
                    avaliacoes={avaliacoes}
                    isNewAvaliacaoModalOpen={isNewAvaliacaoModalOpen}
                    setIsNewAvaliacaoModalOpen={setIsNewAvaliacaoModalOpen}
                    onAddAvaliacao={handleAddAvaliacao}
                  />
                )}

                {activeTab === "atividades" && (
                  <TabAtividades
                    paciente={activePaciente}
                    recursos={recursos}
                    setRecursos={setRecursos}
                    isNewRecursoModalOpen={isNewRecursoModalOpen}
                    setIsNewRecursoModalOpen={setIsNewRecursoModalOpen}
                  />
                )}

                {activeTab === "frequencia" && (
                  <TabFrequencia
                    paciente={activePaciente}
                    frequencias={frequencias}
                    setFrequencias={setFrequencias}
                  />
                )}

                {activeTab === "cadastro" && (
                  <TabFichaPaciente paciente={activePaciente} />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </div>
  );
}
