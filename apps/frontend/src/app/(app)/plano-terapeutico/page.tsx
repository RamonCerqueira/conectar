import type { Metadata } from "next";
import { PlanoTerapeuticoPage } from "@/components/pages/plano-terapeutico-page";

export const metadata: Metadata = {
  title: "Plano Terapêutico",
};

export default function PlanoTerapeutico() {
  return <PlanoTerapeuticoPage />;
}
