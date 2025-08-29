import { kvAddBooking } from "@/lib/kv";
import { getServiceById } from "@/lib/services";
import { getSession } from "@/lib/auth";
import { getPlanById } from "@/lib/pricing";

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data || !data.serviceId || !data.contact) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const service = getServiceById(data.serviceId);
    if (!service) {
      return new Response(JSON.stringify({ error: "Unknown service" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      });
    }
    if (service.premium) {
      const sess = await getSession();
      if (!sess) {
        return new Response(JSON.stringify({ error: "Auth required for premium" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }
      let planId = "free";
      try {
        const redis = (await import("@/lib/kv")).getRedis();
        const p = redis ? await redis.get(`membership:${sess.email}`) : null;
        planId = p || "free";
      } catch {}
      const isMember = !!getPlanById(planId) && planId !== "free";
      if (!isMember) {
        return new Response(JSON.stringify({ error: "Membership required" }), {
          status: 403,
          headers: { "content-type": "application/json" },
        });
      }
    }

    const bookingId = `bk_${Math.random().toString(36).slice(2, 10)}`;
    try {
      await kvAddBooking({ id: bookingId, serviceId: data.serviceId, contact: data.contact, payload: data });
      return Response.json({ ok: true, bookingId, persisted: true, source: "redis" });
    } catch {
      return Response.json({ ok: true, bookingId, persisted: false, source: "static" });
    }
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

