import type { Metadata } from "next";
import { FrequenciaPage } from "@/components/pages/frequencia-page";

export const metadata: Metadata = {
  title: "Controle de Frequência",
};

export default function Frequencia() {
  return <FrequenciaPage />;
}
