export interface HistoricoItem {
  data: string;
  valor: number;
  nota: string;
}

export interface Meta {
  id: string;
  objetivo: string;
  descricao: string;
  progresso: number;
  status: string;
  prazo: string;
  historico: HistoricoItem[];
}

export interface PlanoTerapeutico {
  id: string;
  pacienteId: string;
  pacienteNome: string;
  titulo: string;
  descricao: string;
  metas: Meta[];
}
