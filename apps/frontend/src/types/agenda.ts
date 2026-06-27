export interface ProfissionalAgenda {
  id: string;
  nome: string;
  cor: string;
  cargo: string;
}

export interface WaitItem {
  id: string;
  nome: string;
  especialidade: string;
  desde: string;
}

export interface Slot {
  id: string;
  paciente: string;
  profissional: string;
  data: string;
  status: string;
}
