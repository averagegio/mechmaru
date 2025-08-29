import { getPlanById } from "@/lib/pricing";
import { getSession } from "@/lib/auth";
import { getRedis } from "@/lib/kv";

function getOrigin(request) {
  try {
    const url = new URL(request.url);
    return `${url.protocol}//${url.host}`;
  } catch {
    return process.env.NEXT_PUBLIC_SITE_URL || "";
  }
}

export async function POST(request) {
  const sess = await getSession();
  if (!sess) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const { plan } = await request.json();
  const selected = getPlanById(plan);
  if (!selected) {
    return new Response(JSON.stringify({ error: "Invalid plan" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const origin = getOrigin(request) || "";

  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  if (hasStripe && selected.priceMonthly > 0) {
    try {
      const { default: Stripe } = await import("stripe");
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
        apiVersion: "2024-06-20",
      });

      const priceMap = {
        pro: process.env.STRIPE_PRICE_ID_PRO,
        enterprise: process.env.STRIPE_PRICE_ID_ENTERPRISE,
      };
      const priceId = priceMap[selected.id];
      if (!priceId) throw new Error("Missing price for plan");

      const session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [{ price: priceId, quantity: 1 }],
        customer_email: sess.email,
        success_url: `${origin}/pricing?success=1&plan=${selected.id}`,
        cancel_url: `${origin}/pricing?canceled=1`,
        metadata: { plan: selected.id, email: sess.email },
      });
      return Response.json({ checkoutUrl: session.url, provider: "stripe" });
    } catch (e) {
      // Fall through to immediate activation if Stripe fails
    }
  }

  // Fallback: immediate activation via Redis membership
  try {
    const redis = getRedis();
    if (!redis) throw new Error("redis-unavailable");
    await redis.set(`membership:${sess.email}`, selected.id);
    return Response.json({ ok: true, plan: selected.id, activated: true, provider: "direct" });
  } catch {
    return new Response(JSON.stringify({ error: "Activation failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}


