"use client";

export type EventName =
  | "signup_completed"
  | "login_completed"
  | "order_submitted"
  | "onboarding_step_completed";

export function track(name: EventName, properties?: Record<string, unknown>) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  if (key && typeof window !== "undefined" && (window as unknown as Record<string, unknown>).posthog) {
    const posthog = (window as unknown as Record<string, unknown>).posthog as {
      capture: (name: string, props?: Record<string, unknown>) => void;
    };
    posthog.capture(name, properties);
  } else {
    console.debug("[analytics]", name, properties);
  }
}
