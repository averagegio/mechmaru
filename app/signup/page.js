"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Signup failed");
      // Auto-verified in backend; redirect to dashboard after quick login
      const loginRes = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (loginRes.ok) {
        window.location.href = "/dashboard";
        return;
      }
      setMessage("Account created. Please sign in.");
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
          <h1 className="text-2xl font-bold tracking-tight">Sign up</h1>
          <Link href="/" className="text-sm font-medium hover:underline">Home</Link>
        </div>
      </header>

      <main className="mx-auto max-w-md px-6 py-10">
        <div className="mb-6 text-center">
          <h2 className="text-xl font-semibold">Create your account</h2>
          <p className="text-sm text-white/70">It takes less than a minute</p>
        </div>
        <form onSubmit={onSubmit} className="rounded-2xl border border-white/20 bg-white/[0.08] p-6 backdrop-blur space-y-4 shadow-xl">
          <div>
            <label htmlFor="email" className="text-sm">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 w-full rounded-lg border border-white/25 bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-white/30" />
          </div>
          <div>
            <label htmlFor="password" className="text-sm">Password</label>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 w-full rounded-lg border border-white/25 bg-white/10 px-4 py-2 outline-none focus:ring-2 focus:ring-white/30" />
          </div>
          <button disabled={loading} type="submit" className="w-full rounded-xl border border-blue-400/50 bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-500 disabled:opacity-50">
            {loading ? "Creating..." : "Create account"}
          </button>
          {message ? <div className="text-xs text-white/70">{message}</div> : null}
          <div className="text-xs text-white/80">Already have an account? <Link href="/login" className="underline">Sign in</Link></div>
        </form>
      </main>
    </div>
  );
}


