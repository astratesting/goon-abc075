"use client";

import { useState } from "react";

const faqs = [
  {
    q: "What is Goon?",
    a: "Goon is a premium spa and salon built exclusively for gay men. We offer haircuts, shaves, facials, massage, waxing, and more in a safe, affirming environment.",
  },
  {
    q: "When do you open?",
    a: "We're targeting a 2026 opening. Join the waitlist to get early access and priority booking when doors open.",
  },
  {
    q: "Is it really only for gay men?",
    a: "Yes. Goon is designed as a safe, comfortable space for gay men to groom and relax without judgment. Everyone deserves a space where they feel at home.",
  },
  {
    q: "What services do you offer?",
    a: "We offer haircuts, straight-razor shaves, facials, massage, waxing, brow grooming, and more. Full service details will be available closer to opening.",
  },
  {
    q: "Where are you located?",
    a: "Our location will be announced soon. We're scouting neighborhoods that are accessible, welcoming, and easy to get to.",
  },
  {
    q: "How much does it cost?",
    a: "We offer tiered pricing from $45 for basics to $199/month for full membership. See our pricing section for details, and join the waitlist for early-access offers.",
  },
  {
    q: "Is there a membership?",
    a: "Yes. Our membership plan includes monthly services, product discounts, and access to members-only events. It's the best value for regulars.",
  },
  {
    q: "How do I join the waitlist?",
    a: "Just enter your email in the waitlist form above. You'll get priority booking access and exclusive opening offers when we're ready to launch.",
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
