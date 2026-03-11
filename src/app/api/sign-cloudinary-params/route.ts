import { getCloudinary } from "@/lib/cloudinary/client";
import { getSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session || !["ADMIN", "SUPERADMIN"].includes(session.role)) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const body = await request.json();
  const { paramsToSign } = body;

  if (!process.env.CLOUDINARY_API_SECRET || !process.env.CLOUDINARY_API_KEY) {
    return new Response(JSON.stringify({ error: "Cloudinary not configured" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

  const signature = getCloudinary().utils.api_sign_request(
    paramsToSign,
    process.env.CLOUDINARY_API_SECRET,
  );

  return new Response(JSON.stringify({ signature }), {
    headers: { "Content-Type": "application/json" },
  });
}

export function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}
