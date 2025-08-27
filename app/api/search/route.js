import { searchServices } from "@/lib/services";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";
  const results = searchServices(q);
  return Response.json({ query: q, count: results.length, items: results });
}

