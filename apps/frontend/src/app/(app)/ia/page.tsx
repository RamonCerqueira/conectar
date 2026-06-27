import type { Metadata } from "next";
import { IaPage } from "@/components/pages/ia-page";

export const metadata: Metadata = {
  title: "IA Conectar",
};

export default function Ia() {
  return <IaPage />;
}
