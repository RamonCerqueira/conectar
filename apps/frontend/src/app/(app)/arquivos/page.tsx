import type { Metadata } from "next";
import { ArquivosPage } from "@/components/pages/arquivos-page";

export const metadata: Metadata = {
  title: "Arquivos e Exames",
};

export default function Arquivos() {
  return <ArquivosPage />;
}
