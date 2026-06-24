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
    <section id="waitlist" className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-mint-50/30 to-sand-50/30">
      <div className="section-container text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl text-balance">
            Be first to try{" "}
            <span className="font-serif italic text-sky-700">Goon</span>
          </h2>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Join the waitlist and we&apos;ll notify you as soon as we&apos;re
            ready to accept orders. Early members get priority access.
          </p>

          {submitted ? (
            <div className="mt-8 rounded-2xl bg-white/80 backdrop-blur-sm border border-green-200 p-6">
              <div className="flex items-center justify-center gap-3">
                <svg
                  className="h-6 w-6 text-green-500"
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
                <p className="text-sm font-medium text-green-800">
                  You&apos;re on the list! We&apos;ll be in touch soon.
                </p>
              </div>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-full border border-gray-200 bg-white px-5 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-sky-brand focus:outline-none focus:ring-2 focus:ring-sky-brand/20 transition-all"
              />
              <button type="submit" className="btn-primary whitespace-nowrap">
                Join the Waitlist
              </button>
            </form>
          )}

          <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-sky-500"
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
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-sky-500"
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
              Early access priority
            </span>
            <span className="flex items-center gap-1.5">
              <svg
                className="h-4 w-4 text-sky-500"
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
              No spam
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
