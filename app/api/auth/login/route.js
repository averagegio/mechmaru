import { findUser, verifyPassword, startSession } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Missing email or password" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }
    const user = await findUser(email);
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
    const valid = await verifyPassword(password, user.passwordHash);
    if (!valid) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }
    if (String(user.verified) !== "1") {
      return new Response(JSON.stringify({ error: "Email not verified" }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }
    await startSession(user.email);
    return Response.json({ ok: true, email: user.email });
  } catch (e) {
    return new Response(JSON.stringify({ error: "Login failed" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

