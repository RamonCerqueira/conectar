import type { Metadata } from "next";
import { ConfiguracoesPage } from "@/components/pages/configuracoes-page";

export const metadata: Metadata = {
  title: "Configurações",
};

export default function Configuracoes() {
  return <ConfiguracoesPage />;
}
