const benefits = [
  {
    title: "AI File Repair",
    description:
      "Upload any CAD file — even broken meshes. Our AI detects and fixes geometry errors, non-manifold edges, and wall-thickness issues automatically before printing.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V17a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 17v-2.5" />
      </svg>
    ),
    gradient: "from-violet-500 to-indigo-600",
    bgGlow: "bg-violet-500/5",
  },
  {
    title: "Same-Day Local Fulfillment",
    description:
      "Orders placed before 2pm are printed and shipped the same day. We route to the nearest printer in our network to minimize transit time.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-sky-500 to-cyan-500",
    bgGlow: "bg-sky-500/5",
  },
  {
    title: "No Minimums",
    description:
      "Print a single prototype or a batch of fifty — same quality, same turnaround. No setup fees, no MOQs, no contracts required.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    gradient: "from-emerald-500 to-teal-500",
    bgGlow: "bg-emerald-500/5",
  },
  {
    title: "Transparent Pricing",
    description:
      "See the exact cost before you order. No hidden fees, no surprise charges. Prices range from $15 to $75 per part depending on material and size.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
    bgGlow: "bg-amber-500/5",
  },
];

export function Features() {
  return (
    <section id="features" className="relative">
      {/* Subtle top divider */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-sky-200 to-transparent" />

      <div className="section-container bg-white">
        <div className="text-center max-w-2xl mx-auto mb-16 stagger-children">
          <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
            What we&apos;re building
          </p>
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl text-balance">
            Custom 3D printing,{" "}
            <span className="font-serif italic text-sky-700">without the friction</span>
          </h2>
          <p className="mt-5 text-lg text-gray-500 leading-relaxed">
            Goon makes it easy to get high-quality custom parts printed and delivered quickly.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="group relative rounded-2xl border border-gray-100 bg-white p-7 transition-all duration-300 hover:border-sky-200/80 hover:shadow-xl hover:shadow-sky-500/5"
            >
              <div
                className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${benefit.gradient} text-white shadow-lg shadow-sky-500/10 transition-transform duration-300 group-hover:scale-110`}
              >
                {benefit.icon}
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                {benefit.title}
              </h3>
              <p className="mt-2.5 text-sm text-gray-500 leading-relaxed">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
