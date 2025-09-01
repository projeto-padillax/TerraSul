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
      className="z-50"
      onClick={(e) => {
        e.preventDefault();
        toggleFavorite();
      }}
      aria-label="Favoritar"
    >
      <Heart
        size={24}
        className={`hover:text-[#4F7DC3] transition-colors duration-200 ${
          isFav ? "text-[#4F7DC3] fill-[#4F7DC3]" : "text-[#303030]"
        }`}
      />
    </button>
  );
}
