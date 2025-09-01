import { getCloudinary } from "../cloudinary/client";

export async function deleteCloudinaryImage(publicId: string) {
  try {
    const result = await getCloudinary().uploader.destroy(publicId);
    if (result.result !== "ok") {
      throw new Error(`Cloudinary deletion failed: ${result.result}`);
    }
  } catch (error) {
    console.error(`Failed to delete Cloudinary image: ${publicId}`, error);
    throw error;
  }
}