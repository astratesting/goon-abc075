"use client";

import { useState, useEffect } from "react";

const STORAGE_KEY = "goon-analytics-consent";

export function AnalyticsBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) setVisible(true);
  }, []);

  function accept() {
    localStorage.setItem(STORAGE_KEY, "accepted");
    setVisible(false);
  }

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, "dismissed");
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 border-t border-gray-200 bg-white/95 backdrop-blur-sm p-4">
      <div className="mx-auto max-w-4xl flex flex-col sm:flex-row items-center justify-between gap-3">
        <p className="text-sm text-gray-600">
          We use anonymous analytics to improve Goon. No personal data is shared.
        </p>
        <div className="flex gap-2">
          <button
            onClick={dismiss}
            className="rounded-lg px-4 py-1.5 text-sm text-gray-500 hover:bg-gray-100 transition-colors"
          >
            Dismiss
          </button>
          <button
            onClick={accept}
            className="rounded-lg bg-sky-brand px-4 py-1.5 text-sm font-medium text-white hover:bg-sky-500 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
