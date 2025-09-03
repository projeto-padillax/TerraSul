// app/layout.tsx — ❌ NÃO inclui "use client"
import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["200", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "LeadLink - TerraSul",
  description: "TerraSul",
  icons: {
    icon: [
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/favicon.ico" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    apple: [
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-57x57.png", sizes: "57x57", type: "image/png" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-60x60.png", sizes: "60x60", type: "image/png" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-72x72.png", sizes: "72x72", type: "image/png" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-76x76.png", sizes: "76x76", type: "image/png" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-114x114.png", sizes: "114x114", type: "image/png" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-120x120.png", sizes: "120x120", type: "image/png" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-144x144.png", sizes: "144x144", type: "image/png" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-152x152.png", sizes: "152x152", type: "image/png" },
      { url: "https://www.terrasulimoveis.com.br/uploads/favicon/apple-icon-180x180.png", sizes: "180x180", type: "image/png" },
    ],
    other: [
      { rel: "icon", url: "https://www.terrasulimoveis.com.br/uploads/favicon/android-icon-192x192.png", sizes: "192x192", type: "image/png" },
      { rel: "msapplication-TileImage", url: "https://www.terrasulimoveis.com.br/uploads/favicon/ms-icon-144x144.png" },
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
      <body className={`${montserrat.variable} antialiased font-[montserrat, sans-serif]`}>
        {children}
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
