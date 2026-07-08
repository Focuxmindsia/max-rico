// Meta Pixel helpers — event_id se comparte con Conversions API (servidor)
// para que Meta deduplique automáticamente los eventos duplicados.

export const META_PIXEL_ID = "896061071985697";

type FbqFn = (...args: unknown[]) => void;
declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

function hasConsent(): boolean {
  try {
    const raw = localStorage.getItem("cookie-consent");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return parsed?.value === "all";
  } catch {
    return false;
  }
}

function fbq(...args: unknown[]) {
  if (typeof window === "undefined" || !window.fbq) return;
  if (!hasConsent()) return;
  window.fbq(...args);
}

export function metaTrack(
  event: string,
  params?: Record<string, unknown>,
  eventId?: string,
) {
  const opts = eventId ? { eventID: eventId } : undefined;
  fbq("track", event, params ?? {}, opts);
}

export function metaEventId(prefix: string, key?: string | number): string {
  const base = key != null ? String(key) : Math.random().toString(36).slice(2);
  return `${prefix}-${base}`;
}

// Se llama desde CookieBanner cuando el usuario acepta después del PageView inicial.
export function metaConsentGranted() {
  if (typeof window === "undefined" || !window.fbq) return;
  window.fbq("consent", "grant");
  window.fbq("track", "PageView");
}
