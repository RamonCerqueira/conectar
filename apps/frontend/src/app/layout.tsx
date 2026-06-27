import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { QueryProvider } from "@/components/providers/query-provider";
import { Toaster } from "sonner";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Instituto Conectar — Gestão Clínica",
    template: "%s | Instituto Conectar",
  },
  description:
    "Sistema de gestão clínica especializado no atendimento de crianças com dificuldades de aprendizagem, TDAH, TEA, Dislexia e afins.",
  keywords: [
    "clínica infantil",
    "psicopedagogia",
    "fonoaudiologia",
    "terapia ocupacional",
    "TDAH",
    "TEA",
    "dislexia",
    "gestão clínica",
  ],
  authors: [{ name: "Instituto Conectar" }],
  robots: "noindex, nofollow", // Sistema interno
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body className={`${plusJakartaSans.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <QueryProvider>
            {children}
            <Toaster
              position="top-right"
              richColors
              expand={false}
              toastOptions={{
                style: {
                  fontFamily: "var(--font-sans)",
                },
              }}
            />
          </QueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
