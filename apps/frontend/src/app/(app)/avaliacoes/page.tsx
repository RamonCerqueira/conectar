import type { Metadata } from "next";
import { AvaliacoesPage } from "@/components/pages/avaliacoes-page";

export const metadata: Metadata = {
  title: "Avaliações e Testes",
};

export default function Avaliacoes() {
  return <AvaliacoesPage />;
}
