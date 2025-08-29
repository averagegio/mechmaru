import { plans } from "@/lib/pricing";

export async function GET() {
  return Response.json({ items: plans });
}

