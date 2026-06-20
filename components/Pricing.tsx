const tiers = [
  {
    name: "Prototype",
    price: "$15",
    unit: "per part",
    description: "Quick single-part prints for testing form and fit.",
    features: [
      "PLA or PETG material",
      "Standard resolution (0.2mm)",
      "AI file repair included",
      "Same-day dispatch",
      "Basic tracking",
    ],
    highlight: false,
  },
  {
    name: "Precision",
    price: "$35",
    unit: "per part",
    description: "Higher-detail prints for functional prototypes and presentations.",
    features: [
      "All Prototype features",
      "Nylon, ABS, or engineering resin",
      "High resolution (0.1mm)",
      "Priority print queue",
      "Detailed quality report",
    ],
    highlight: true,
  },
  {
    name: "Production",
    price: "$75",
    unit: "per part",
    description: "Batch-ready parts with tighter tolerances and finish options.",
    features: [
      "All Precision features",
      "Multi-material support",
      "Custom finish (sanded, painted)",
      "Batch discounts (10+ parts)",
      "Dedicated support channel",
    ],
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section
      id="pricing"
      className="section-container bg-gradient-to-b from-softwhite via-sky-50/30 to-softwhite"
    >
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
          Pricing
        </p>
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl text-balance">
          Simple, transparent pricing
        </h2>
        <p className="mt-4 text-gray-500 leading-relaxed">
          What you see is what you pay. No setup fees, no hidden charges, no
          minimum order quantities.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-3 max-w-5xl mx-auto">
        {tiers.map((tier) => (
          <div
            key={tier.name}
            className={`relative rounded-2xl p-8 transition-all duration-300 ${
              tier.highlight
                ? "bg-white border-2 border-sky-brand shadow-xl shadow-sky-100/40 scale-[1.02]"
                : "bg-white border border-gray-100 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-50"
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                <span className="rounded-full bg-gradient-to-r from-sky-brand to-mint-brand px-4 py-1 text-xs font-semibold text-white shadow-lg">
                  Most popular
                </span>
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                {tier.name}
              </h3>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">
                  {tier.price}
                </span>
                <span className="text-sm text-gray-500">/{tier.unit}</span>
              </div>
              <p className="mt-2 text-sm text-gray-500">{tier.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {tier.features.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <svg
                    className="h-5 w-5 shrink-0 text-sky-500 mt-0.5"
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
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <a
              href="/register"
              className={`block text-center w-full rounded-full py-3 text-sm font-semibold transition-all duration-200 ${
                tier.highlight
                  ? "bg-sky-brand text-white hover:bg-sky-500 shadow-lg hover:shadow-xl"
                  : "border-2 border-sky-brand text-sky-700 hover:bg-sky-brand hover:text-white"
              }`}
            >
              Get started
            </a>
          </div>
        ))}
      </div>
    </section>
  );
}
