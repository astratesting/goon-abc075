"use client";

import { useState } from "react";
import Link from "next/link";

export function CTA() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubmitted(true);
    }
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-sky-50 via-mint-50/30 to-sand-50/30">
      <div className="section-container text-center">
        <div className="mx-auto max-w-2xl">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl text-balance">
            Ready to get your ideas{" "}
            <span className="font-serif italic text-sky-700">into the world</span>{" "}
            faster?
          </h2>
          <p className="mt-4 text-gray-500 leading-relaxed">
            Join the waitlist for early access and priority pricing. We&apos;ll
            let you know when we&apos;re ready to print your first part.
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
                Join waitlist
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
              Free to explore
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
              Cancel anytime
            </span>
          </div>

          <p className="mt-6 text-xs text-gray-400">
            Or{" "}
            <Link href="/login?demo=1" className="text-sky-600 hover:underline">
              try the live demo
            </Link>{" "}
            to explore the dashboard with sample data right now.
          </p>
        </div>
      </div>
    </section>
  );
}
