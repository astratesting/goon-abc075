"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { trackClientEvent } from "@/lib/posthog/client";
import { Clock, Check } from "lucide-react";

const USE_CASES = [
  { key: "hobbyist", label: "Hobbyist project", desc: "Personal builds, repairs, and experiments" },
  { key: "startup", label: "Prototype for a startup", desc: "Validating physical product ideas" },
  { key: "replacement", label: "Replacement part", desc: "Fix what you already have" },
  { key: "exploring", label: "Just exploring", desc: "Seeing what Goon can do" },
];

const PRINTER_OPTIONS = [
  { key: "none", label: "Don't own one", desc: "I need a print service" },
  { key: "fdm", label: "Own an FDM", desc: "Looking for better quality or materials" },
  { key: "fdm_resin", label: "Own an FDM + resin/SLA", desc: "Need SLS or industrial materials" },
];

const MATERIAL_OPTIONS = [
  { key: "fdm_pla", label: "FDM PLA", desc: "Strong, affordable, fast turnaround", lead: "Same day" },
  { key: "sla_resin", label: "SLA Resin", desc: "High detail, smooth surface finish", lead: "1-2 days" },
  { key: "sls_nylon", label: "SLS Nylon", desc: "Production-grade, no support marks", lead: "2-4 days" },
];

const STEPS = [
  { label: "Use case" },
  { label: "Printer" },
  { label: "Material" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [step, setStep] = useState(0);
  const [useCase, setUseCase] = useState("");
  const [printer, setPrinter] = useState("");
  const [material, setMaterial] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleComplete() {
    setLoading(true);
    trackClientEvent("onboarding_completed", { useCase, printer, material });
    try {
      await fetch("/api/profile/onboarded", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ useCase, homePrinter: printer, preferredMaterial: material }),
      });
    } catch {
      // Continue anyway
    }
    router.push("/dashboard");
  }

  function handleNext() {
    if (step === 0 && !useCase) return;
    if (step === 1 && !printer) return;
    trackClientEvent("onboarding_step_completed", { step: step + 1 });
    if (step === 2) {
      handleComplete();
    } else {
      setStep(step + 1);
    }
  }

  return (
    <div className="min-h-screen bg-softwhite flex items-start justify-center pt-12 px-4">
      <div className="w-full max-w-[720px]">
        <div className="flex justify-center mb-8">
          <Stepper steps={STEPS} current={step} />
        </div>

        {step === 0 && (
          <div className="space-y-4">
            <h1 className="font-serif text-2xl font-bold text-gray-900 text-center">What brings you to Goon?</h1>
            <p className="text-sm text-gray-500 text-center">This helps us tailor material recommendations.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-6">
              {USE_CASES.map((uc) => (
                <button
                  key={uc.key}
                  onClick={() => setUseCase(uc.key)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    useCase === uc.key
                      ? "border-sky-brand bg-sky-brand/5 ring-2 ring-sky-brand/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900">{uc.label}</span>
                  <p className="text-xs text-gray-500 mt-1">{uc.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="font-serif text-2xl font-bold text-gray-900 text-center">What&apos;s your home printer situation?</h1>
            <p className="text-sm text-gray-500 text-center">We&apos;ll suggest materials that fill the gaps.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {PRINTER_OPTIONS.map((po) => (
                <button
                  key={po.key}
                  onClick={() => setPrinter(po.key)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    printer === po.key
                      ? "border-sky-brand bg-sky-brand/5 ring-2 ring-sky-brand/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900">{po.label}</span>
                  <p className="text-xs text-gray-500 mt-1">{po.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h1 className="font-serif text-2xl font-bold text-gray-900 text-center">Pick your first material</h1>
            <p className="text-sm text-gray-500 text-center">You can always change this later.</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-6">
              {MATERIAL_OPTIONS.map((mo) => (
                <button
                  key={mo.key}
                  onClick={() => setMaterial(mo.key)}
                  className={`text-left p-4 rounded-xl border transition-all ${
                    material === mo.key
                      ? "border-sky-brand bg-sky-brand/5 ring-2 ring-sky-brand/20"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <span className="text-sm font-medium text-gray-900">{mo.label}</span>
                  <p className="text-xs text-gray-500 mt-1">{mo.desc}</p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-medium text-emerald-700 bg-mint-brand/20 rounded-full px-2 py-0.5">
                    <Clock size={10} />
                    {mo.lead}
                  </span>
                </button>
              ))}
            </div>
            <div className="text-center mt-4">
              <button onClick={handleComplete} className="text-sm text-gray-500 hover:text-gray-700 underline">
                Skip for now
              </button>
            </div>
          </div>
        )}

        <div className="flex items-center justify-between mt-8">
          {step > 0 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>
              Back
            </Button>
          ) : (
            <div />
          )}
          <Button
            onClick={handleNext}
            disabled={step === 0 && !useCase || step === 1 && !printer}
            loading={loading}
          >
            {step === 2 ? "Get started" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
}
