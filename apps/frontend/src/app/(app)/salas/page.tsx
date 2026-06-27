import type { Metadata } from "next";
import { SalasPage } from "@/components/pages/salas-page";

export const metadata: Metadata = {
  title: "Salas",
};

export default function Salas() {
  return <SalasPage />;
}
