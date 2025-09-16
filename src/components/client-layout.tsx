"use client";

import { useEffect, useState } from "react";
import { useFavoriteStore } from "@/lib/stores/useFavoriteStore";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const setFavorites = useFavoriteStore((state) => state.setFavorites);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) {
      setFavorites(JSON.parse(stored));
    }
    setIsReady(true); // evita re-render inicial instável
  }, [setFavorites]);

  if (!isReady) return null; // impede renderização antes de carregar do localStorage

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <main className="scroll-smooth">{children}</main>
      <Toaster richColors expand={true} />
    </ThemeProvider>
  );
}
