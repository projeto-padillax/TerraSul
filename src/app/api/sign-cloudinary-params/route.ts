import { getCloudinary } from "@/lib/cloudinary/client";

export async function POST(request: Request) {
  const body = await request.json();
  const { paramsToSign } = body;

   if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY) {
    throw new Error("Cloudinary API key/secret not set");
  }

  const signature = getCloudinary().utils.api_sign_request(paramsToSign, process.env.CLOUDINARY_API_SECRET);
  
    return new Response(JSON.stringify({ signature }), {
    headers: { "Content-Type": "application/json" },
  });
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}