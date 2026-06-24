"use client";

import posthog from "posthog-js";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

export function usePostHogPageView() {
  const pathname = usePathname();
  const initialized = useRef(false);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (!key) return;

    if (!initialized.current) {
      posthog.init(key, {
        api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com",
        capture_pageview: false,
        persistence: "localStorage",
      });
      initialized.current = true;
    }
  }, []);

  useEffect(() => {
    if (pathname && posthog.__loaded) {
      posthog.capture("$pageview", { $current_url: window.location.href });
    }
  }, [pathname]);
}

export function trackClientEvent(
  event: string,
  properties?: Record<string, unknown>
) {
  if (posthog.__loaded) {
    posthog.capture(event, properties);
  }
}
