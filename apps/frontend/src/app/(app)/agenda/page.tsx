import type { Metadata } from "next";
import { AgendaPage } from "@/components/pages/agenda-page";

export const metadata: Metadata = {
  title: "Agenda Clínica",
};

export default function Agenda() {
  return <AgendaPage />;
}
