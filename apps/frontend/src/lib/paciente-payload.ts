export interface PacienteIntakeData {
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
  modeloCobranca?: string;
  valorConsulta?: number;
}
const optional = (value?: string) => value?.trim() || undefined;
const list = (value: string) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
export function buildPacientePayload(data: PacienteIntakeData) {
  const nascimento = new Date(data.dataNascimento);
  if (!data.nome.trim() || !Number.isFinite(nascimento.getTime()))
    throw new Error("Preencha o nome e uma data de nascimento vÃ¡lida.");
  const {
    responsavelNome,
    responsavelTel,
    responsavelEmail,
    responsavelParentesco,
    responsavelProfissao,
    diagnosticoDesc,
    diagnosticoCid,
    sensibilidadeSensorial,
    hiperfoco,
    medicamentos,
    alergias,
    observacoesMed,
    ...dados
  } = data;
  const clinical = [
    optional(observacoesMed),
    sensibilidadeSensorial.trim()
      ? `Sensibilidades sensoriais: ${sensibilidadeSensorial.trim()}`
      : undefined,
    hiperfoco.trim()
      ? `Interesses / hiperfocos: ${hiperfoco.trim()}`
      : undefined,
  ]
    .filter(Boolean)
    .join("\n");
  return {
    ...dados,
    nome: data.nome.trim(),
    dataNascimento: nascimento.toISOString(),
    cpf: optional(data.cpf.replace(/\D/g, "")),
    medicamentos: list(medicamentos),
    alergias: list(alergias),
    observacoesMed: clinical || undefined,
    responsaveis: responsavelNome.trim()
      ? [
          {
            nome: responsavelNome.trim(),
            telefone: optional(responsavelTel.replace(/\D/g, "")),
            email: optional(responsavelEmail),
            grauParent: ({ AVO_M: "AVO_MATERNA", AVO_P: "AVO_PATERNO", AVO: "OUTRO", TIO: "OUTRO" } as Record<string, string>)[responsavelParentesco] || responsavelParentesco,
            profissao: optional(responsavelProfissao),
            isPrincipal: true,
          },
        ]
      : [],
    diagnosticos: diagnosticoDesc.trim()
      ? [{ descricao: diagnosticoDesc.trim(), cid: optional(diagnosticoCid) }]
      : [],
  };
}
