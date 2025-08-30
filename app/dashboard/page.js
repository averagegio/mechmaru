"use client";

import useSWR from "swr";
import Link from "next/link";

const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DashboardPage() {
  const { data, error, isLoading } = useSWR("/api/dashboard", fetcher);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <Link href="/" className="text-sm font-medium hover:underline">Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-10">
        {isLoading ? (
          <div className="text-sm text-white/70">Loading...</div>
        ) : error ? (
          <div className="text-sm text-red-300">Failed to load</div>
        ) : data?.error ? (
          <div className="text-sm text-white/80">Please <Link href="/login" className="underline">sign in</Link> to view your dashboard.</div>
        ) : (
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <div className="text-sm text-white/70">Signed in as</div>
              <div className="text-lg font-semibold">{data.email}</div>
              <div className="mt-2 text-sm">Plan: <span className="font-medium">{data.plan}</span></div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6">
              <div className="text-lg font-semibold mb-3">Recent bookings</div>
              {data.bookings?.length ? (
                <ul className="space-y-2 text-sm">
                  {data.bookings.map((b) => (
                    <li key={b.id} className="flex items-center justify-between">
                      <span>{b.id}</span>
                      <span className="text-white/60">{b.serviceId}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-sm text-white/70">No bookings yet.</div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


