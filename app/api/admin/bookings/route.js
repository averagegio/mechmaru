import { kvListBookings } from "@/lib/kv";

export async function GET(request) {
  const authHeader = request.headers.get("authorization") || "";
  const tokenParam = new URL(request.url).searchParams.get("token");
  const bearer = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  const token = bearer || tokenParam || "";
  if (!process.env.SEED_TOKEN || token !== process.env.SEED_TOKEN) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }
  const items = await kvListBookings(100);
  return Response.json({ count: items.length, items });
}

