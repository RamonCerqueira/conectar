import type { Metadata } from "next";
import { ColaboradoresPage } from "@/components/pages/colaboradores-page";

export const metadata: Metadata = {
  title: "Colaboradores",
};

export default function Colaboradores() {
  return <ColaboradoresPage />;
}
