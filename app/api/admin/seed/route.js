import { kvSetServices } from "@/lib/kv";
import { robotServices } from "@/lib/services";

export async function POST(request) {
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

  await kvSetServices(robotServices.map((s) => ({
    ...s,
    tags: Array.isArray(s.tags) ? s.tags : [],
    summary: s.summary || "",
  })));
  return Response.json({ ok: true, seeded: robotServices.length, source: "redis" });
}

