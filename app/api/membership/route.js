import { getSession } from "@/lib/auth";
import { getRedis } from "@/lib/kv";
import { getPlanById } from "@/lib/pricing";

export async function GET() {
  const sess = await getSession();
  if (!sess) return Response.json({ authenticated: false, plan: "free" });
  const redis = getRedis();
  const plan = redis ? await redis.get(`membership:${sess.email}`) : null;
  return Response.json({ authenticated: true, email: sess.email, plan: plan || "free" });
}

export async function POST(request) {
  const sess = await getSession();
  if (!sess) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const redis = getRedis();
  if (!redis) return new Response(JSON.stringify({ error: "Redis unavailable" }), { status: 503 });
  const { plan } = await request.json();
  const p = getPlanById(plan);
  if (!p) return new Response(JSON.stringify({ error: "Invalid plan" }), { status: 400 });
  await redis.set(`membership:${sess.email}`, p.id);
  return Response.json({ ok: true, plan: p.id });
}

