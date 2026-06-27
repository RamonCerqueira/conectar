import type { PlanoTerapeutico } from "./plano-terapeutico";
export type { PlanoTerapeutico };

export interface Diagnostico {
  id: string;
  cid?: string;
  descricao: string;
}

export interface Responsavel {
  id: string;
  nome: string;
  cpf?: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  grauParent: string;
  profissao?: string;
  isPrincipal: boolean;
}

export interface MedicosRef {
  neurologista?: string | null;
  pediatra?: string | null;
}

export interface FinanceiroLancamento {
  id: string;
  descricao: string;
  valor: number;
  status: "PAGO" | "PENDENTE" | string;
  vencimento: string;
}

export interface ProntuarioRegistro {
  id: string;
  data: string;
  profissional: string;
  observacoes: string;
}

export interface Documento {
  id: string;
  nome: string;
  tipo: string;
  data: string;
}

export interface Exercicio {
  id: string;
  titulo: string;
  tipo: string;
  realizado: boolean | null;
  data: string;
}

export interface Paciente {
  id: string;
  nome: string;
  foto?: string | null;
  sexo: string;
  dataNascimento: string;
  cpf?: string;
  rg?: string;
  status: "ATIVO" | "LISTA_ESPERA" | "ALTA" | string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  escola?: string;
  serie?: string;
  turnoEscolar?: string;
  nomeProf?: string;
  coordenador?: string;
  diagnosticos: Diagnostico[];
  alergias?: string[];
  medicamentos?: string[];
  observacoesMed?: string;
  convenio?: string;
  numeroConvenio?: string;
  validade?: string;
  medicosRef?: MedicosRef;
  primeiraConsulta?: string;
  observacoes?: string;
  responsaveis: Responsavel[];
  planosTerapeuticos?: PlanoTerapeutico[];
  financeiro?: FinanceiroLancamento[];
  prontuario?: ProntuarioRegistro[];
  documentos?: Documento[];
  exercicios?: Exercicio[];
}
