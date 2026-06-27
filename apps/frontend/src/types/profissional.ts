export interface Horarios {
  segunda?: string;
  terca?: string;
  quarta?: string;
  quinta?: string;
  sexta?: string;
}

export interface Profissional {
  id: string;
  nome: string;
  email: string;
  tipo: string;
  especialidade: string;
  registro: string;
  orgaoRegistro: string;
  bio: string;
  cor: string;
  ativo: boolean;
  telefone: string;
  salas: string[];
  horarios: Horarios;
  cpfCnpj?: string;
  tipoContrato?: "CLT" | "PJ" | "COMISSAO" | "SOCIO" | string;
  cargaHoraria?: string;
  salarioBase?: number;
  comissaoPorcentagem?: number;
  chavePix?: string;
  especialidades?: string[];
  formacao?: string;
  cep?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  uf?: string;
}
