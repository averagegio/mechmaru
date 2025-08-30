import { getSession } from "@/lib/auth";
import { getRedis, kvListBookings } from "@/lib/kv";

export async function GET() {
  const sess = await getSession();
  if (!sess) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  const redis = getRedis();
  const plan = redis ? await redis.get(`membership:${sess.email}`) : "free";
  const bookings = redis ? await kvListBookings(10) : [];
  return Response.json({ email: sess.email, plan: plan || "free", bookings });
}


