"use client";

import { useState } from "react";

const faqs = [
  {
    q: "When will Goon be available?",
    a: "We're finalizing our printer network and quality systems now. Sign up for the waitlist and we'll let you know as soon as we're ready to accept orders.",
  },
  {
    q: "What file formats do you accept?",
    a: "We accept STEP, STL, 3MF, OBJ, and IGES files. Our AI can repair most common mesh issues regardless of which CAD tool you used to create the file.",
  },
  {
    q: "How does the AI file repair work?",
    a: "When you upload a file, our system automatically detects issues like non-manifold edges, inverted normals, holes in the mesh, and wall-thickness problems. It fixes them before slicing so your part prints correctly — no manual cleanup needed on your end.",
  },
  {
    q: "What materials will be available?",
    a: "We're launching with PLA, PETG, ABS, Nylon, TPU (flexible), and standard/detail resins. Material availability may vary by printer location, but we'll always show you what's in stock before you order.",
  },
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section id="faq" className="section-container bg-white">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
          FAQ
        </p>
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
          Common questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-gray-100">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between py-6 text-left group"
            >
              <span className="text-base font-medium text-gray-900 pr-4 group-hover:text-sky-700 transition-colors">
                {faq.q}
              </span>
              <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-gray-200 transition-all duration-300 ${openIndex === i ? 'bg-sky-brand border-sky-brand text-white rotate-180' : 'bg-gray-50 text-gray-400 group-hover:border-sky-300 group-hover:text-sky-500'}`}>
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === i ? "max-h-40 pb-6 opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              <p className="pr-12 text-sm text-gray-500 leading-relaxed">
                {faq.a}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
