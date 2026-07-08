// Meta Conversions API (server-side) — se deduplica con el Pixel del navegador
// usando el mismo `event_id`. Sin token configurado, la función no hace nada.

const META_PIXEL_ID = "896061071985697";
const GRAPH_VERSION = "v20.0";

async function sha256(input: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(input.trim().toLowerCase()));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function hashOrUndef(v?: string | null): Promise<string | undefined> {
  if (!v) return undefined;
  return await sha256(v);
}

export interface MetaEventInput {
  eventName: string;
  eventId: string;
  eventTime?: number; // seconds
  eventSourceUrl?: string;
  actionSource?: "website" | "system_generated";
  user: {
    email?: string | null;
    phone?: string | null;
    firstName?: string | null;
    fbp?: string | null;
    fbc?: string | null;
    clientIpAddress?: string | null;
    clientUserAgent?: string | null;
  };
  customData?: Record<string, unknown>;
}

export async function sendMetaEvent(input: MetaEventInput): Promise<void> {
  const token = Deno.env.get("META_CAPI_ACCESS_TOKEN");
  if (!token) {
    console.log("[meta-capi] skipped: META_CAPI_ACCESS_TOKEN not configured");
    return;
  }
  const testCode = Deno.env.get("META_CAPI_TEST_EVENT_CODE") || undefined;

  const cleanPhone = input.user.phone ? input.user.phone.replace(/\D+/g, "") : undefined;

  const user_data: Record<string, unknown> = {
    em: input.user.email ? [await sha256(input.user.email)] : undefined,
    ph: cleanPhone ? [await sha256(cleanPhone)] : undefined,
    fn: await hashOrUndef(input.user.firstName ?? undefined),
    fbp: input.user.fbp || undefined,
    fbc: input.user.fbc || undefined,
    client_ip_address: input.user.clientIpAddress || undefined,
    client_user_agent: input.user.clientUserAgent || undefined,
  };
  // strip undefined
  Object.keys(user_data).forEach((k) => user_data[k] === undefined && delete user_data[k]);

  const payload = {
    data: [
      {
        event_name: input.eventName,
        event_time: input.eventTime ?? Math.floor(Date.now() / 1000),
        event_id: input.eventId,
        action_source: input.actionSource ?? "website",
        event_source_url: input.eventSourceUrl,
        user_data,
        custom_data: input.customData ?? {},
      },
    ],
    ...(testCode ? { test_event_code: testCode } : {}),
  };

  try {
    const res = await fetch(
      `https://graph.facebook.com/${GRAPH_VERSION}/${META_PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const body = await res.text();
    if (!res.ok) {
      console.error(`[meta-capi] ${input.eventName} failed [${res.status}]: ${body}`);
    } else {
      console.log(`[meta-capi] ${input.eventName} ok: ${body}`);
    }
  } catch (e) {
    console.error("[meta-capi] network error", e);
  }
}
