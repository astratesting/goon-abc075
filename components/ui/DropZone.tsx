"use client";

import { useCallback, useState, useRef } from "react";
import { Upload, File, X } from "lucide-react";

interface DropZoneProps {
  onFile: (file: File) => void;
  file: File | null;
  onRemove: () => void;
  error?: string;
}

const ACCEPTED = [".stl", ".obj"];
const MAX_SIZE = 50 * 1024 * 1024; // 50MB

export function DropZone({ onFile, file, onRemove, error }: DropZoneProps) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const validate = useCallback(
    (f: File): string | null => {
      const ext = "." + f.name.split(".").pop()?.toLowerCase();
      if (!ACCEPTED.includes(ext)) {
        return "Only .STL and .OBJ files are accepted.";
      }
      if (f.size > MAX_SIZE) {
        return "File must be under 50MB.";
      }
      return null;
    },
    []
  );

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files?.[0]) return;
      const f = files[0];
      const err = validate(f);
      if (err) {
        // Let parent handle error via a wrapper
        return;
      }
      onFile(f);
    },
    [onFile, validate]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  if (file) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(1);
    return (
      <div className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
          <File className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
          <p className="text-xs text-gray-500">{sizeMB} MB</p>
        </div>
        <button
          type="button"
          onClick={onRemove}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200 ${
          dragOver
            ? "border-sky-brand bg-sand-brand/10 animate-pulse"
            : "border-gray-200 hover:border-sky-brand/50 hover:bg-sky-50/30"
        } p-8 sm:p-12`}
      >
        <div className={`flex h-12 w-12 items-center justify-center rounded-xl mb-3 ${
          dragOver ? "bg-sky-brand/20 text-sky-brand" : "bg-gray-100 text-gray-400"
        }`}>
          <Upload className="h-6 w-6" />
        </div>
        <p className="text-sm font-medium text-gray-700">
          Drop your .STL or .OBJ here, or click to browse
        </p>
        <p className="mt-1 text-xs text-gray-400">Max 50MB</p>
        <input
          ref={inputRef}
          type="file"
          accept=".stl,.obj"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );
}
