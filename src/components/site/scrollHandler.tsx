'use client';
import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export default function ScrollHandler() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // espera a próxima pintura para garantir que o DOM do ImoveisPage esteja pronto
    requestAnimationFrame(() => {
      const el = document.getElementById('ImoveisSection');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  }, [pathname, searchParams]); // roda sempre que a URL ou query mudar

  return null;
}
