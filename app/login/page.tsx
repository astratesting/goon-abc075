"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isDemo = searchParams.get("demo") === "1";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isDemo) {
      setEmail("demo@demo.app");
      setPassword("demo123");
      // Auto-submit demo login
      const timer = setTimeout(() => {
        handleDemoLogin();
      }, 300);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDemo]);

  async function handleDemoLogin() {
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email: "demo@demo.app",
      password: "demo123",
      redirect: false,
    });
    if (result?.error) {
      setError("Demo login failed. Please try again.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("Invalid email or password.");
      setLoading(false);
    } else {
      router.push("/dashboard");
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand opacity-80" />
              <div className="absolute inset-1.5 rounded-full bg-white" />
              <div className="absolute inset-3 rounded-full bg-gradient-to-br from-sky-brand to-mint-brand" />
            </div>
            <span className="font-serif text-xl font-bold text-gray-900">
              Goon
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">
            Sign in to your account to manage your orders.
          </p>
        </div>

        {isDemo && (
          <div className="mb-6 rounded-xl bg-sky-50 border border-sky-200 p-4 text-center">
            <p className="text-sm text-sky-800 font-medium">
              Signing in to demo account…
            </p>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4">
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-brand focus:outline-none focus:ring-2 focus:ring-sky-brand/20 transition-all"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-brand focus:outline-none focus:ring-2 focus:ring-sky-brand/20 transition-all"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-sky-600 font-medium hover:underline"
          >
            Create one
          </Link>
        </p>

        <div className="mt-4 text-center">
          <Link
            href="/login?demo=1"
            className="text-xs text-gray-400 hover:text-sky-600 transition-colors"
          >
            Or try the demo account →
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] flex items-center justify-center"><p className="text-gray-400">Loading…</p></div>}>
      <LoginForm />
    </Suspense>
  );
}
