import { kvPing } from "@/lib/kv";

export async function GET() {
  try {
    const ok = await kvPing();
    return Response.json({ status: "ok", redis: ok, timestamp: Date.now() });
  } catch {
    return Response.json({ status: "ok", redis: false, timestamp: Date.now() });
  }
}

