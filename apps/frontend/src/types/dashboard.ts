export interface Consulta {
  id: string | number;
  horario: string;
  paciente: string;
  profissional: string;
  especialidade: string;
  tipo: string;
  sala: string;
  status: string;
  foto: string;
}

export interface Alerta {
  id: string | number;
  tipo: "warning" | "info" | "success" | "error" | string;
  mensagem: string;
  acao: string;
  icon: React.ComponentType<any>;
}

export interface Aniversariante {
  id: string | number;
  nome: string;
  idade: number | null;
  foto: string;
  profissional: boolean;
}

export interface EvolucaoFinanceira {
  mes: string;
  receita: number;
  despesa: number;
}

export interface AtendimentoPorEspecialidade {
  name: string;
  value: number;
  color: string;
}

export interface StatCard {
  id: string;
  title: string;
  value: string;
  change: string;
  changeType: "up" | "down" | "alert" | "neutral";
  changeLabel: string;
  icon: React.ComponentType<any>;
  gradient: string;
  bg: string;
  iconBg: string;
  iconColor: string;
}
