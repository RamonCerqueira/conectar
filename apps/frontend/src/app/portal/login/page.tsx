import type { Metadata } from "next";
import { PortalLoginPage } from "@/components/pages/portal-login-page";

export const metadata: Metadata = {
  title: "Acesso Responsável | Portal dos Pais",
  description: "Acesse o portal de pais e responsáveis do Instituto Conectar",
};

export default function PortalLogin() {
  return <PortalLoginPage />;
}
