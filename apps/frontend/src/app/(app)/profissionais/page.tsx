import type { Metadata } from "next";
import { ProfissionaisPage } from "@/components/pages/profissionais-page";

export const metadata: Metadata = {
  title: "Profissionais",
};

export default function Profissionais() {
  return <ProfissionaisPage />;
}
