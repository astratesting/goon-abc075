"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { Orbit, OrbitSpinner } from "@/components/Orbit";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams?.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isValid = email.includes("@") && password.length > 0;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid) return;
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email or password is incorrect.");
        setLoading(false);
      } else {
        // Validate callbackUrl to prevent open redirects
        const safeUrl = callbackUrl.startsWith("/") ? callbackUrl : "/dashboard";
        router.push(safeUrl);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-softwhite px-4">
      <div className="w-full max-w-[420px]">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Orbit size={40} className="text-sky-brand" />
          </div>
          <span className="font-serif text-2xl font-bold text-gray-900">Goon</span>
        </div>

        <h1 className="font-serif text-2xl font-bold text-gray-900 text-center">Sign in</h1>
        <p className="mt-2 text-sm text-gray-500 text-center">Welcome back to Goon.</p>

        {error && (
          <div className="mt-4 rounded-lg bg-sand-brand/20 border border-sand-brand/40 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand transition-all"
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 pr-12 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand transition-all"
                placeholder="Your password"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={!isValid || loading}
            className="w-full rounded-full bg-sky-brand text-white py-3 text-sm font-semibold hover:shadow-lg hover:shadow-sky-brand/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <OrbitSpinner size={16} className="text-white" />
                Signing in...
              </>
            ) : (
              "Continue"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/signup" className="text-sm text-sky-brand hover:underline">
            Don&apos;t have an account? Sign up
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-gray-400">
          By continuing you agree to our terms.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
