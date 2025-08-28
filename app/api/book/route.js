import { kvAddBooking } from "@/lib/kv";

export async function POST(request) {
  try {
    const data = await request.json();
    if (!data || !data.serviceId || !data.contact) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
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

