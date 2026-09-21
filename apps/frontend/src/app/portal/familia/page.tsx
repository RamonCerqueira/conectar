import type { Metadata } from "next";
import { PortalDashboardPage } from "@/components/pages/portal-dashboard-page";

export const metadata: Metadata = {
  title: "Espaço da Família | Portal da Família Conectar",
};

export default function PortalFamiliaPage() {
  return <PortalDashboardPage initialTab="familia" />;
}
