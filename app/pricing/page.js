"use client";

import Link from "next/link";
import { plans } from "@/lib/pricing";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm font-medium hover:underline">← Back</Link>
            <h1 className="text-2xl font-bold tracking-tight">Pricing</h1>
          </div>
          <Link href="/" className="text-sm font-medium hover:underline">Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <p className="text-sm text-white/70 mb-6">Choose a plan that fits your workflow. Upgrade anytime.</p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`group rounded-2xl border ${p.recommended ? "border-blue-400/40" : "border-white/10"} bg-white/[0.06] p-6 shadow-sm transition transform hover:-translate-y-1 hover:shadow-xl`}
            >
              <div className="flex items-baseline justify-between">
                <h2 className="text-lg font-bold">{p.name}</h2>
                {p.recommended ? (
                  <span className="text-xs rounded-full bg-blue-500/20 text-blue-300 px-2 py-0.5">Recommended</span>
                ) : null}
              </div>
              <div className="mt-2 text-3xl font-extrabold tracking-tight">
                {p.priceMonthly === 0 ? "Free" : `$${p.priceMonthly}`}<span className="text-sm font-medium text-white/60">/mo</span>
              </div>
              <ul className="mt-4 space-y-2 text-sm text-white/80">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-2"><span>✓</span><span>{f}</span></li>
                ))}
              </ul>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <button className="rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 transition">Choose</button>
                <Link href="/" className="rounded-xl border border-blue-400/40 bg-blue-500/20 px-4 py-2 text-sm text-blue-100 hover:bg-blue-500/25 text-center transition">Start Free</Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}


