import { robotServices } from "@/lib/services";
import { kvGetServices, kvSearchServices } from "@/lib/kv";
import { getSession } from "@/lib/auth";
import { getPlanById } from "@/lib/pricing";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  const sess = await getSession();
  let planId = "free";
  try {
    const redis = (await import("@/lib/kv")).getRedis();
    const p = redis ? await redis.get(`membership:${sess?.email}`) : null;
    planId = p || "free";
  } catch {}
  const isMember = !!getPlanById(planId) && planId !== "free";
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
      const match = hay.includes(query);
      return match && (isMember || !s.premium);
    });
    return Response.json({ source: "static", count: filtered.length, items: filtered });
  }
  const items = isMember ? robotServices : robotServices.filter((s) => !s.premium);
  return Response.json({ source: "static", count: items.length, items });
}

