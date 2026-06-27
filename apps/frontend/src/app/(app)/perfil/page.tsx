import type { Metadata } from "next";
import { PerfilPage } from "@/components/pages/perfil-page";

export const metadata: Metadata = {
  title: "Meu Perfil",
};

export default function Perfil() {
  return <PerfilPage />;
}
