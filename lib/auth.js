import "server-only";
import crypto from "crypto";
import { cookies } from "next/headers";
import { getRedis } from "@/lib/kv";

const SESSION_COOKIE = "maru_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days

function toBase64(buf) {
  return Buffer.from(buf).toString("base64url");
}

function fromBase64(str) {
  return Buffer.from(str, "base64url");
}

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16);
  const hash = crypto.scryptSync(password, salt, 64);
  return `${toBase64(salt)}.${toBase64(hash)}`;
}

export async function verifyPassword(password, stored) {
  const [saltB64, hashB64] = String(stored || "").split(".");
  if (!saltB64 || !hashB64) return false;
  const salt = fromBase64(saltB64);
  const expected = fromBase64(hashB64);
  const actual = crypto.scryptSync(password, salt, 64);
  return crypto.timingSafeEqual(expected, actual);
}

export async function createUser({ email, password }) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const key = `user:${email.toLowerCase()}`;
  const exists = await redis.exists(key);
  if (exists) throw new Error("user-exists");
  const passwordHash = await hashPassword(password);
  await redis.hset(key, { email, passwordHash, createdAt: String(Date.now()), verified: "0" });
  return { email };
}

export async function findUser(email) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const key = `user:${email.toLowerCase()}`;
  const data = await redis.hgetall(key);
  if (!data || !data.email) return null;
  return data;
}

export async function startSession(email) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const sid = `sess_${crypto.randomBytes(18).toString("base64url")}`;
  await redis.set(`session:${sid}`, email, { ex: SESSION_TTL_SECONDS });
  const jar = cookies();
  jar.set(SESSION_COOKIE, sid, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
  return sid;
}

export async function getSession() {
  const jar = cookies();
  const sid = jar.get(SESSION_COOKIE)?.value;
  if (!sid) return null;
  const redis = getRedis();
  if (!redis) return null;
  const email = await redis.get(`session:${sid}`);
  if (!email) return null;
  return { sid, email };
}

export async function endSession() {
  const jar = cookies();
  const sid = jar.get(SESSION_COOKIE)?.value;
  if (sid) {
    const redis = getRedis();
    if (redis) await redis.del(`session:${sid}`);
  }
  jar.set(SESSION_COOKIE, "", { path: "/", maxAge: 0 });
}

// Verification & Password Reset

function buildToken(prefix) {
  return `${prefix}_${crypto.randomBytes(20).toString("base64url")}`;
}

export async function requestEmailVerification(email, ttlSeconds = 15 * 60) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const user = await findUser(email);
  if (!user) throw new Error("user-not-found");
  const token = buildToken("verify");
  await redis.set(`verify:${token}`, user.email, { ex: ttlSeconds });
  return token;
}

export async function confirmEmailVerification(token) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const email = await redis.get(`verify:${token}`);
  if (!email) throw new Error("invalid-token");
  const key = `user:${String(email).toLowerCase()}`;
  await redis.hset(key, { verified: "1" });
  await redis.del(`verify:${token}`);
  return { email };
}

export async function requestPasswordReset(email, ttlSeconds = 15 * 60) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const user = await findUser(email);
  if (!user) throw new Error("user-not-found");
  const token = buildToken("reset");
  await redis.set(`reset:${token}`, user.email, { ex: ttlSeconds });
  return token;
}

export async function confirmPasswordReset(token, newPassword) {
  const redis = getRedis();
  if (!redis) throw new Error("redis-unavailable");
  const email = await redis.get(`reset:${token}`);
  if (!email) throw new Error("invalid-token");
  const key = `user:${String(email).toLowerCase()}`;
  const passwordHash = await hashPassword(newPassword);
  await redis.hset(key, { passwordHash });
  await redis.del(`reset:${token}`);
  return { email };
}

