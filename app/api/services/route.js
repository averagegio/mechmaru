import { robotServices } from "@/lib/services";
import { kvGetServices, kvSearchServices } from "@/lib/kv";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  try {
    const items = q ? await kvSearchServices(q) : await kvGetServices();
    if (items && items.length) return Response.json({ source: "redis", count: items.length, items });
  } catch {}
  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    const filtered = robotServices.filter((s) => {
      const hay = [s.id, s.title, s.company, s.location, ...(s.tags || [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
    return Response.json({ source: "static", count: filtered.length, items: filtered });
  }
  return Response.json({ source: "static", count: robotServices.length, items: robotServices });
}

