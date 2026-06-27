import type { Metadata } from "next";
import { ComunicacaoPage } from "@/components/pages/comunicacao-page";

export const metadata: Metadata = {
  title: "Comunicação e WhatsApp",
};

export default function Comunicacao() {
  return <ComunicacaoPage />;
}
