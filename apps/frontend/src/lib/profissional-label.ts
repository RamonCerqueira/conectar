export function profissionalLabel(value: unknown): string {
  if (typeof value === "string") return value;
  if (!value || typeof value !== "object") return "Profissional não informado";
  const profissional = value as {
    usuario?: { nome?: string };
    nome?: string;
    especialidade?: string;
  };
  const nome =
    profissional.usuario?.nome ||
    profissional.nome ||
    "Profissional não informado";
  return profissional.especialidade
    ? `${nome} (${profissional.especialidade})`
    : nome;
}
