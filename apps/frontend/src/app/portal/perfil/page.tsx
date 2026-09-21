import type { Metadata } from "next";
import { PortalDashboardPage } from "@/components/pages/portal-dashboard-page";

export const metadata: Metadata = {
  title: "Meu Perfil | Portal da Família Conectar",
};

export default function PortalPerfilPage() {
  return <PortalDashboardPage initialTab="perfil" />;
}
