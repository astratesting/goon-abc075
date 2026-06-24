"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { OrbitSpinner } from "@/components/Orbit";
import { computePrice } from "@/lib/pricing";
import { trackClientEvent } from "@/lib/posthog/client";
import { UploadCloud, File, Wrench, Cpu, Palette, Hash, MapPin, ChevronDown } from "lucide-react";

const ACCEPTED = [".stl", ".step", ".obj"];
const MAX_SIZE = 100 * 1024 * 1024;

const TECH_OPTIONS = [
  { key: "fdm", label: "FDM", lead: "Same day" },
  { key: "sla", label: "SLA", lead: "1-2 days" },
  { key: "sls", label: "SLS", lead: "2-4 days" },
];

const MATERIALS: Record<string, { key: string; label: string }[]> = {
  fdm: [
    { key: "pla", label: "PLA" },
    { key: "abs", label: "ABS" },
    { key: "petg", label: "PETG" },
  ],
  sla: [
    { key: "tough_resin", label: "Tough Resin" },
    { key: "clear_resin", label: "Clear Resin" },
  ],
  sls: [
    { key: "pa12", label: "PA12 Nylon" },
  ],
};

const COLORS = [
  { key: "#6DB5D2", label: "Sky Blue" },
  { key: "#A5D8C1", label: "Mint" },
  { key: "#E8CDA0", label: "Sand" },
  { key: "#0F1B22", label: "Ink Black" },
  { key: "#F5F8FA", label: "Soft White" },
];

export default function NewOrderPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);

  // File state
  const [fileName, setFileName] = useState("");
  const [fileSize, setFileSize] = useState(0);
  const [fileBase64, setFileBase64] = useState("");
  const [hasFile, setHasFile] = useState(false);

  // Config state
  const [tech, setTech] = useState("fdm");
  const [material, setMaterial] = useState("pla");
  const [color, setColor] = useState("#6DB5D2");
  const [quantity, setQuantity] = useState(1);
  const [zip, setZip] = useState("");
  const [aiRepair, setAiRepair] = useState(true);

  const handleFile = useCallback((f: File) => {
    setError("");
    const ext = "." + f.name.split(".").pop()?.toLowerCase();
    if (!ACCEPTED.includes(ext)) {
      setError("Only .STL, .STEP, and .OBJ files are accepted.");
      return;
    }
    if (f.size > MAX_SIZE) {
      setError("Max 100MB for MVP.");
      return;
    }
    setFileName(f.name);
    setFileSize(f.size);
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64((reader.result as string).split(",")[1]);
      setHasFile(true);
    };
    reader.readAsDataURL(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, [handleFile]);

  const price = hasFile ? computePrice({ tech, fileSizeBytes: fileSize, quantity }) : 0;
  const canSubmit = hasFile && tech && zip.length >= 5;

  async function handlePlaceOrder() {
    if (!canSubmit) return;
    setUploading(true);
    setError("");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName,
          fileSizeBytes: fileSize,
          tech,
          material,
          color,
          quantity,
          shippingZip: zip,
          aiRepair,
          fileBase64,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create order");
        setUploading(false);
        return;
      }

      const order = await res.json();
      trackClientEvent("order_created", {
        tech,
        material,
        price_cents: Math.round(price * 100),
        ai_repair: aiRepair,
        quantity,
      });
      sessionStorage.removeItem("pendingFile");
      router.push(`/orders/${order.id}`);
    } catch {
      setError("Something went wrong. Please try again.");
      setUploading(false);
    }
  }

  return (
    <div className="max-w-[1120px] mx-auto px-4 py-8">
      <h1 className="font-serif text-2xl font-bold text-gray-900 mb-6">New order</h1>

      {error && (
        <div className="mb-4 rounded-lg bg-sand-brand/20 border border-sand-brand/40 px-4 py-3 text-sm text-amber-800">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: File preview */}
        <div>
          {hasFile ? (
            <div className="space-y-3">
              <div className="w-full aspect-square max-w-[320px] rounded-xl bg-gray-100 border border-gray-200 flex items-center justify-center">
                <span className="text-sm text-gray-400 font-medium">Preview</span>
              </div>
              <p className="text-sm font-medium text-gray-900">{fileName}</p>
              <p className="text-xs text-gray-500">{(fileSize / (1024 * 1024)).toFixed(1)} MB</p>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
                dragOver ? "border-sky-brand bg-sky-brand/5" : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <UploadCloud className="h-10 w-10 mx-auto text-gray-300 mb-3" />
              <p className="text-sm font-medium text-gray-700">Drop an STL, STEP, or OBJ here</p>
              <p className="text-xs text-gray-400 mt-1">or click to browse</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept=".stl,.step,.obj"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleFile(f);
              e.target.value = "";
            }}
          />
        </div>

        {/* Right: Configuration */}
        <div className="space-y-4">
          {/* File config */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <File size={16} className="text-gray-400" />
              File
            </h3>
            {hasFile ? (
              <div className="space-y-3">
                <p className="text-sm text-gray-600">{fileName} &middot; {(fileSize / (1024 * 1024)).toFixed(1)} MB</p>
                <label className="flex items-center gap-3 cursor-pointer">
                  <div
                    className={`relative w-10 h-5 rounded-full transition-colors ${
                      aiRepair ? "bg-sand-brand" : "bg-gray-200"
                    }`}
                    onClick={() => setAiRepair(!aiRepair)}
                  >
                    <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                      aiRepair ? "translate-x-5" : ""
                    }`} />
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Run AI repair</span>
                    <p className="text-[10px] text-gray-400">We auto-fix non-manifold edges, holes, and inverted normals.</p>
                  </div>
                </label>
              </div>
            ) : (
              <p className="text-sm text-gray-400">Upload a file to configure your order.</p>
            )}
          </Card>

          {/* Technology */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Cpu size={16} className="text-gray-400" />
              Technology
            </h3>
            <div className="flex gap-2">
              {TECH_OPTIONS.map((t) => (
                <button
                  key={t.key}
                  onClick={() => {
                    setTech(t.key);
                    // Reset material to first option for new tech
                    const mats = MATERIALS[t.key];
                    if (mats?.length) setMaterial(mats[0].key);
                  }}
                  className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    tech === t.key
                      ? "bg-sky-brand text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {t.label}
                  <span className={`block text-[10px] ${tech === t.key ? "text-white/80" : "text-gray-400"}`}>
                    {t.lead}
                  </span>
                </button>
              ))}
            </div>
          </Card>

          {/* Material & color */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Palette size={16} className="text-gray-400" />
              Material & color
            </h3>
            <div className="space-y-3">
              <div className="relative">
                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-gray-200 px-3 py-2 pr-10 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand"
                >
                  {(MATERIALS[tech] || []).map((m) => (
                    <option key={m.key} value={m.key}>{m.label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              <div className="flex gap-2">
                {COLORS.map((c) => (
                  <button
                    key={c.key}
                    onClick={() => setColor(c.key)}
                    className={`w-8 h-8 rounded-full border-2 transition-all ${
                      color === c.key ? "border-sky-brand ring-2 ring-sky-brand/20" : "border-gray-200"
                    }`}
                    style={{ backgroundColor: c.key }}
                    title={c.label}
                  />
                ))}
              </div>
            </div>
          </Card>

          {/* Quantity */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Hash size={16} className="text-gray-400" />
              Quantity
            </h3>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              >
                &minus;
              </button>
              <span className="w-12 text-center text-sm font-medium text-gray-900">{quantity}</span>
              <button
                onClick={() => setQuantity(Math.min(99, quantity + 1))}
                className="w-9 h-9 rounded-lg bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 transition-colors"
              >
                +
              </button>
            </div>
          </Card>

          {/* Shipping */}
          <Card className="p-6">
            <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center gap-2">
              <MapPin size={16} className="text-gray-400" />
              Shipping
            </h3>
            <input
              type="text"
              value={zip}
              onChange={(e) => setZip(e.target.value.replace(/\D/g, "").slice(0, 5))}
              placeholder="ZIP / postal code"
              className="w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-brand/30 focus:border-sky-brand"
            />
            <p className="text-[10px] text-gray-400 mt-1">We match you to the closest printer in our network.</p>
          </Card>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="sticky bottom-0 mt-6 bg-white border-t border-gray-200 px-4 py-4 -mx-4 flex items-center justify-between rounded-b-xl">
        <div>
          <p className="text-xs text-gray-400">Estimated total</p>
          <p className="font-serif text-xl font-bold text-gray-900">
            ${price > 0 ? price.toFixed(2) : "0.00"}
          </p>
        </div>
        <Button
          onClick={handlePlaceOrder}
          disabled={!canSubmit}
          loading={uploading}
        >
          {uploading ? (
            <span className="flex items-center gap-2">
              <OrbitSpinner size={16} className="text-white" />
              Placing order...
            </span>
          ) : (
            "Place order"
          )}
        </Button>
      </div>
    </div>
  );
}
