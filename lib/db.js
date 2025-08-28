import "server-only";
import { neon } from "@neondatabase/serverless";

export const sql = neon(process.env.DATABASE_URL || "");

export async function ensureServicesTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS services (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      company TEXT,
      location TEXT,
      tags JSONB DEFAULT '[]'::jsonb,
      href TEXT,
      summary TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function upsertService(service) {
  const { id, title, company, location, tags = [], href, summary } = service;
  await sql`
    INSERT INTO services (id, title, company, location, tags, href, summary)
    VALUES (${id}, ${title}, ${company}, ${location}, ${JSON.stringify(tags)}, ${href}, ${summary})
    ON CONFLICT (id) DO UPDATE SET
      title = EXCLUDED.title,
      company = EXCLUDED.company,
      location = EXCLUDED.location,
      tags = EXCLUDED.tags,
      href = EXCLUDED.href,
      summary = EXCLUDED.summary
  `;
}

export async function queryServices(searchQuery) {
  if (searchQuery && searchQuery.trim()) {
    const q = `%${searchQuery.trim().toLowerCase()}%`;
    const { rows } = await sql`
      SELECT id, title, company, location, tags, href, summary
      FROM services
      WHERE LOWER(title) LIKE ${q}
         OR LOWER(company) LIKE ${q}
         OR LOWER(location) LIKE ${q}
         OR LOWER(summary) LIKE ${q}
         OR CAST(tags AS TEXT) LIKE ${q}
      ORDER BY title ASC
    `;
    return rows.map(materializeServiceRow);
  }
  const { rows } = await sql`
    SELECT id, title, company, location, tags, href, summary
    FROM services
    ORDER BY title ASC
  `;
  return rows.map(materializeServiceRow);
}

export async function getService(id) {
  const { rows } = await sql`
    SELECT id, title, company, location, tags, href, summary
    FROM services
    WHERE id = ${id}
    LIMIT 1
  `;
  return rows.length ? materializeServiceRow(rows[0]) : null;
}

export async function ensureBookingsTable() {
  await sql`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      service_id TEXT NOT NULL,
      contact TEXT NOT NULL,
      payload JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMPTZ DEFAULT NOW()
    )
  `;
}

export async function insertBooking({ id, serviceId, contact, payload = {} }) {
  await sql`
    INSERT INTO bookings (id, service_id, contact, payload)
    VALUES (${id}, ${serviceId}, ${contact}, ${JSON.stringify(payload)})
  `;
}

export async function listBookings(limit = 50) {
  const { rows } = await sql`
    SELECT id, service_id as "serviceId", contact, payload, created_at as "createdAt"
    FROM bookings
    ORDER BY created_at DESC
    LIMIT ${limit}
  `;
  return rows.map((r) => ({
    id: r.id,
    serviceId: r.serviceId,
    contact: r.contact,
    payload: typeof r.payload === "string" ? safeParseJson(r.payload, {}) : r.payload || {},
    createdAt: r.createdAt,
  }));
}

function materializeServiceRow(row) {
  return {
    id: row.id,
    title: row.title,
    company: row.company,
    location: row.location,
    tags: Array.isArray(row.tags) ? row.tags : safeParseJson(row.tags, []),
    href: row.href,
    summary: row.summary,
  };
}

function safeParseJson(value, fallback) {
  try {
    if (value == null) return fallback;
    if (typeof value === "object") return value;
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

