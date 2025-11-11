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
  description: "TerraSul",
  icons: {
    apple: [
      {
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-57x57.png",
        sizes: "57x57",
        type: "image/png",
      },
      {
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-60x60.png",
        sizes: "60x60",
        type: "image/png",
      },
      {
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-72x72.png",
        sizes: "72x72",
        type: "image/png",
      },
      {
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-76x76.png",
        sizes: "76x76",
        type: "image/png",
      },
      {
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-114x114.png",
        sizes: "114x114",
        type: "image/png",
      },
      {
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-120x120.png",
        sizes: "120x120",
        type: "image/png",
      },
      {
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-144x144.png",
        sizes: "144x144",
        type: "image/png",
      },
      {
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-152x152.png",
        sizes: "152x152",
        type: "image/png",
      },
      {
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-180x180.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
    other: [
      {
        rel: "icon",
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/android-icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "msapplication-TileImage",
        url: "https://www.terrasulimoveis.com.br/uploads/favicon/ms-icon-144x144.png",
      },
    ],
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
