import type { Metadata } from "next";
import { PortalDashboardPage } from "@/components/pages/portal-dashboard-page";

export const metadata: Metadata = {
  title: "Área do Responsável | Portal dos Pais",
};

export default function PortalDashboard() {
  return <PortalDashboardPage />;
}
