export async function POST(request) {
  try {
    const data = await request.json();
    // Basic validation
    if (!data || !data.serviceId || !data.contact) {
      return new Response(JSON.stringify({ error: "Missing fields" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    // Echo back a mock booking id
    const bookingId = `bk_${Math.random().toString(36).slice(2, 10)}`;
    return Response.json({ ok: true, bookingId, received: data });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

