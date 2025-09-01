// lib/cloudinary.ts
import { v2 as _cloudinary } from "cloudinary";

let cloudinaryInstance: typeof _cloudinary | null = null;

export function getCloudinary() {
  if (!cloudinaryInstance) {
    _cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
      api_key: process.env.CLOUDINARY_API_KEY!,
      api_secret: process.env.CLOUDINARY_API_SECRET!,
    });

    cloudinaryInstance = _cloudinary;
  }

  return cloudinaryInstance;
}