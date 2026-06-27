import type { Metadata } from "next";
import { ProntuariosPage } from "@/components/pages/prontuarios-page";

export const metadata: Metadata = {
  title: "Prontuário Eletrônico",
};

export default function Prontuarios() {
  return <ProntuariosPage />;
}
