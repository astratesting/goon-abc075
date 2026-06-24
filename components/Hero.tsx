"use client";

import { OrbitMotif } from "./OrbitMotif";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      <OrbitMotif className="absolute inset-0 opacity-30" />
      <div className="relative section-container py-20 md:py-28 lg:py-32">
        <div className="max-w-3xl mx-auto text-center">
          {/* Coming Soon badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-brand/10 to-mint-brand/10 border border-sky-brand/20 px-5 py-2 text-sm font-medium text-sky-700 mb-8">
            <span className="h-2 w-2 rounded-full bg-sky-brand animate-pulse" />
            Coming Soon
          </div>

          {/* Brand name */}
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6">
            Goon
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl font-medium text-gray-700 text-balance">
            On-demand custom 3D printing,{" "}
            <span className="font-serif italic text-sky-700">delivered same day</span>
          </p>

          {/* Value prop */}
          <p className="mt-6 text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Upload any CAD file and get a high-quality custom part printed and
            shipped to your door. No minimums, no lead times, no headaches.
          </p>

          {/* CTA to waitlist */}
          <div className="mt-10">
            <a
              href="#waitlist"
              className="btn-primary text-base px-8 py-3"
            >
              Join the Waitlist
            </a>
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
              AI File Repair
            </span>
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-mint-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Same-Day Shipping
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
