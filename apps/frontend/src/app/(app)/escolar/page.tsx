import type { Metadata } from "next";
import { EscolarPage } from "@/components/pages/escolar-page";

export const metadata: Metadata = {
  title: "Controle Escolar",
};

export default function Escolar() {
  return <EscolarPage />;
}
