"use client";

import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { MATERIALS } from "@/lib/quote-calculator";

interface QuoteResult {
  volumeCm3: number;
  material: string;
  materialDescription: string;
  pricePerCm3: number;
  basePrice: number;
  quantityDiscount: number;
  pricePerUnit: number;
  setupFee: number;
  totalPrice: number;
  quantity: number;
}

function QuoteContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialVolume = parseFloat(searchParams?.get("volume") ?? "10");
  const fileId = searchParams?.get("fileId") ?? undefined;
  const fileName = searchParams?.get("fileName") ?? "";

  const [volume, setVolume] = useState(initialVolume);
  const [material, setMaterial] = useState("PLA+");
  const [quantity, setQuantity] = useState(1);
  const [quote, setQuote] = useState<QuoteResult | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [error, setError] = useState("");
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  async function calculateQuote() {
    setCalculating(true);
    setError("");
    try {
      const res = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ volumeCm3: volume, material, quantity }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Calculation failed");
      } else {
        setQuote(data);
      }
    } catch {
      setError("Failed to calculate quote");
    } finally {
      setCalculating(false);
    }
  }

  async function placeOrder() {
    if (!quote) return;
    setPlacing(true);
    setError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileId: fileId || undefined,
          fileName: fileName || "3D Model",
          material: quote.material,
          quantity: quote.quantity,
          pricePerUnit: quote.pricePerUnit,
          totalPrice: quote.totalPrice,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order failed");
        setPlacing(false);
        return;
      }
      router.push(`/orders`);
    } catch {
      setError("Failed to place order");
      setPlacing(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-brand border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="mx-auto max-w-4xl px-6 py-10 lg:px-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-sky-600 hover:text-sky-700 mb-2 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Instant Quote</h1>
        <p className="mt-1 text-gray-500">Configure your print to get an instant price estimate</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="rounded-2xl border border-gray-100 bg-white p-6">
          <h2 className="font-serif text-lg font-semibold text-gray-900 mb-6">Configuration</h2>

          {fileName && (
            <div className="mb-4 rounded-xl bg-sky-50/50 p-3 flex items-center gap-2">
              <svg className="h-5 w-5 text-sky-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-gray-700">{fileName}</span>
            </div>
          )}

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estimated Volume (cm&sup3;)
              </label>
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value) || 1)}
                className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-sky-brand focus:ring-2 focus:ring-sky-brand/20 outline-none transition-all"
              />
              <p className="mt-1 text-xs text-gray-400">
                Auto-detected from file upload, or enter manually
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Material
              </label>
              <div className="space-y-2">
                {Object.entries(MATERIALS).map(([key, mat]) => (
                  <label
                    key={key}
                    className={`flex items-start gap-3 rounded-xl border p-3 cursor-pointer transition-colors ${
                      material === key
                        ? "border-sky-brand bg-sky-50/50"
                        : "border-gray-200 hover:border-sky-light"
                    }`}
                  >
                    <input
                      type="radio"
                      name="material"
                      value={key}
                      checked={material === key}
                      onChange={(e) => setMaterial(e.target.value)}
                      className="mt-0.5 text-sky-brand focus:ring-sky-brand"
                    />
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {mat.name} <span className="text-gray-400 font-normal">&middot; ${mat.pricePerCm3}/cm&sup3;</span>
                      </p>
                      <p className="text-xs text-gray-500">{mat.description}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  &minus;
                </button>
                <input
                  type="number"
                  min="1"
                  max="10000"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-20 rounded-lg border border-gray-200 px-3 py-2 text-center text-sm focus:border-sky-brand outline-none"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="flex h-10 w-10 items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-50"
                >
                  +
                </button>
              </div>
              {quantity >= 5 && (
                <p className="mt-1 text-xs text-green-600 font-medium">
                  {quantity >= 50 ? "25%" : quantity >= 20 ? "15%" : quantity >= 10 ? "8%" : "3%"} volume discount applied!
                </p>
              )}
            </div>

            <button
              onClick={calculateQuote}
              disabled={calculating}
              className="btn-primary w-full disabled:opacity-50"
            >
              {calculating ? "Calculating..." : "Calculate Price"}
            </button>
          </div>
        </div>

        <div>
          {error && (
            <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {quote ? (
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <h2 className="font-serif text-lg font-semibold text-gray-900 mb-6">Your Quote</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Volume</span>
                  <span className="font-medium text-gray-900">{quote.volumeCm3.toFixed(1)} cm&sup3;</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Material</span>
                  <span className="font-medium text-gray-900">{quote.material}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Base price</span>
                  <span className="font-medium text-gray-900">${quote.basePrice.toFixed(2)}/unit</span>
                </div>
                {quote.quantityDiscount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Volume discount</span>
                    <span className="font-medium text-green-600">&minus;{quote.quantityDiscount}%</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Price per unit</span>
                  <span className="font-medium text-gray-900">${quote.pricePerUnit.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Quantity</span>
                  <span className="font-medium text-gray-900">&times;{quote.quantity}</span>
                </div>
                {quote.setupFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Setup fee</span>
                    <span className="font-medium text-gray-900">${quote.setupFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="border-t border-gray-100 pt-3 flex justify-between">
                  <span className="font-medium text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-gray-900">${quote.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-xl bg-mint-50 p-4 mb-6">
                <p className="text-xs text-gray-600">
                  <span className="font-medium">Estimated delivery:</span> 3 business days &middot; Free shipping on orders over $50
                </p>
              </div>

              <button
                onClick={placeOrder}
                disabled={placing}
                className="btn-primary w-full disabled:opacity-50"
              >
                {placing ? "Placing order..." : "Place Order"}
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-gray-200 bg-white p-12 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-50">
                <svg className="h-8 w-8 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-gray-400 text-sm">Configure your print and click &quot;Calculate Price&quot; to see your quote</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function QuotePage() {
  return (
    <Suspense fallback={
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-brand border-t-transparent" />
      </div>
    }>
      <QuoteContent />
    </Suspense>
  );
}
