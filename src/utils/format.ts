// src/utils/format.ts
export const formatIntPtBR = (n: number) =>
  Math.trunc(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');

export const formatBRL0 = (n: number) => `R$ ${formatIntPtBR(n)}`;

export const lower = (s: string) => s.toLowerCase(); // sem locale
export const capitalizePt = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : s;
