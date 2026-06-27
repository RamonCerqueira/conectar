import type { Metadata } from "next";
import { ContratosPage } from "@/components/pages/contratos-page";

export const metadata: Metadata = {
  title: "Contratos e LGPD",
};

export default function Contratos() {
  return <ContratosPage />;
}
