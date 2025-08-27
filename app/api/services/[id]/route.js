import { getServiceById } from "@/lib/services";

export async function GET(_request, { params }) {
  const { id } = params || {};
  const service = getServiceById(id);
  if (!service) {
    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "content-type": "application/json" },
    });
  }
  return Response.json(service);
}

