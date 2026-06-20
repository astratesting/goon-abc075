"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

type Stage = "upload" | "analyzing" | "repair" | "quote" | "confirmed";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("upload");
  const [fileName, setFileName] = useState("");
  const [material, setMaterial] = useState("PLA+");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  const simulateUpload = useCallback(() => {
    setStage("analyzing");
    setTimeout(() => setStage("repair"), 1500);
    setTimeout(() => setStage("quote"), 3500);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer?.files?.[0];
      if (file) {
        setFileName(file.name);
        simulateUpload();
      }
    },
    [simulateUpload]
  );

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        setFileName(file.name);
        simulateUpload();
      }
    },
    [simulateUpload]
  );

  const handleDemoFile = useCallback(() => {
    setFileName("prototype-bracket.step");
    simulateUpload();
  }, [simulateUpload]);

  const pricePerPart =
    material === "PLA+" || material === "PLA"
      ? 15
      : material === "PETG"
      ? 22
      : material === "Nylon" || material === "ABS"
      ? 35
      : material === "Resin"
      ? 45
      : 35;

  const totalPrice = pricePerPart * quantity;

  if (status === "loading") {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-sky-brand border-t-transparent" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="section-container !py-12 max-w-3xl mx-auto">
      <div className="mb-6">
        <Link
          href="/dashboard"
          className="text-sm text-gray-500 hover:text-sky-600 transition-colors"
        >
          ← Back to dashboard
        </Link>
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-2">New order</h1>
      <p className="text-sm text-gray-500 mb-8">
        Upload a CAD file to get started. We accept STEP, STL, 3MF, OBJ, and
        IGES formats.
      </p>

      {/* Progress steps */}
      <div className="flex items-center gap-2 mb-8">
        {(["upload", "analyzing", "repair", "quote", "confirmed"] as Stage[]).map(
          (s, i) => {
            const stages: Stage[] = [
              "upload",
              "analyzing",
              "repair",
              "quote",
              "confirmed",
            ];
            const currentIdx = stages.indexOf(stage);
            const isActive = i <= currentIdx;
            return (
              <div key={s} className="flex items-center gap-2">
                <div
                  className={`h-2 w-8 rounded-full transition-colors ${
                    isActive ? "bg-sky-brand" : "bg-gray-200"
                  }`}
                />
              </div>
            );
          }
        )}
      </div>

      {/* Upload stage */}
      {stage === "upload" && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center hover:border-sky-brand transition-colors cursor-pointer"
          onClick={() => document.getElementById("file-input")?.click()}
        >
          <input
            id="file-input"
            type="file"
            accept=".step,.stp,.stl,.3mf,.obj,.iges,.igs"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
            <svg
              className="h-8 w-8 text-sky-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
          </div>
          <p className="text-base font-medium text-gray-900">
            Drop your CAD file here
          </p>
          <p className="mt-1 text-sm text-gray-500">
            or click to browse. STEP, STL, 3MF, OBJ, IGES accepted.
          </p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleDemoFile();
            }}
            className="mt-4 text-sm text-sky-600 hover:underline"
          >
            Or try with a demo file →
          </button>
        </div>
      )}

      {/* Analyzing stage */}
      {stage === "analyzing" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
          <div className="h-12 w-12 mx-auto mb-4 animate-spin rounded-full border-2 border-sky-brand border-t-transparent" />
          <p className="font-medium text-gray-900">Analyzing {fileName}…</p>
          <p className="mt-1 text-sm text-gray-500">
            Checking geometry, wall thickness, and mesh integrity.
          </p>
        </div>
      )}

      {/* Repair stage */}
      {stage === "repair" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8">
          <div className="text-center mb-6">
            <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center">
              <svg
                className="h-6 w-6 text-purple-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714a2.25 2.25 0 00.659 1.591L19 14.5M14.25 3.104c.251.023.501.05.75.082M19 14.5l-2.47 2.47a2.25 2.25 0 01-1.591.659H9.061a2.25 2.25 0 01-1.591-.659L5 14.5"
                />
              </svg>
            </div>
            <p className="font-medium text-gray-900">AI repair in progress</p>
            <p className="mt-1 text-sm text-gray-500">
              Fixing 3 mesh errors and 1 wall-thickness issue.
            </p>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full w-full rounded-full bg-gradient-to-r from-purple-500 to-sky-brand animate-pulse" />
          </div>
        </div>
      )}

      {/* Quote stage */}
      {stage === "quote" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
            <svg
              className="h-5 w-5 text-green-600 shrink-0"
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
            <p className="text-sm text-green-800">
              File repaired successfully. 3 mesh errors fixed, 1 wall-thickness
              issue corrected.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-sky-brand to-mint-brand flex items-center justify-center">
                <svg
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900">{fileName}</p>
                <p className="text-xs text-gray-500">
                  File repaired and ready for printing
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Material
                </label>
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-sky-brand focus:outline-none focus:ring-2 focus:ring-sky-brand/20"
                >
                  <option value="PLA">PLA — $15/part</option>
                  <option value="PLA+">PLA+ — $15/part</option>
                  <option value="PETG">PETG — $22/part</option>
                  <option value="ABS">ABS — $35/part</option>
                  <option value="Nylon">Nylon — $35/part</option>
                  <option value="Resin">Resin — $45/part</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-sky-brand transition-colors"
                  >
                    −
                  </button>
                  <span className="text-lg font-semibold w-12 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="h-10 w-10 rounded-xl border border-gray-200 flex items-center justify-center text-gray-600 hover:border-sky-brand transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500">Estimated total</span>
                <span className="text-2xl font-bold text-gray-900">
                  ${totalPrice.toFixed(2)}
                </span>
              </div>
              <p className="text-xs text-gray-400 mb-4">
                Estimated delivery: Same day (orders before 2pm)
              </p>
              <button
                onClick={() => setStage("confirmed")}
                className="btn-primary w-full !rounded-xl"
              >
                Place order
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmed stage */}
      {stage === "confirmed" && (
        <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-8 w-8 text-green-600"
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
          </div>
          <h2 className="text-xl font-bold text-gray-900">Order placed!</h2>
          <p className="mt-2 text-sm text-gray-500">
            Your {fileName} is now being printed with {material}. You can track
            its progress in your dashboard.
          </p>
          <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/dashboard" className="btn-primary !text-sm">
              View dashboard
            </Link>
            <button
              onClick={() => {
                setStage("upload");
                setFileName("");
              }}
              className="btn-secondary !text-sm"
            >
              Upload another file
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
