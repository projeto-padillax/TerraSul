// components/FavoriteButton.tsx
"use client";

import { useFavoriteStore } from "@/lib/stores/useFavoriteStore";
import { Destaque } from "@/lib/types/destaque";
import { Heart } from "lucide-react";

type Props = {
  property: Destaque;
};

export default function FavoriteButton({ property }: Props) {
  const { addFavorite, removeFavorite, isFavorite } = useFavoriteStore();

  const isFav = isFavorite(property.id);

  const toggleFavorite = () => {
    if (isFav) {
      removeFavorite(property.id);
    } else {
      addFavorite(property);
    }
  };

  return (
    <button
      className=""
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite();
      }}
      aria-label="Favoritar"
    >
      <Heart
        size={24}
        className={`hover:text-site-primary-hover transition-colors duration-200 ${
          isFav ? "text-site-primary fill-site-primary" : "text-[#303030]"
        }`}
      />
    </button>
  );
}
