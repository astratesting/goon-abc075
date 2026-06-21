"use client";

import { useEffect, ReactNode } from "react";

export function PostHogProvider({ children }: { children: ReactNode }) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;

  useEffect(() => {
    if (!key) return;
    // PostHog lazy-load when key is provided
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any;
    if (w.posthog) return;
    // posthog-js is an optional dependency — only loaded via CDN when key is set
    const s = document.createElement("script");
    s.src = "https://app.posthog.com/static/array.js";
    s.onload = () => {
      if (w.posthog) {
        w.posthog.init(key, {
          api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
          capture_pageview: false,
        });
      }
    };
    document.head.appendChild(s);
  }, [key]);

  return <>{children}</>;
}
