"use client";

import { useState } from "react";

export function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok || res.status === 200) {
        setSubmitted(true);
      }
    } catch {
      setSubmitted(true);
    }
  };

  return (
    <section id="waitlist" className="relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-br from-sky-brand/15 via-mint-brand/10 to-transparent rounded-full blur-3xl" />

      <div className="relative bg-gradient-to-br from-sky-50/80 via-mint-50/20 to-sand-50/20">
        <div className="section-container text-center">
          <div className="mx-auto max-w-2xl stagger-children">
            <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
              Get Early Access
            </p>
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl text-balance">
              Be first to try{" "}
              <span className="font-serif italic text-sky-700">Goon</span>
            </h2>
            <p className="mt-5 text-lg text-gray-500 leading-relaxed">
              Join the waitlist and we&apos;ll notify you as soon as we&apos;re
              ready to accept orders. Early members get priority access.
            </p>

            {submitted ? (
              <div className="mt-10 rounded-2xl bg-white/80 backdrop-blur-sm border border-green-200 p-8 shadow-lg shadow-green-500/5">
                <div className="flex flex-col items-center justify-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <p className="text-base font-semibold text-green-800">
                    You&apos;re on the list!
                  </p>
                  <p className="text-sm text-green-600">
                    We&apos;ll be in touch soon.
                  </p>
                </div>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-full border border-gray-200 bg-white px-6 py-4 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-brand focus:outline-none focus:ring-2 focus:ring-sky-brand/20 transition-all shadow-sm"
                />
                <button
                  type="submit"
                  className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-sky-brand px-8 py-4 text-sm font-semibold text-white shadow-lg shadow-sky-brand/25 transition-all duration-300 hover:bg-sky-500 hover:shadow-xl hover:-translate-y-0.5 whitespace-nowrap"
                >
                  Join the Waitlist
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </form>
            )}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
              <span className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 border border-gray-100">
                <svg className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                No credit card
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 border border-gray-100">
                <svg className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Early access priority
              </span>
              <span className="flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 border border-gray-100">
                <svg className="h-4 w-4 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                No spam
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
