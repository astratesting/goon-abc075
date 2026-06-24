import { PostHog } from "posthog-node";

let posthogClient: PostHog | null = null;

export function getPostHog(): PostHog | null {
  if (posthogClient) return posthogClient;

  const key = process.env.POSTHOG_PROJECT_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://app.posthog.com";

  if (!key) return null;

  posthogClient = new PostHog(key, { host });
  return posthogClient;
}

export function trackServerEvent(
  event: string,
  distinctId: string,
  properties?: Record<string, unknown>
) {
  const client = getPostHog();
  if (!client) {
    console.debug("[posthog-server]", event, distinctId, properties);
    return;
  }
  client.capture({ event, distinctId, properties: properties ?? {} });
}

export function aliasServer(from: string, to: string) {
  const client = getPostHog();
  if (!client) return;
  client.alias({ alias: from, distinctId: to });
}
