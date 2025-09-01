// lib/stores/useFavoriteStore.ts
import { create } from "zustand";
import type { Destaque } from "@/lib/types/destaque"; // ajuste o path se necessário

type FavoriteStore = {
  favorites: Destaque[];
  setFavorites: (favs: Destaque[]) => void;
  addFavorite: (destaque: Destaque) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
};

export const useFavoriteStore = create<FavoriteStore>((set, get) => ({
  favorites: [],

  setFavorites: (favs) => {
    set({ favorites: favs });
    if (typeof window !== "undefined") {
      localStorage.setItem("favorites", JSON.stringify(favs));
    }
  },

  addFavorite: (destaque) =>
    set((state) => {
      // evita duplicados
      if (state.favorites.some((fav) => fav.id === destaque.id)) return state;
      const updated = [...state.favorites, destaque];
      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    }),

  removeFavorite: (id) =>
    set((state) => {
      const updated = state.favorites.filter((fav) => fav.id !== id);
      if (typeof window !== "undefined") {
        localStorage.setItem("favorites", JSON.stringify(updated));
      }
      return { favorites: updated };
    }),

  isFavorite: (id) => get().favorites.some((fav) => fav.id === id),
}));
