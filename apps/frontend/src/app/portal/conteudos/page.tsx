import type { Metadata } from "next";
import { PortalDashboardPage } from "@/components/pages/portal-dashboard-page";

export const metadata: Metadata = {
  title: "Conteúdos & Laudos | Portal da Família Conectar",
};

export default function PortalConteudosPage() {
  return <PortalDashboardPage initialTab="conteudos" />;
}
