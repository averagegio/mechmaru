import { getServiceById } from "@/lib/services";
import { kvGetServiceById } from "@/lib/kv";

export async function GET(_request, { params }) {
  const { id } = params || {};
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
  return Response.json(service);
}

