"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Stepper } from "@/components/ui/Stepper";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DropZone } from "@/components/ui/DropZone";
import { MATERIALS } from "@/lib/materials";
import { computeQuote, formatCurrency } from "@/lib/quote";
import { track } from "@/lib/analytics";
import { Clock } from "lucide-react";

const STEPS = [
  { label: "Upload file" },
  { label: "Choose material" },
  { label: "Get your quote" },
];

export default function OnboardingPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [step, setStep] = useState(0);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  async function handleSkip() {
    await fetch("/api/profile/onboarded", { method: "POST" });
    router.push("/dashboard");
  }

  function handleFile(f: File) {
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (![".stl", ".obj"].includes(ext)) {
      setFileError("Only .STL and .OBJ files are accepted.");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      setFileError("File must be under 50MB.");
      return;
    }
    setFileError("");
    setFile(f);
  }

  function handleNext() {
    if (step === 0 && !file) return;
    if (step === 1 && !selectedMaterial) return;
    track("onboarding_step_completed", { step: step + 1 });
    setStep(step + 1);
  }

  async function handlePlaceOrder() {
    if (!file || !selectedMaterial) return;
    setSubmitting(true);
    try {
      const quote = computeQuote({ material: selectedMaterial, fileSizeBytes: file.size });
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          material: selectedMaterial,
          fileMeta: JSON.stringify({
            name: file.name,
            size_bytes: file.size,
            ext: file.name.split(".").pop()?.toLowerCase(),
          }),
          quoteCents: Math.round(quote.total * 100),
          leadDaysMin: quote.leadDaysMin,
          leadDaysMax: quote.leadDaysMax,
          quantity: 1,
          pricePerUnit: quote.total,
          totalPrice: quote.total,
        }),
      });
      const data = await res.json();
      if (res.ok && data.id) {
        track("order_submitted", { material: selectedMaterial });
        await fetch("/api/profile/onboarded", { method: "POST" });
        router.push(`/dashboard/orders/${data.id}`);
      }
    } catch {
      setSubmitting(false);
    }
  }

  async function handleSaveForLater() {
    await fetch("/api/profile/onboarded", { method: "POST" });
    router.push("/dashboard");
  }

  if (status !== "authenticated") return null;

  const quote =
    file && selectedMaterial
      ? computeQuote({ material: selectedMaterial, fileSizeBytes: file.size })
      : null;

  return (
    <div className="min-h-[calc(100vh-64px)] flex flex-col items-center px-6 py-10">
      <div className="w-full max-w-[720px]">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-8">
          <Stepper steps={STEPS} current={step} />
          <button
            onClick={handleSkip}
            className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            Skip onboarding
          </button>
        </div>

        {/* Step 0: Upload */}
        {step === 0 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Let&apos;s print something.
              </h1>
              <p className="mt-1 font-serif italic text-gray-500">
                Three minutes from file to quote.
              </p>
            </div>
            <DropZone
              file={file}
              onFile={handleFile}
              onRemove={() => setFile(null)}
              error={fileError}
            />
            <p className="text-xs text-gray-400">
              Files stay private to your account. Stored for 30 days for fulfillment.
            </p>
            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!file}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 1: Material */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Choose a material.
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Each material has different strengths, finishes, and lead times.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {MATERIALS.map((mat) => (
                <button
                  key={mat.key}
                  onClick={() => setSelectedMaterial(mat.key)}
                  className={`text-left rounded-2xl border-2 p-5 transition-all ${
                    selectedMaterial === mat.key
                      ? "border-sky-brand bg-sand-brand/10 shadow-sm"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                      {mat.technology}
                    </span>
                  </div>
                  <h3 className="font-semibold text-gray-900">{mat.name}</h3>
                  <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                    {mat.description}
                  </p>
                  <p className="mt-3 text-sm font-semibold text-sky-700">
                    from ${mat.basePrice}
                  </p>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400">
              Lead times are estimates. Final lead time confirmed after file review.
            </p>
            <div className="flex justify-between">
              <Button variant="ghost" onClick={() => setStep(0)}>
                Back
              </Button>
              <Button onClick={handleNext} disabled={!selectedMaterial}>
                Continue
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Quote */}
        {step === 2 && quote && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Your instant quote.
              </h1>
            </div>

            <Card className="bg-sand-brand/10 border-sand-brand/30">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Material</span>
                  <span className="text-sm font-medium text-gray-900">
                    {MATERIALS.find((m) => m.key === selectedMaterial)?.name}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">File</span>
                  <span className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                    {file?.name}
                  </span>
                </div>
                <div className="border-t border-sand-brand/30 pt-4">
                  <p className="font-serif text-lg italic text-gray-500">Quote</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">
                    {formatCurrency(quote.total)}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="h-4 w-4" />
                  <span>
                    Lead time: ~{quote.leadDaysMin}-{quote.leadDaysMax} days
                  </span>
                </div>
                <p className="text-[11px] text-gray-400">
                  Instant estimate. Final price confirmed by email.
                </p>
              </div>
            </Card>

            <div className="flex flex-col sm:flex-row justify-between gap-3">
              <Button variant="ghost" onClick={() => setStep(1)}>
                Back
              </Button>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={handleSaveForLater}>
                  Save for later
                </Button>
                <Button onClick={handlePlaceOrder} loading={submitting}>
                  Place order
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
