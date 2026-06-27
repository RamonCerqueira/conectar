import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Instituto Conectar — Clínica de Desenvolvimento Infantil e Multidisciplinar",
  description: "Atendimento especializado em Psicologia, Fonoaudiologia, Terapia Ocupacional e Psicopedagogia. Cuidado integrado e acolhimento para o desenvolvimento da sua família.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
