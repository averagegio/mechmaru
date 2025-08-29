import { requestPasswordReset } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email } = await request.json();
    if (!email) {
      return new Response(JSON.stringify({ error: "Missing email" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const token = await requestPasswordReset(email);
    return Response.json({ ok: true, token });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Reset request failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

