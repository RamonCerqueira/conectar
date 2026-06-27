import type { Metadata } from "next";
import { FinanceiroPage } from "@/components/pages/financeiro-page";

export const metadata: Metadata = {
  title: "Financeiro",
};

export default function Financeiro() {
  return <FinanceiroPage />;
}
