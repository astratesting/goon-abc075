"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import Link from "next/link";

export default function UploadPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [uploadedFile, setUploadedFile] = useState<{
    id: string;
    fileName: string;
    fileSize: number;
    format: string;
    volume: number | null;
  } | null>(null);
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const droppedFile = e.dataTransfer?.files?.[0];
    if (droppedFile) {
      const ext = droppedFile.name.split(".").pop()?.toLowerCase();
      if (ext && ["stl", "obj", "3mf"].includes(ext)) {
        setFile(droppedFile);
        setError("");
      } else {
        setError("Invalid format. Please upload STL, OBJ, or 3MF files.");
      }
    }
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const ext = selectedFile.name.split(".").pop()?.toLowerCase();
      if (ext && ["stl", "obj", "3mf"].includes(ext)) {
        setFile(selectedFile);
        setError("");
      } else {
        setError("Invalid format. Please upload STL, OBJ, or 3MF files.");
      }
    }
  }, []);

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Upload failed");
        setUploading(false);
        return;
      }
      setUploadedFile(data);
    } catch {
      setError("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  }

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
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
    <div className="mx-auto max-w-3xl px-6 py-10 lg:px-8">
      <div className="mb-8">
        <Link href="/dashboard" className="text-sm text-sky-600 hover:text-sky-700 mb-2 inline-block">
          &larr; Back to Dashboard
        </Link>
        <h1 className="font-serif text-3xl font-bold text-gray-900">Upload 3D File</h1>
        <p className="mt-1 text-gray-500">Upload your STL, OBJ, or 3MF file to get an instant quote</p>
      </div>

      {uploadedFile ? (
        <div className="rounded-2xl border border-gray-100 bg-white p-8">
          <div className="text-center mb-6">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-green-50">
              <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="font-serif text-xl font-semibold text-gray-900">File Uploaded Successfully</h2>
          </div>

          <div className="rounded-xl bg-gray-50 p-4 mb-6">
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div><span className="text-gray-500">File:</span> <span className="font-medium text-gray-900">{uploadedFile.fileName}</span></div>
              <div><span className="text-gray-500">Size:</span> <span className="font-medium text-gray-900">{formatFileSize(uploadedFile.fileSize)}</span></div>
              <div><span className="text-gray-500">Format:</span> <span className="font-medium text-gray-900 uppercase">{uploadedFile.format}</span></div>
              {uploadedFile.volume && (
                <div><span className="text-gray-500">Est. Volume:</span> <span className="font-medium text-gray-900">{uploadedFile.volume.toFixed(1)} cm&sup3;</span></div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href={`/quote?volume=${uploadedFile.volume ?? 10}&fileId=${uploadedFile.id}&fileName=${encodeURIComponent(uploadedFile.fileName)}`}
              className="btn-primary flex-1 text-center"
            >
              Get Instant Quote
            </Link>
            <button
              onClick={() => { setUploadedFile(null); setFile(null); }}
              className="btn-secondary flex-1"
            >
              Upload Another File
            </button>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-gray-100 bg-white p-8">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
              dragActive ? "border-sky-brand bg-sky-50" : "border-gray-200 hover:border-sky-light"
            }`}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-sky-50">
              <svg className="h-8 w-8 text-sky-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </div>
            <p className="text-gray-600 mb-2">
              {file ? (
                <span className="font-medium text-gray-900">{file.name}</span>
              ) : (
                <>Drag and drop your 3D file here, or{" "}<label className="text-sky-600 hover:text-sky-700 font-medium cursor-pointer">browse</label></>
              )}
            </p>
            <p className="text-xs text-gray-400">STL, OBJ, 3MF up to 100MB</p>
            <input type="file" accept=".stl,.obj,.3mf" onChange={handleFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="sr-only">Upload file</label>
          </div>

          {error && (
            <div className="mt-4 rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {file && (
            <div className="mt-6">
              <div className="rounded-xl bg-gray-50 p-4 mb-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>
                <button onClick={() => setFile(null)} className="text-gray-400 hover:text-gray-600">
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <button
                onClick={handleUpload}
                disabled={uploading}
                className="btn-primary w-full disabled:opacity-50"
              >
                {uploading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    Uploading...
                  </span>
                ) : (
                  "Upload File"
                )}
              </button>
            </div>
          )}

          <div className="mt-6 rounded-xl bg-sky-50/50 p-4">
            <p className="text-xs text-gray-500 text-center">
              Supported: <span className="font-medium text-gray-700">STL</span>, <span className="font-medium text-gray-700">OBJ</span>, <span className="font-medium text-gray-700">3MF</span> &middot; Max 100MB &middot; All files are encrypted and stored securely
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
