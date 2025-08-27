import { robotServices } from "@/lib/services";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (q && q.trim()) {
    const query = q.trim().toLowerCase();
    const filtered = robotServices.filter((s) => {
      const hay = [s.id, s.title, s.company, s.location, ...(s.tags || [])]
        .join(" ")
        .toLowerCase();
      return hay.includes(query);
    });
    return Response.json({ count: filtered.length, items: filtered });
  }
  return Response.json({ count: robotServices.length, items: robotServices });
}

