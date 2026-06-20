const features = [
  {
    title: "AI File Repair",
    description:
      "Upload any CAD file — even broken meshes. Our AI detects and fixes geometry errors, non-manifold edges, and wall-thickness issues automatically before printing.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5m14 0V17a2.25 2.25 0 01-2.25 2.25H7.25A2.25 2.25 0 015 17v-2.5" />
      </svg>
    ),
    gradient: "from-purple-500 to-indigo-500",
  },
  {
    title: "Same-Day Dispatch",
    description:
      "Orders placed before 2pm are printed and shipped the same day. We route to the nearest printer in our network to minimize transit time.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    gradient: "from-sky-500 to-cyan-500",
  },
  {
    title: "No Minimum Orders",
    description:
      "Print a single prototype or a batch of fifty — same quality, same turnaround. No setup fees, no MOQs, no contracts required.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
      </svg>
    ),
    gradient: "from-mint-brand to-emerald-500",
  },
  {
    title: "Material Variety",
    description:
      "Choose from PLA, PETG, ABS, Nylon, TPU, and engineering resins. Each material is matched to the right printer for optimal results.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
      </svg>
    ),
    gradient: "from-amber-500 to-orange-500",
  },
  {
    title: "Live Order Tracking",
    description:
      "Watch your part move through each stage — file repair, slicing, printing, quality check, and shipping — with real-time status updates.",
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5" />
      </svg>
    ),
    gradient: "from-rose-500 to-pink-500",
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
    gradient: "from-teal-500 to-cyan-500",
  },
];

export function Features() {
  return (
    <section id="features" className="section-container bg-white">
      <div className="text-center max-w-2xl mx-auto mb-16">
        <p className="text-sm font-semibold text-sky-600 uppercase tracking-wider mb-3">
          How it works
        </p>
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl text-balance">
          From CAD file to your door,{" "}
          <span className="font-serif italic text-sky-700">without the friction</span>
        </h2>
        <p className="mt-4 text-gray-500 leading-relaxed">
          Traditional prototyping takes weeks. Goon cuts it to hours with
          automated file repair and a distributed printer network.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, i) => (
          <div
            key={feature.title}
            className="group relative rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-300 hover:border-sky-200 hover:shadow-lg hover:shadow-sky-50"
          >
            <div
              className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${feature.gradient} text-white shadow-lg`}
            >
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-gray-900">
              {feature.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500 leading-relaxed">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Process steps */}
      <div className="mt-20">
        <h3 className="text-center text-2xl font-bold text-gray-900 mb-12">
          Three steps. That&apos;s it.
        </h3>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: "01",
              title: "Upload your file",
              desc: "Drop a STEP, STL, or 3MF file. Our AI inspects and repairs it in seconds.",
            },
            {
              step: "02",
              title: "Choose material & quantity",
              desc: "Pick from PLA, PETG, Nylon, resin, and more. One part or fifty — no minimum.",
            },
            {
              step: "03",
              title: "We print & ship",
              desc: "Your part is routed to the nearest printer, quality-checked, and shipped same day.",
            },
          ].map((item) => (
            <div key={item.step} className="text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-sky-50 to-mint-50 border border-sky-100">
                <span className="text-lg font-bold gradient-text">
                  {item.step}
                </span>
              </div>
              <h4 className="text-lg font-semibold text-gray-900">
                {item.title}
              </h4>
              <p className="mt-2 text-sm text-gray-500 max-w-xs mx-auto">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
