import type { Metadata } from "next";
import { PortalDashboardPage } from "@/components/pages/portal-dashboard-page";

export const metadata: Metadata = {
  title: "Financeiro & Recibos de Reembolso | Portal da Família Conectar",
};

export default function PortalFinanceiroPage() {
  return <PortalDashboardPage initialTab="financeiro" />;
}
