import type { Metadata } from "next";
import { RelatoriosPage } from "@/components/pages/relatorios-page";

export const metadata: Metadata = {
  title: "Relatórios Clínicos",
};

export default function Relatorios() {
  return <RelatoriosPage />;
}
