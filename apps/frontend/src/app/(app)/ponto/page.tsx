import type { Metadata } from "next";
import { PontoPage } from "@/components/pages/ponto-page";

export const metadata: Metadata = {
  title: "Ponto Eletrônico",
};

export default function Ponto() {
  return <PontoPage />;
}
