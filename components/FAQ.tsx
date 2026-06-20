"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What file formats do you accept?",
    a: "We accept STEP, STL, 3MF, OBJ, and IGES files. Our AI can repair most common mesh issues regardless of which CAD tool you used to create the file.",
  },
  {
    q: "How does the AI file repair work?",
    a: "When you upload a file, our system automatically detects issues like non-manifold edges, inverted normals, holes in the mesh, and wall-thickness problems. It fixes them before slicing so your part prints correctly — no manual cleanup needed on your end.",
  },
  {
    q: "What does 'same-day dispatch' actually mean?",
    a: "If you place an order before 2pm in your time zone, your part will be printed and handed off to a shipping carrier the same day. Delivery time depends on your location but is typically 1–3 business days for standard shipping.",
  },
  {
    q: "Is there really no minimum order quantity?",
    a: "Correct. You can order a single part. We built Goon specifically for inventors and makers who need one-off prototypes, not bulk production runs — though we handle small batches too.",
  },
  {
    q: "What materials are available?",
    a: "We currently offer PLA, PLA+, PETG, ABS, Nylon, TPU (flexible), and standard/detail resins. Material availability may vary by printer location, but we'll always show you what's in stock before you order.",
  },
  {
    q: "How is pricing calculated?",
    a: "Pricing is based on material, part volume, and resolution. You'll see the exact price before confirming your order — no surprises. Typical single parts range from $15 to $75.",
  },
  {
    q: "Can I track my order?",
    a: "Yes. Every order moves through stages — file repair, slicing, printing, quality check, and shipping — and you can see the status in real time from your dashboard.",
  },
  {
    q: "What if my part doesn't print correctly?",
    a: "Every part goes through a quality check before it ships. If there's a defect caused by the printing process, we'll reprint it at no charge. Our AI repair also prevents most print failures before they happen.",
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
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Common questions
        </h2>
      </div>

      <div className="max-w-3xl mx-auto divide-y divide-gray-100">
        {faqs.map((faq, i) => (
          <div key={i}>
            <button
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              className="flex w-full items-center justify-between py-5 text-left"
            >
              <span className="text-base font-medium text-gray-900 pr-4">
                {faq.q}
              </span>
              <svg
                className={`h-5 w-5 shrink-0 text-gray-400 transition-transform duration-200 ${
                  openIndex === i ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {openIndex === i && (
              <div className="pb-5 pr-12">
                <p className="text-sm text-gray-500 leading-relaxed">
                  {faq.a}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
