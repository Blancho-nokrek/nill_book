"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import {
  parsePhoneNumberFromString,
  type CountryCode,
} from "libphonenumber-js";
import { authClient } from "@/lib/auth-client";

const COUNTRIES = [
  { code: "BD", label: "Bangladesh (+880)" },
  { code: "IN", label: "India (+91)" },
  { code: "PK", label: "Pakistan (+92)" },
  { code: "NP", label: "Nepal (+977)" },
  { code: "LK", label: "Sri Lanka (+94)" },
  { code: "AE", label: "UAE (+971)" },
  { code: "SA", label: "Saudi Arabia (+966)" },
  { code: "MY", label: "Malaysia (+60)" },
  { code: "SG", label: "Singapore (+65)" },
  { code: "GB", label: "United Kingdom (+44)" },
  { code: "US", label: "United States (+1)" },
];

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("BD");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("");
  const [birthday, setBirthday] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const parsedPhone = parsePhoneNumberFromString(
      phone.trim(),
      country as CountryCode
    );
    if (!parsedPhone || !parsedPhone.isValid()) {
      setError("Please enter a valid phone number for the selected country.");
      return;
    }
    if (!gender) {
      setError("Please select your gender.");
      return;
    }
    if (!birthday || birthday > today) {
      setError("Please enter a valid date of birth.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: name.trim(),
        email,
        phone: parsedPhone.number,
        gender,
        birthday,
        password,
      });

      if (error) {
        setError(error.message ?? "Could not create the account.");
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

  const inputClass =
    "w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3.5 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20";
  const labelClass = "mb-2 block text-sm font-medium text-slate-300";

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
                  Create your
                  <br />
                  account.
                </h1>

                <p className="mt-6 max-w-md text-lg leading-8 text-slate-400">
                  Join NILLBOOK to manage your contacts and identify who is
                  calling.
                </p>
              </div>
            </div>

            <p className="text-sm text-slate-500">
              Your contacts. Your identity. Connected.
            </p>
          </div>

          {/* Register form */}
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

              <h2 className="text-3xl font-bold">Create account</h2>

              <p className="mt-2 text-slate-400">
                Fill in your details to get started.
              </p>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    required
                    autoComplete="name"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    autoComplete="email"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="phone" className={labelClass}>
                    Phone number
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      className="w-44 shrink-0 rounded-xl border border-slate-700 bg-slate-950 px-3 py-3.5 text-white outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20"
                    >
                      {COUNTRIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                    <input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="01700000000"
                      required
                      autoComplete="tel-national"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="gender" className={labelClass}>
                      Gender
                    </label>
                    <select
                      id="gender"
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      required
                      className={inputClass}
                    >
                      <option value="" disabled>
                        Select gender
                      </option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="birthday" className={labelClass}>
                      Date of birth
                    </label>
                    <input
                      id="birthday"
                      type="date"
                      value={birthday}
                      onChange={(e) => setBirthday(e.target.value)}
                      max={today}
                      required
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className={labelClass}>
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    required
                    autoComplete="new-password"
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className={labelClass}>
                    Confirm password
                  </label>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter your password"
                    required
                    autoComplete="new-password"
                    className={inputClass}
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
                  {loading ? "Creating account..." : "Create Account"}
                </button>
              </form>

              <p className="mt-8 text-center text-sm text-slate-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-semibold text-cyan-400 hover:text-cyan-300"
                >
                  Sign in
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
