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
  const body = await request.json();
  const { plan, email: bodyEmail } = body || {};
  const selected = getPlanById(plan);
  if (!selected) {
    return new Response(JSON.stringify({ error: "Invalid plan" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  const origin = getOrigin(request) || "";

  const hasStripe = !!process.env.STRIPE_SECRET_KEY;
  const isPaid = selected.priceMonthly > 0;
  if (hasStripe && isPaid) {
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
        customer_email: bodyEmail || sess?.email || undefined,
        success_url: `${origin}/pricing?success=1&plan=${selected.id}`,
        cancel_url: `${origin}/pricing?canceled=1`,
        metadata: { plan: selected.id, email: bodyEmail || sess?.email || "" },
      });
      return Response.json({ checkoutUrl: session.url, provider: "stripe" });
    } catch (e) {
      return new Response(JSON.stringify({ error: "Stripe checkout unavailable. Check configuration." }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
  }

  // Free plan activation requires login
  if (!isPaid) {
    try {
      const redis = getRedis();
      if (!redis) throw new Error("redis-unavailable");
      if (!sess?.email) return new Response(JSON.stringify({ error: "Login required" }), { status: 401 });
      await redis.set(`membership:${sess.email}`, selected.id);
      return Response.json({ ok: true, plan: selected.id, activated: true, provider: "direct" });
    } catch {
      return new Response(JSON.stringify({ error: "Activation failed" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
  }

  // Paid plan but Stripe not configured
  return new Response(JSON.stringify({ error: "Stripe not configured" }), {
    status: 400,
    headers: { "content-type": "application/json" },
  });
}


