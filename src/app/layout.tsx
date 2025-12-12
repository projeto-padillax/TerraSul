// app/layout.tsx — ❌ NÃO inclui "use client"
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import WhatsAppButton from "@/components/site/whatsapp";
import { ModalProvider } from "@/utils/ModalContext";
import GoogleTagManager from "@/components/GoogleTagManager";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LeadLink - TerraSul",
  description: "TerraSul Imoveis",
  verification: {
    google: "Zpz5JJ2ZL7dcNOMPR5VcmDbVRxLHByfCMF_OzC443RQ",
  },
   alternates: {
    canonical: "https://www.terrasulimoveis.com.br",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} antialiased font-[montserrat, sans-serif]`}
      >
        <GoogleTagManager />
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-5ZF3W4BG"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <ModalProvider>
          {children}
          <Toaster richColors position="top-center" />
          <WhatsAppButton />
        </ModalProvider>
      </body>
    </html>
  );
}
