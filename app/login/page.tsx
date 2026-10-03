"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      const { error } = await authClient.signIn.email({ email, password });

      if (error) {
        setError(error.message ?? "Invalid email or password.");
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-6 py-12">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-800 bg-slate-900/80 shadow-2xl lg:grid-cols-2">
          {/* Left side */}
          <div className="hidden bg-gradient-to-br from-cyan-950 via-slate-900 to-slate-950 p-12 lg:flex lg:flex-col lg:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="NILLBOOK"
                  className="h-12 w-12 object-contain brightness-0 invert"
                />
                <span className="text-2xl font-bold text-cyan-400">
                  NILLBOOK
                </span>
              </div>

              <div className="mt-20">
                <p className="text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">
                  Smart Contact & Caller Network
                </p>

                <h1 className="mt-5 text-5xl font-bold leading-tight">
                  Welcome
                  <br />
                  back.
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
                  Sign in to manage your profile, contacts and connected
                  caller network.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Your contacts. Your identity. Connected.
            </p>
          </div>

          {/* Login form */}
          <div className="p-7 sm:p-10 lg:p-12">
            <div className="mx-auto max-w-md">
              <div className="mb-8 lg:hidden">
                <Link href="/" className="flex items-center gap-3">
                  <img
                    src="/logo.png"
                    alt="NILLBOOK"
                    className="h-11 w-11 object-contain brightness-0 invert"
                  />
                  <span className="text-2xl font-bold text-cyan-400">
                    NILLBOOK
                  </span>
                </Link>
              </div>

              <h2 className="text-3xl font-bold">Sign in</h2>

              <p className="mt-2 text-slate-400">
                Enter your account details to continue.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="username"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="text-sm font-medium text-slate-300"
                    >
                      Password
                    </label>

                    <span className="text-xs text-slate-600">
                      Keep it secure
                    </span>
                  </div>

                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    autoComplete="current-password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                  />
                </div>

                {error && (
                  <div className="rounded-xl border border-red-900/60 bg-red-950/40 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full rounded-xl bg-cyan-400 px-5 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <div className="my-8 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-800" />
                <span className="text-xs uppercase tracking-wider text-slate-600">
                  or
                </span>
                <div className="h-px flex-1 bg-slate-800" />
              </div>

              <p className="text-center text-sm text-slate-400">
                New to NILLBOOK?{" "}
                <Link
                  href="/register"
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Create an account
                </Link>
              </p>

              <Link
                href="/"
                className="mt-5 block text-center text-sm text-slate-500 hover:text-slate-300"
              >
                ← Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
