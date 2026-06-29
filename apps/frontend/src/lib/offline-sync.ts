import { api } from "./api";
import { toast } from "sonner";

export interface OfflineProntuario {
  id: string;
  pacienteId: string;
  queixaPrincipal?: string;
  objetivosSessao?: string;
  atividadesRealizadas?: string;
  resultados?: string;
  comportamento?: string;
  orientacoesPais?: string;
  proximaMeta?: string;
  data: string;
  pacienteNome: string;
  profissional?: string;
}

export function getOfflineProntuarios(): OfflineProntuario[] {
  if (typeof window === "undefined") return [];
  const stored = localStorage.getItem("offline_prontuarios");
  return stored ? JSON.parse(stored) : [];
}

export function saveOfflineProntuario(pr: OfflineProntuario) {
  if (typeof window === "undefined") return;
  const list = getOfflineProntuarios();
  list.push(pr);
  localStorage.setItem("offline_prontuarios", JSON.stringify(list));
}

export async function syncOfflineProntuarios(): Promise<number> {
  const list = getOfflineProntuarios();
  if (list.length === 0) return 0;

  toast.info(`Conexão reestabelecida. Sincronizando ${list.length} evolução(ões) salvas offline...`);
  
  let successCount = 0;
  const remaining: OfflineProntuario[] = [];

  for (const item of list) {
    try {
      // Remove aux fields that backend doesn't expect
      const { id, pacienteNome, profissional, ...payload } = item;
      await api.post("/prontuarios", payload);
      successCount++;
    } catch (err) {
      console.error(`Erro ao sincronizar evolução offline para o paciente ${item.pacienteNome}:`, err);
      remaining.push(item);
    }
  }

  if (typeof window !== "undefined") {
    localStorage.setItem("offline_prontuarios", JSON.stringify(remaining));
  }

  if (successCount > 0) {
    toast.success(`${successCount} evolução(ões) sincronizada(s) com o servidor com sucesso!`);
  }
  if (remaining.length > 0) {
    toast.warning(`${remaining.length} evolução(ões) falharam no envio e serão mantidas localmente.`);
  }

  return successCount;
}
