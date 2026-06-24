"use client";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { OrbitMotif } from "./OrbitMotif";

export function Hero() {
  const { data: session } = useSession();
  const router = useRouter();
  const [demoLoading, setDemoLoading] = useState(false);

  async function handleDemo() {
    setDemoLoading(true);
    const result = await signIn("credentials", {
      email: "demo@goon.app",
      password: "demo123",
      redirect: false,
    });
    if (!result?.error) {
      router.push("/dashboard");
      router.refresh();
    } else {
      setDemoLoading(false);
    }
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      <OrbitMotif className="absolute inset-0 opacity-30" />
      <div className="relative section-container py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-sky-brand/10 px-4 py-1.5 text-sm text-sky-700 mb-6">
            <span className="h-2 w-2 rounded-full bg-sky-brand animate-pulse" />
            Now accepting early access
          </div>

          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            3D parts with{" "}
            <span className="gradient-text">AI file repair</span>,{" "}
            <span className="gradient-text">shipped same day</span>
          </h1>

          <p className="mt-6 text-lg md:text-xl text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Upload any CAD file — even broken meshes. Our AI auto-repairs, optimizes, and prints your part. No minimums, no sales calls.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            {session ? (
              <button
                onClick={() => router.push("/dashboard")}
                className="btn-primary text-base px-8 py-3"
              >
                Go to dashboard
              </button>
            ) : (
              <>
                <a
                  href="#waitlist"
                  className="btn-primary text-base px-8 py-3"
                >
                  Get Early Access
                </a>
                <button
                  onClick={handleDemo}
                  disabled={demoLoading}
                  className="btn-secondary text-base px-8 py-3 disabled:opacity-50"
                >
                  {demoLoading ? "Loading..." : "Try live demo"}
                </button>
              </>
            )}
          </div>

          {/* Trust signal badges */}
          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-mint-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No Minimums
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-mint-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              AI Quality Check
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-mint-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Same-Day Shipping
            </span>
          </div>

          {/* Decorative mockup */}
          <div className="mt-16 relative max-w-md mx-auto">
            <div className="rounded-2xl bg-white/80 backdrop-blur-sm border border-sky-100 shadow-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-lg bg-sky-50 flex items-center justify-center">
                  <svg className="h-5 w-5 text-sky-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">bracket-v3.stl</p>
                  <p className="text-xs text-gray-400">2.4 MB</p>
                </div>
                <span className="text-xs px-2 py-0.5 rounded-full bg-mint-brand/20 text-emerald-700">Ready</span>
              </div>
              <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-sky-brand to-mint-brand" />
              </div>
              <p className="mt-3 text-xs text-gray-400 text-center">Upload complete &mdash; ready for quoting</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
