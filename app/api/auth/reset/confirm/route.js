import { confirmPasswordReset } from "@/lib/auth";

export async function POST(request) {
  try {
    const { token, newPassword } = await request.json();
    if (!token || !newPassword) {
      return new Response(JSON.stringify({ error: "Missing token or password" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const res = await confirmPasswordReset(token, newPassword);
    return Response.json({ ok: true, ...res });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Reset failed" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }
}

