import type { Metadata } from "next";
import { ListaEsperaPage } from "@/components/pages/lista-espera-page";

export const metadata: Metadata = {
  title: "Lista de Espera",
};

export default function ListaEspera() {
  return <ListaEsperaPage />;
}
