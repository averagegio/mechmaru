"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

const robotServices = [
  {
    id: "svc-1",
    title: "Warehouse Picking Assistant",
    company: "Maru Robotics",
    location: "Remote · Global",
    tags: ["logistics", "picking", "autonomy"],
    href: "https://example.com/services/warehouse-picking",
  },
  {
    id: "svc-2",
    title: "Residential Delivery Bot Operator",
    company: "ParcelPilot",
    location: "Austin, TX",
    tags: ["delivery", "teleop", "last‑mile"],
    href: "https://example.com/services/delivery-operator",
  },
  {
    id: "svc-3",
    title: "Hospital Courier Robot Fleet",
    company: "CarePath",
    location: "Boston, MA",
    tags: ["healthcare", "fleet", "mapping"],
    href: "https://example.com/services/hospital-courier",
  },
  {
    id: "svc-4",
    title: "Autonomous Lawn Care",
    company: "GreenByte",
    location: "Orlando, FL",
    tags: ["outdoor", "navigation", "maintenance"],
    href: "https://example.com/services/lawn-care",
  },
  {
    id: "svc-5",
    title: "Security Patrol Rover",
    company: "Aegis Robotics",
    location: "Remote · Night Shift",
    tags: ["security", "vision", "alerts"],
    href: "https://example.com/services/security-patrol",
  },
  {
    id: "svc-6",
    title: "Retail Shelf Scanning",
    company: "ShelfSense",
    location: "Chicago, IL",
    tags: ["retail", "inventory", "scanner"],
    href: "https://example.com/services/retail-scanner",
  },
];

export default function Home() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return robotServices;
    return robotServices.filter((s) => {
      const hay = [
        s.title,
        s.company,
        s.location,
        ...(s.tags || []),
      ]
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [query]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center gap-4">
          <div className="relative h-16 w-16 shrink-0 rounded-lg overflow-hidden ring-1 ring-black/10 dark:ring-white/10">
            <Image
              src="/maru1.jpg"
              alt="Maru the robot assistant"
              fill
              sizes="(max-width: 768px) 64px, 64px"
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight">MARU – The Robot Assistant</h1>
            <p className="text-sm text-black/60 dark:text-white/60">Find and book robot-powered services.</p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <label htmlFor="service-search" className="sr-only">Search services</label>
          <div className="relative">
            <input
              id="service-search"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by service, tag, company, or location..."
              className="w-full rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/5 px-5 py-4 pr-12 text-base shadow-sm outline-none ring-0 focus:border-transparent focus:shadow-md transition"
            />
            <span className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-black/40 dark:text-white/40">⌕</span>
          </div>
        </div>

        <section aria-label="Service feed" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((s) => (
            <Link
              key={s.id}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group rounded-2xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-black/20 dark:focus:ring-white/20"
            >
              <div className="flex items-start justify-between gap-3">
                <h3 className="text-lg font-semibold leading-tight group-hover:text-blue-600">{s.title}</h3>
                <span className="text-xs rounded-full bg-black/5 dark:bg-white/10 px-2 py-1">{s.location}</span>
              </div>
              <p className="mt-1 text-sm text-black/60 dark:text-white/60">{s.company}</p>
              {s.tags?.length ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {s.tags.map((t) => (
                    <span key={t} className="text-xs rounded-full bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-300 px-2.5 py-1 border border-blue-200/60 dark:border-blue-400/20">
                      {t}
                    </span>
                  ))}
                </div>
              ) : null}
              <div className="mt-4 text-sm font-medium text-blue-600 group-hover:underline">View details →</div>
            </Link>
          ))}
        </section>

        {filtered.length === 0 && (
          <p className="mt-8 text-center text-sm text-black/60 dark:text-white/60">No services match your search.</p>
        )}
      </main>

      <footer className="mx-auto max-w-6xl px-6 pb-10 text-sm text-black/60 dark:text-white/60">
        © {new Date().getFullYear()} Maru. All robot services are illustrative.
      </footer>
    </div>
  );
}
