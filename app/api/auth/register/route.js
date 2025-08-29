import { createUser } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing email or password" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    await createUser({ email, password });
    return Response.json({ ok: true });
  } catch (e) {
    if (String(e?.message) === "user-exists") {
      return new Response(JSON.stringify({ error: "User already exists" }), {
        status: 409,
        headers: { "content-type": "application/json" },
      });
    }
    return new Response(JSON.stringify({ error: "Registration failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

