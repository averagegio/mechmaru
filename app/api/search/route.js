import { searchServices } from "@/lib/services";
import { kvSearchServices } from "@/lib/kv";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  try {
    const items = await kvSearchServices(q);
    if (items && items.length) return Response.json({ source: "redis", query: q, count: items.length, items });
  } catch {}
  const results = searchServices(q);
  return Response.json({ source: "static", query: q, count: results.length, items: results });
}

