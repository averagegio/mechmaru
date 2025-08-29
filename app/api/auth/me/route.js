import { getSession, findUser } from "@/lib/auth";

export async function GET() {
  const sess = await getSession();
  if (!sess) return Response.json({ authenticated: false });
  const user = await findUser(sess.email);
  return Response.json({ authenticated: true, email: user?.email || sess.email });
}

