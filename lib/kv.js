import "server-only";
import { Redis } from "@upstash/redis";

export function getRedis() {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  return new Redis({ url, token });
}

// Services helpers
export async function kvSetServices(services) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  await redis.set("services", JSON.stringify(services));
}

export async function kvGetServices() {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const raw = await redis.get("services");
  if (!raw) return [];
  return typeof raw === "string" ? JSON.parse(raw) : raw;
}

export async function kvGetServiceById(id) {
  const items = await kvGetServices();
  return items.find((s) => s.id === id) || null;
}

export async function kvSearchServices(query) {
  const q = (query || "").trim().toLowerCase();
  const items = await kvGetServices();
  if (!q) return items;
  return items.filter((s) => {
    const hay = [s.id, s.title, s.company, s.location, ...(s.tags || []), s.summary || ""]
      .join(" ")
      .toLowerCase();
    return hay.includes(q);
  });
}

// Bookings helpers
export async function kvAddBooking(booking) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const payload = JSON.stringify(booking);
  await redis.lpush("bookings", payload);
  await redis.ltrim("bookings", 0, 999); // keep last 1000
}

export async function kvListBookings(limit = 50) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const items = await redis.lrange("bookings", 0, Math.max(0, limit - 1));
  return items.map((s) => {
    try {
      return JSON.parse(s);
    } catch {
      return null;
    }
  }).filter(Boolean);
}

export async function kvPing() {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const pong = await redis.ping();
  return pong === "PONG";
}


