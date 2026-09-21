import type { Metadata } from "next";
import { PortalDashboardPage } from "@/components/pages/portal-dashboard-page";

export const metadata: Metadata = {
  title: "Agenda de Atendimentos | Portal da Família Conectar",
};

export default function PortalAgendaPage() {
  return <PortalDashboardPage initialTab="agenda" />;
}
