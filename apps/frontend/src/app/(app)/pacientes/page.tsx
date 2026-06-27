import type { Metadata } from "next";
import { PacientesPage } from "@/components/pages/pacientes-page";

export const metadata: Metadata = {
  title: "Pacientes",
};

export default function Pacientes() {
  return <PacientesPage />;
}
