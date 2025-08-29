"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Login failed");
      setMessage("Logged in. You can close this tab or go back home.");
    } catch (err) {
      setMessage(String(err.message || err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="w-full border-b border-black/10 dark:border-white/10 bg-white/60 dark:bg-black/20 backdrop-blur">
        <div className="mx-auto max-w-6xl px-6 py-8 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Login</h1>
          <Link href="/" className="text-sm font-medium hover:underline">Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-10">
        <form onSubmit={onSubmit} className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 backdrop-blur space-y-4">
          <div>
            <label htmlFor="email" className="text-sm">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-white/15 bg-white/10 px-4 py-2 outline-none" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-lg border border-white/15 bg-white/10 px-4 py-2 outline-none" />
          </div>
          <button disabled={loading} type="submit" className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-2 text-sm hover:bg-white/15 disabled:opacity-50">
            {loading ? "Logging in..." : "Login"}
          </button>
          {message ? <div className="text-xs text-white/70">{message}</div> : null}
          <div className="text-xs text-white/60">Need an account? Use the register API to create one, then verify via the verification endpoints.</div>
        </form>
      </main>
    </div>
  );
}


