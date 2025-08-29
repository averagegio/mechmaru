import { confirmEmailVerification } from "@/lib/auth";

export async function POST(request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return new Response(JSON.stringify({ error: "Missing token" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const res = await confirmEmailVerification(token);
    return Response.json({ ok: true, ...res });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Verification failed" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

