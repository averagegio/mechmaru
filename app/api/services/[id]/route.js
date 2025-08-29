import { getServiceById } from "@/lib/services";
import { kvGetServiceById } from "@/lib/kv";
import { getSession } from "@/lib/auth";
import { getPlanById } from "@/lib/pricing";

export async function GET(_request, { params }) {
  const { id } = params || {};
  const sess = await getSession();
  let planId = "free";
  try {
    const redis = (await import("@/lib/kv")).getRedis();
    const p = redis ? await redis.get(`membership:${sess?.email}`) : null;
    planId = p || "free";
  } catch {}
  const isMember = !!getPlanById(planId) && planId !== "free";
  try {
    const service = await kvGetServiceById(id);
    if (service) return Response.json(service);
  } catch {}
  const service = getServiceById(id);
  if (!service) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }
  if (service.premium && !isMember) {
    return new Response(JSON.stringify({ error: "Requires membership" }), {
      status: 403,
      headers: { "content-type": "application/json" },
    });
  }
  return Response.json(service);
}

