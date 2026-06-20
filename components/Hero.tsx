"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { OrbitMotif } from "./OrbitMotif";

export function Hero() {
  const { data: session } = useSession();

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/80 via-softwhite to-softwhite">
      <OrbitMotif />
      <div className="section-container relative z-10">
        <div className="mx-auto max-w-3xl text-center">
          <div className="animate-fade-in">
            <span className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-white/60 px-4 py-1.5 text-xs font-medium text-sky-700 backdrop-blur-sm mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-green-400 animate-pulse" />
              Now accepting early orders
            </span>
          </div>

          <h1 className="animate-fade-in-up text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl text-balance leading-tight">
            Upload a CAD file.{" "}
            <span className="gradient-text">
              Get a printed part today.
            </span>
          </h1>

          <p className="mt-6 text-lg text-gray-600 leading-relaxed max-w-2xl mx-auto animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            Goon uses AI to auto-repair your 3D files and routes them to a local
            printer near you — no minimum orders, no week-long waits. Parts ship
            same day, starting at $15.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            {session ? (
              <Link href="/dashboard" className="btn-primary text-base px-10 py-4">
                Go to dashboard
              </Link>
            ) : (
              <>
                <Link href="/login?demo=1" className="btn-primary text-base px-10 py-4">
                  Try the live demo
                </Link>
                <Link href="/register" className="btn-secondary text-base px-10 py-4">
                  Create an account
                </Link>
              </>
            )}
          </div>

          <p className="mt-5 text-xs text-gray-400 animate-fade-in" style={{ animationDelay: "0.45s" }}>
            No credit card required. Demo account pre-loaded with sample orders.
          </p>
        </div>

        {/* Decorative orbit illustration */}
        <div className="relative mx-auto mt-16 max-w-2xl animate-fade-in" style={{ animationDelay: "0.5s" }}>
          <div className="rounded-2xl border border-sky-100 bg-white/70 backdrop-blur-sm p-6 shadow-xl shadow-sky-100/30">
            <div className="flex items-center gap-4 mb-4">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-brand to-mint-brand flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">enclosure_v3.step</p>
                <p className="text-xs text-gray-500">2.4 MB · Uploaded just now</p>
              </div>
              <div className="ml-auto flex items-center gap-2">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-medium text-purple-700">AI Repair</span>
                <span className="text-gray-300">→</span>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">Printing</span>
                <span className="text-gray-300">→</span>
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">Shipped</span>
              </div>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
              <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-sky-brand to-mint-brand transition-all duration-1000" />
            </div>
            <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              <span>Auto-repairing 3 mesh errors…</span>
              <span>Est. delivery: Today</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
