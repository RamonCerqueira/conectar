import type { Metadata, Viewport } from "next";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: "#8D5BD1",
};

export const metadata: Metadata = {
  title: {
    default: "Portal da Família | Instituto Conectar",
    template: "%s | Portal da Família Conectar",
  },
  description:
    "Aplicativo do responsável para acompanhamento terapêutico, agenda, relatórios e desenvolvimento infantil.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Conectar Família",
  },
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-full min-h-screen bg-[#FAF7FD]">
      {children}
    </div>
  );
}
