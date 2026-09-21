import type { Metadata } from "next";
import { PortalDashboardPage } from "@/components/pages/portal-dashboard-page";

export const metadata: Metadata = {
  title: "Início | Portal da Família Conectar",
};

export default function PortalIndexPage() {
  return <PortalDashboardPage />;
}
