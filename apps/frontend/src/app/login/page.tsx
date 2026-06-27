import type { Metadata } from "next";
import { LoginPage } from "@/components/pages/login-page";

export const metadata: Metadata = {
  title: "Entrar | Instituto Conectar",
  description: "Acesse o sistema de gestão clínica do Instituto Conectar",
};

export default function Login() {
  return <LoginPage />;
}
