"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { PacienteCard } from "./pacientes/paciente-card";
import { PacienteDetailsDrawer } from "./pacientes/paciente-details-drawer";
import { PacienteCreateModal } from "./pacientes/paciente-create-modal";
import { Paciente } from "@/types";


// ─── DADOS MOCKADOS COMPLETOS ───────────────────────────────────────────────
const initialPacientes: Paciente[] = [
  {
    id: "paciente-1",
    nome: "Lucas Mendes da Silva",
    foto: null,
    sexo: "MASCULINO",
    dataNascimento: "2018-05-15",
    cpf: "45678912300",
    rg: "5544332-X",
    status: "ATIVO",
    cep: "01311-200",
    logradouro: "Avenida Paulista",
    numero: "1000",
    complemento: "Apto 42",
    bairro: "Bela Vista",
    cidade: "São Paulo",
    estado: "SP",
    escola: "Colégio Santa Maria",
    serie: "3º ano Fundamental",
    turnoEscolar: "Manhã",
    nomeProf: "Profª Sandra",
    coordenador: "Helena Reis",
    diagnosticos: [
      { id: "d1", cid: "F90.0", descricao: "TDAH" },
      { id: "d2", cid: "F81.0", descricao: "Dislexia" },
    ],
    alergias: ["Lactose", "Dipirona"],
    medicamentos: ["Ritalina 10mg"],
    observacoesMed: "Apresenta maior desatenção no período vespertino.",
    convenio: "Bradesco Saúde",
    numeroConvenio: "7894561230",
    validade: "2028-12-31",
    medicosRef: { neurologista: "Dr. Roberto Antunes", pediatra: "Dra. Eliana K." },
    primeiraConsulta: "2025-02-10",
    observacoes: "Criança muito criativa, responde bem a estímulos visuais.",
    responsaveis: [
      {
        id: "resp-1",
        nome: "Mariana Mendes da Silva",
        cpf: "12345678900",
        telefone: "11987654321",
        whatsapp: "11987654321",
        email: "mariana.mendes@email.com",
        grauParent: "MAE",
        profissao: "Designer Grafico",
        isPrincipal: true,
      },
      {
        id: "resp-2",
        nome: "Ricardo da Silva",
        cpf: "98765432100",
        telefone: "11912345678",
        whatsapp: "11912345678",
        email: "ricardo.silva@email.com",
        grauParent: "PAI",
        profissao: "Engenheiro",
        isPrincipal: false,
      },
    ],
    planosTerapeuticos: [
      {
        id: "plano-1",
        titulo: "Intervenção Psicopedagógica Integrada",
        descricao: "Foco no desenvolvimento da leitura, foco e processamento lógico.",
        metas: [
          { id: "m1", objetivo: "Leitura fluida de pequenos parágrafos", progresso: 75, status: "EM_ANDAMENTO" },
          { id: "m2", objetivo: "Organização do material escolar autónoma", progresso: 50, status: "EM_ANDAMENTO" },
          { id: "m3", objetivo: "Foco sustentado em atividades de 20 min", progresso: 90, status: "EM_ANDAMENTO" },
        ],
      },
    ],
    financeiro: [
      { id: "f1", descricao: "Mensalidade - Junho 2026", valor: 1200, status: "PAGO", vencimento: "2026-06-10" },
      { id: "f2", descricao: "Mensalidade - Julho 2026", valor: 1200, status: "PENDENTE", vencimento: "2026-07-10" },
    ],
    prontuario: [
      { id: "pr1", data: "2026-06-24T14:30:00Z", profissional: "Dra. Ana Lima (Psicopedagoga)", observacoes: "Evolução excelente na leitura silábica. Realizou atividade de associação visual com 90% de acertos." },
      { id: "pr2", data: "2026-06-17T14:30:00Z", profissional: "Dra. Ana Lima (Psicopedagoga)", observacoes: "Início agitado, demorou 10 minutos para focar. Respondeu bem após introdução de elemento lúdico." },
    ],
    documentos: [
      { id: "doc1", nome: "Contrato de Prestação de Serviços.pdf", tipo: "Contrato", data: "2026-02-10" },
      { id: "doc2", nome: "Termo de Consentimento LGPD.pdf", tipo: "Documento", data: "2026-02-10" },
    ],
    exercicios: [
      { id: "ex1", titulo: "Caça-Palavras Silábico", tipo: "pdf", realizado: true, data: "2026-06-20" },
      { id: "ex2", titulo: "Leitura Compartilhada - Livro O Pequeno Príncipe", tipo: "orientacao", realizado: null, data: "2026-06-24" },
    ],
  },
  {
    id: "paciente-2",
    nome: "Sofia Andrade Rezende",
    foto: null,
    sexo: "FEMININO",
    dataNascimento: "2019-09-02",
    cpf: "98712365411",
    rg: "4455662-1",
    status: "ATIVO",
    cep: "04012-000",
    logradouro: "Rua Domingos de Morais",
    numero: "500",
    complemento: "",
    bairro: "Vila Mariana",
    cidade: "São Paulo",
    estado: "SP",
    escola: "Escola Maple Bear",
    serie: "Pré-Escola 2",
    turnoEscolar: "Tarde",
    nomeProf: "Profª Camila",
    coordenador: "Renata Abreu",
    diagnosticos: [
      { id: "d3", cid: "F84.0", descricao: "TEA (Nível 1)" },
    ],
    alergias: [],
    medicamentos: [],
    observacoesMed: "Sensibilidade auditiva alta a ruídos metálicos.",
    convenio: "SulAmérica",
    numeroConvenio: "963852741",
    validade: "2027-06-30",
    medicosRef: { neurologista: "Dra. Carolina M.", pediatra: "Dr. Fábio Rossi" },
    primeiraConsulta: "2025-05-15",
    observacoes: "Criança responde muito bem a reforçadores baseados em dinossauros.",
    responsaveis: [
      {
        id: "resp-3",
        nome: "Beatriz Andrade Rezende",
        cpf: "45612378988",
        telefone: "11999998888",
        whatsapp: "11999998888",
        email: "beatriz.andrade@email.com",
        grauParent: "MAE",
        profissao: "Arquiteta",
        isPrincipal: true,
      },
    ],
    planosTerapeuticos: [
      {
        id: "plano-2",
        titulo: "Estimulação de Linguagem e Socialização",
        descricao: "Plano focado em ampliar repertório verbal e tolerância à frustração.",
        metas: [
          { id: "m4", objetivo: "Expressar frustração verbalmente sem gritos", progresso: 40, status: "EM_ANDAMENTO" },
          { id: "m5", objetivo: "Manter contato visual por mais de 5s", progresso: 60, status: "EM_ANDAMENTO" },
        ],
      },
    ],
    financeiro: [
      { id: "f3", descricao: "Mensalidade - Junho 2026", valor: 1400, status: "PAGO", vencimento: "2026-06-10" },
    ],
    prontuario: [
      { id: "pr3", data: "2026-06-25T15:30:00Z", profissional: "Dra. Carla Souza (Fonoaudióloga)", observacoes: "Sessão focada na emissão de fonemas fricativos. Respondeu muito bem ao jogo de pistas do dinossauro." },
    ],
    documentos: [
      { id: "doc3", nome: "Laudo Fonoaudiológico Inicial.pdf", tipo: "Laudo", data: "2025-05-20" },
    ],
    exercicios: [
      { id: "ex3", titulo: "Treino de sopro com canudo", tipo: "jogo", realizado: true, data: "2026-06-22" },
    ],
  },
  {
    id: "paciente-3",
    nome: "Pedro Oliveira Neves",
    foto: null,
    sexo: "MASCULINO",
    dataNascimento: "2015-11-30",
    cpf: "75315985200",
    rg: "2233441-2",
    status: "LISTA_ESPERA",
    cep: "03010-010",
    logradouro: "Rua Bresser",
    numero: "1200",
    complemento: "Bloco B, Apto 12",
    bairro: "Brás",
    cidade: "São Paulo",
    estado: "SP",
    escola: "Escola Estadual Castro Alves",
    serie: "5º ano Fundamental",
    turnoEscolar: "Manhã",
    nomeProf: "Prof. Marcos",
    coordenador: "Sônia Regina",
    diagnosticos: [
      { id: "d4", cid: "F81.2", descricao: "Discalculia" },
    ],
    alergias: ["Glúten"],
    medicamentos: [],
    observacoesMed: "Acompanhamento por suspeita de TDAH associado.",
    convenio: "Amil",
    numeroConvenio: "321654987",
    validade: "2026-10-31",
    medicosRef: { neurologista: null, pediatra: "Dra. Margarete" },
    primeiraConsulta: null,
    observacoes: "Pedro apresenta ansiedade acentuada ao realizar testes matemáticos.",
    responsaveis: [
      {
        id: "resp-4",
        nome: "Karina Oliveira",
        cpf: "36925814755",
        telefone: "11988887777",
        whatsapp: "11988887777",
        email: "karina.oliveira@email.com",
        grauParent: "MAE",
        profissao: "Contadora",
        isPrincipal: true,
      },
    ],
    planosTerapeuticos: [],
    financeiro: [],
    prontuario: [],
    documentos: [],
    exercicios: [],
  },
];

export function PacientesPage() {
  const [pacientes, setPacientes] = useState(initialPacientes);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("TODOS");
  const [selectedPaciente, setSelectedPaciente] = useState<typeof initialPacientes[0] | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const loadPacientes = async () => {
    try {
      const res = await api.get("/pacientes");
      if (res.data && res.data.length > 0) {
        const backendPacientes = res.data.map((p: any) => ({
          ...p,
          diagnosticos: p.diagnosticos || [],
          alergias: p.alergias || [],
          medicamentos: p.medicamentos || [],
          responsaveis: p.responsaveis || [],
          planosTerapeuticos: p.planosTerapeuticos || [],
          financeiro: p.financeiro || [],
          prontuario: p.prontuario || [],
          documentos: p.documentos || [],
          exercicios: p.exercicios || [],
        }));
        setPacientes(backendPacientes);
      }
    } catch (err) {
      console.warn("Could not load from real backend, using mock data", err);
    }
  };

  useEffect(() => {
    loadPacientes();
  }, []);

  const handleCreatePaciente = async (data: {
    nome: string;
    dataNascimento: string;
    sexo: string;
    cpf: string;
    status: string;
    escola: string;
    serie: string;
    turnoEscolar: string;
    nomeProf: string;
    coordenador: string;
    responsavelNome: string;
    responsavelTel: string;
    responsavelEmail: string;
    responsavelParentesco: string;
    responsavelProfissao: string;
    diagnosticoDesc: string;
    diagnosticoCid: string;
    medicamentos: string;
    alergias: string;
    observacoesMed: string;
    sensibilidadeSensorial: string;
    hiperfoco: string;
    observacoes: string;
    cep?: string;
    logradouro?: string;
    numero?: string;
    complemento?: string;
    bairro?: string;
    cidade?: string;
    estado?: string;
  }) => {
    const payload = {
      nome: data.nome,
      dataNascimento: new Date(data.dataNascimento).toISOString(),
      sexo: data.sexo,
      cpf: data.cpf.replace(/\D/g, ""),
      status: data.status,
      escola: data.escola,
      serie: data.serie,
      turnoEscolar: data.turnoEscolar,
      nomeProf: data.nomeProf,
      coordenador: data.coordenador,
      responsavelNome: data.responsavelNome,
      responsavelTel: data.responsavelTel,
      responsavelEmail: data.responsavelEmail,
      responsavelParentesco: data.responsavelParentesco,
      responsavelProfissao: data.responsavelProfissao,
      diagnosticoDesc: data.diagnosticoDesc,
      diagnosticoCid: data.diagnosticoCid,
      medicamentos: data.medicamentos,
      alergias: data.alergias,
      observacoesMed: data.observacoesMed,
      sensibilidadeSensorial: data.sensibilidadeSensorial,
      hiperfoco: data.hiperfoco,
      observacoes: data.observacoes,
      cep: data.cep,
      logradouro: data.logradouro,
      numero: data.numero,
      complemento: data.complemento,
      bairro: data.bairro,
      cidade: data.cidade,
      estado: data.estado,
    };

    try {
      await api.post("/pacientes", payload);
      toast.success("Paciente cadastrado com sucesso!");
      loadPacientes();
      setIsNewModalOpen(false);
    } catch (err) {
      console.warn("Could not save to real backend, fallback to local state", err);
      // Fallback
      const newPaciente: typeof initialPacientes[0] = {
        id: `paciente-${Date.now()}`,
        nome: data.nome,
        foto: null,
        sexo: data.sexo as any,
        dataNascimento: data.dataNascimento,
        cpf: data.cpf.replace(/\D/g, ""),
        rg: "",
        status: data.status as any,
        cep: data.cep || "",
        logradouro: data.logradouro || "",
        numero: data.numero || "",
        complemento: data.complemento || "",
        bairro: data.bairro || "",
        cidade: data.cidade || "",
        estado: data.estado || "",
        escola: data.escola,
        serie: data.serie,
        turnoEscolar: data.turnoEscolar || "Manhã",
        nomeProf: data.nomeProf,
        coordenador: data.coordenador,
        diagnosticos: data.diagnosticoDesc
          ? [{ id: `diag-${Date.now()}`, cid: data.diagnosticoCid || "", descricao: data.diagnosticoDesc }]
          : [],
        alergias: data.alergias ? data.alergias.split(",").map((a) => a.trim()).filter(Boolean) : [],
        medicamentos: data.medicamentos ? data.medicamentos.split(",").map((m) => m.trim()).filter(Boolean) : [],
        observacoesMed: data.observacoesMed,
        convenio: "",
        numeroConvenio: "",
        validade: null,
        medicosRef: {},
        primeiraConsulta: new Date().toISOString().split("T")[0],
        observacoes: `${data.observacoes || ""}${data.sensibilidadeSensorial ? ` | Sensibilidades: ${data.sensibilidadeSensorial}` : ""}${data.hiperfoco ? ` | Hiperfocos/Interesses: ${data.hiperfoco}` : ""}`.trim(),
        responsaveis: [
          {
            id: `resp-${Date.now()}`,
            nome: data.responsavelNome || "Responsável não informado",
            cpf: "",
            telefone: data.responsavelTel.replace(/\D/g, ""),
            whatsapp: data.responsavelTel.replace(/\D/g, ""),
            email: data.responsavelEmail,
            grauParent: (data.responsavelParentesco || "MAE") as any,
            profissao: data.responsavelProfissao,
            isPrincipal: true,
          },
        ],
        planosTerapeuticos: [],
        financeiro: [],
        prontuario: [],
        documentos: [],
        exercicios: [],
      };
      setPacientes([newPaciente, ...pacientes]);
      setIsNewModalOpen(false);
      toast.success("Paciente adicionado (Modo de Demonstração)");
    }
  };

  const filteredPacientes = pacientes.filter((p) => {
    const matchesSearch =
      p.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.escola?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.responsaveis.some((r) => r.nome.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.diagnosticos.some((d) => d.descricao.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (p.cpf && p.cpf.includes(searchTerm));

    const matchesStatus = statusFilter === "TODOS" || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header da Página */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: "hsl(var(--foreground))" }}>
            Pacientes
          </h1>
          <p className="text-sm" style={{ color: "hsl(var(--muted-foreground))" }}>
            Gestão, prontuários, evoluções e planos terapêuticos das crianças.
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsNewModalOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white gradient-primary shadow-lg shadow-purple-500/10 cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>Cadastrar Criança</span>
        </motion.button>
      </div>

      {/* Filtros e Busca */}
      <div
        className="p-4 rounded-2xl border flex flex-col md:flex-row gap-4"
        style={{ background: "hsl(var(--card))", borderColor: "hsl(var(--border))" }}
      >
        <div className="flex-1 relative">
          <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar por nome da criança, responsável, escola ou diagnóstico..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl text-sm outline-none border transition-colors"
            style={{
              background: "hsl(var(--muted))",
              borderColor: "transparent",
              color: "hsl(var(--foreground))",
            }}
          />
        </div>

        <div className="flex gap-2">
          {["TODOS", "ATIVO", "LISTA_ESPERA", "ALTA"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer",
                statusFilter === status
                  ? "gradient-primary text-white"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              )}
            >
              {status === "TODOS" ? "Todos" : status.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Pacientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPacientes.map((paciente) => (
          <PacienteCard
            key={paciente.id}
            paciente={paciente}
            onViewDetails={(p) => setSelectedPaciente(p)}
          />
        ))}

        {filteredPacientes.length === 0 && (
          <div className="col-span-full py-12 flex flex-col items-center justify-center text-center">
            <Users className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <h3 className="font-bold text-lg text-foreground">Nenhum paciente encontrado</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Tente redefinir sua busca ou filtrar por outro status de atendimento.
            </p>
          </div>
        )}
      </div>

      {/* Detalhes do Paciente (Drawer Lateral) */}
      <PacienteDetailsDrawer
        selectedPaciente={selectedPaciente}
        onClose={() => setSelectedPaciente(null)}
      />

      {/* Modal de Cadastro de Paciente */}
      <PacienteCreateModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onSubmit={handleCreatePaciente}
      />
    </div>
  );
}
