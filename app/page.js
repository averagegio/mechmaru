"use client";

import { useMemo, useState, useRef } from "react";
import { robotServices as servicesData } from "@/lib/services";
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
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const heroRef = useRef(null);

  const handleHeroPointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    const maxTilt = 8; // degrees
    setTilt({ x: py * maxTilt, y: -px * maxTilt });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return servicesData;
    return servicesData.filter((s) => {
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
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
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
          <div className="flex items-center gap-4">
            <Link href="/pricing" className="text-sm font-medium hover:underline">Pricing</Link>
          </div>
        </div>
      </header>

      <section
        aria-label="Mini hero"
        ref={heroRef}
        onMouseMove={handleHeroPointerMove}
        onMouseLeave={resetTilt}
        className="relative mx-auto max-w-6xl px-6 pt-10"
      >
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur">
          <div className="absolute inset-0 pointer-events-none" style={{
            background:
              "radial-gradient(800px 400px at -10% -20%, rgba(255,255,255,0.08), transparent 50%), " +
              "radial-gradient(600px 300px at 110% -10%, rgba(255,255,255,0.07), transparent 50%), " +
              "linear-gradient(180deg, rgba(255,255,255,0.06), rgba(0,0,0,0))",
          }} />

          <div className="relative grid grid-cols-1 md:grid-cols-2 gap-6 items-center p-6 md:p-10" style={{
            transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
            transformStyle: "preserve-3d",
            transition: "transform 180ms ease-out",
          }}>
            <div className="space-y-3" style={{ transform: "translateZ(32px)" }}>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Meet MARU</h2>
              <p className="text-sm md:text-base text-white/70">
                A sleek robotics assistant. Explore services and see MARU in motion.
              </p>
              <div className="flex gap-3 pt-2">
                <Link href="#service-feed" className="rounded-xl bg-white text-black px-4 py-2 text-sm font-medium hover:opacity-90 focus:outline-none focus:ring-2 focus:ring-white/40 transition">
                  Browse services
                </Link>
                <Link href="#" className="rounded-xl border border-white/20 px-4 py-2 text-sm font-medium hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition">
                  Learn more
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4" style={{ transform: "translateZ(24px)" }}>
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-lg transition-transform group hover:-translate-y-1 hover:shadow-2xl">
                <video
                  src="/marureel1.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-40 md:h-56 w-full object-cover"
                  poster="/maru1.jpg"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
              <div className="relative rounded-2xl overflow-hidden ring-1 ring-white/20 shadow-lg translate-y-3 transition-transform group hover:-translate-y-1 hover:shadow-2xl">
                <video
                  src="/marureel2.mp4"
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-40 md:h-56 w-full object-cover"
                  poster="/maru1.jpg"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <main id="service-feed" className="mx-auto max-w-6xl px-6 py-10">
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
              {s.premium ? (
                <div className="mt-3 inline-flex items-center gap-2 text-xs text-yellow-300">
                  <span className="inline-block h-2 w-2 rounded-full bg-yellow-300" />
                  Members only
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
