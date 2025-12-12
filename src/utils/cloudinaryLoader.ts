import type { ImageLoader } from "next/image";

export const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const q = quality ?? 75;
  // src = URL do Cloudinary já com /upload/...
  return src.replace("/upload/", `/upload/f_auto,q_${q},w_${width}/`);
};
