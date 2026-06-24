"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { ChevronDown } from "lucide-react";

const MATERIALS_DATA = [
  {
    key: "fdm",
    name: "FDM (Fused Deposition Modeling)",
    technology: "FDM",
    description:
      "FDM prints layer by layer using thermoplastic filament. It's the most accessible 3D printing technology — fast, affordable, and great for functional prototypes and everyday parts.",
    finishes: ["Standard (matte)", "Sanded", "Painted"],
    tolerances: "±0.5mm typical",
    idealUse: "Prototypes, functional parts, jigs and fixtures, concept models",
  },
  {
    key: "sla",
    name: "SLA (Stereolithography)",
    technology: "SLA",
    description:
      "SLA uses a UV laser to cure liquid resin into solid parts. It produces extremely fine detail and smooth surfaces, making it ideal for visual prototypes and miniatures.",
    finishes: ["Standard (smooth)", "Polished", "Painted"],
    tolerances: "±0.1mm typical",
    idealUse: "Miniatures, dental models, jewelry, high-detail visual prototypes",
  },
  {
    key: "sls",
    name: "SLS (Selective Laser Sintering)",
    technology: "SLS",
    description:
      "SLS uses a laser to fuse nylon powder into durable, flexible parts. No support structures needed — ideal for complex geometries and engineering-grade functional parts.",
    finishes: ["Natural (grainy)", "Dyed", "Smoothed"],
    tolerances: "±0.3mm typical",
    idealUse: "Functional prototypes, end-use parts, living hinges, snap-fits",
  },
];

export default function MaterialsPage() {
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8 lg:px-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Materials</h1>
      <p className="text-sm text-gray-500 mb-8">
        Each material has different strengths. Choose based on what matters most for your part.
      </p>

      <div className="space-y-4">
        {MATERIALS_DATA.map((mat) => (
          <Card key={mat.key} padding={false}>
            <button
              onClick={() => setExpanded(expanded === mat.key ? null : mat.key)}
              className="w-full flex items-center justify-between p-6 text-left"
            >
              <div>
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                  {mat.technology}
                </span>
                <h3 className="mt-2 font-semibold text-gray-900">{mat.name}</h3>
              </div>
              <ChevronDown
                className={`h-5 w-5 text-gray-400 transition-transform ${
                  expanded === mat.key ? "rotate-180" : ""
                }`}
              />
            </button>
            {expanded === mat.key && (
              <div className="px-6 pb-6 space-y-3 border-t border-gray-100 pt-4">
                <p className="text-sm text-gray-600">{mat.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Finishes</p>
                    <ul className="space-y-0.5">
                      {mat.finishes.map((f) => (
                        <li key={f} className="text-gray-700">{f}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Tolerances</p>
                    <p className="text-gray-700">{mat.tolerances}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs mb-1">Ideal for</p>
                    <p className="text-gray-700">{mat.idealUse}</p>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
