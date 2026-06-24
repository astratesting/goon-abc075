"use client";

import { OrbitMotif } from "./OrbitMotif";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-white">
      {/* Background decoration */}
      <OrbitMotif className="absolute inset-0 opacity-30" />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-br from-sky-brand/10 via-mint-brand/5 to-transparent rounded-full blur-3xl" />

      <div className="relative section-container py-20 md:py-28 lg:py-36">
        <div className="max-w-4xl mx-auto text-center stagger-children">
          {/* Coming Soon badge */}
          <div className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-sky-brand/10 to-mint-brand/10 border border-sky-brand/20 px-5 py-2 text-sm font-medium text-sky-700 mb-8 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-brand opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-brand" />
            </span>
            Coming Soon
          </div>

          {/* Brand name */}
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 tracking-tight">
            Goon
          </h1>

          {/* Tagline */}
          <p className="text-xl md:text-2xl lg:text-3xl font-medium text-gray-700 text-balance leading-snug">
            On-demand custom 3D printing,{" "}
            <span className="font-serif italic text-sky-700">delivered same day</span>
          </p>

          {/* Value prop */}
          <p className="mt-6 text-base md:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Upload any CAD file and get a high-quality custom part printed and
            shipped to your door. No minimums, no lead times, no headaches.
          </p>

          {/* CTA to waitlist */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="#waitlist"
              className="group relative inline-flex items-center gap-2 rounded-full bg-sky-brand px-8 py-4 text-base font-semibold text-white shadow-xl shadow-sky-brand/25 transition-all duration-300 hover:bg-sky-500 hover:shadow-2xl hover:shadow-sky-brand/30 hover:-translate-y-0.5"
            >
              Join the Waitlist
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#features"
              className="inline-flex items-center gap-2 rounded-full border-2 border-gray-200 px-8 py-4 text-base font-semibold text-gray-600 transition-all duration-300 hover:border-sky-300 hover:text-sky-700 hover:-translate-y-0.5"
            >
              Learn More
            </a>
          </div>

          {/* Trust signal badges */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6 text-sm text-gray-500">
            <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 border border-gray-100 shadow-sm">
              <svg className="h-4 w-4 text-mint-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              No Minimums
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 border border-gray-100 shadow-sm">
              <svg className="h-4 w-4 text-mint-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              AI File Repair
            </span>
            <span className="flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 border border-gray-100 shadow-sm">
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
