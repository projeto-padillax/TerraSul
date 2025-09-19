"use client";
import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useIsMobile } from "@/hooks/useIsMobile";

export default function ScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isMobile = useIsMobile(); // usa o hook

  useEffect(() => {
    if (!isMobile) return; // só faz o scroll se for celular

    requestAnimationFrame(() => {
      const el = document.getElementById("ImoveisSection");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [pathname, searchParams, isMobile]); // depende também do isMobile

  return null;
}
