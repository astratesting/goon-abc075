"use client";

import { useRouter } from "next/navigation";
import { useCallback, useRef, useState } from "react";
import { UploadCloud } from "lucide-react";

const ACCEPTED = [".stl", ".step", ".obj"];
const MAX_SIZE = 100 * 1024 * 1024;

export function QuickUploadCard() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState("");

  const handleFile = useCallback(
    (f: File) => {
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
      // Store the file in sessionStorage and navigate to the order flow
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = (reader.result as string).split(",")[1];
        sessionStorage.setItem(
          "pendingFile",
          JSON.stringify({ name: f.name, size: f.size, base64 })
        );
        router.push("/orders/new");
      };
      reader.readAsDataURL(f);
    },
    [router]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files?.[0];
      if (f) handleFile(f);
    },
    [handleFile]
  );

  return (
    <div>
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          dragOver
            ? "border-sky-brand bg-sky-brand/5"
            : "border-gray-200 bg-white hover:border-gray-300"
        }`}
      >
        <UploadCloud className="h-8 w-8 mx-auto text-gray-300 mb-3" />
        <p className="text-sm font-medium text-gray-700">
          Drop an STL, STEP, or OBJ here
        </p>
        <p className="text-xs text-gray-400 mt-1">or click to browse</p>
        <span className="inline-flex items-center gap-1 mt-3 text-[10px] font-medium text-emerald-700 bg-mint-brand/20 rounded-full px-2 py-0.5">
          AI repair included
        </span>
      </div>

      {error && (
        <div className="mt-3 rounded-lg bg-sand-brand/20 border border-sand-brand/40 px-4 py-2 text-sm text-amber-800">
          {error}
        </div>
      )}

      <input
        ref={inputRef}
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
  );
}
