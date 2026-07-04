import { encode } from "https://deno.land/std@0.168.0/encoding/hex.ts";

const getEnv = (key: string): string => {
  const value = Deno.env.get(key);
  if (!value) throw new Error(`${key} is not configured`);
  return value;
};

export type StripeEnv = "sandbox" | "live";

const STRIPE_API_BASE = "https://api.stripe.com";

export function getConnectionApiKey(env: StripeEnv): string {
  if (env === "sandbox") {
    // Prefer the dedicated sandbox/test key; fall back to the restricted key
    // only if it's a test key (rk_test_/sk_test_).
    const sandboxKey = Deno.env.get("STRIPE_SANDBOX_API_KEY");
    if (sandboxKey) return sandboxKey;
    const restricted = Deno.env.get("STRIPE_RESTRICTED_API_KEY");
    if (restricted && /^(rk|sk)_test_/.test(restricted)) return restricted;
    throw new Error(
      "No hay clave de Stripe de test configurada (STRIPE_SANDBOX_API_KEY). La tarjeta 4242 solo funciona con una clave rk_test_/sk_test_.",
    );
  }
  return getEnv("STRIPE_LIVE_API_KEY");
}

export async function stripeGatewayJson<T = any>(
  env: StripeEnv,
  path: string,
  init: RequestInit = {},
): Promise<T> {
  const apiKey = getConnectionApiKey(env);
  const response = await fetch(`${STRIPE_API_BASE}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Stripe-Version": "2025-03-31.basil",
      ...init.headers,
    },
  });

  const text = await response.text();
  let payload: any = null;
  try {
    payload = text ? JSON.parse(text) : null;
  } catch (_) {
    payload = { raw: text };
  }

  if (!response.ok) {
    const message = payload?.error?.message || payload?.message || text || "Stripe request failed";
    throw new Error(`Stripe ${response.status}: ${message}`);
  }

  return payload as T;
}

export async function verifyWebhook(
  req: Request,
  env: StripeEnv,
): Promise<{ type: string; data: { object: any } }> {
  const signature = req.headers.get("stripe-signature");
  const body = await req.text();
  const secret =
    env === "sandbox"
      ? getEnv("PAYMENTS_SANDBOX_WEBHOOK_SECRET")
      : getEnv("PAYMENTS_LIVE_WEBHOOK_SECRET");

  if (!signature || !body) throw new Error("Missing signature or body");

  let timestamp: string | undefined;
  const v1Signatures: string[] = [];
  for (const part of signature.split(",")) {
    const [key, value] = part.split("=", 2);
    if (key === "t") timestamp = value;
    if (key === "v1") v1Signatures.push(value);
  }
  if (!timestamp || v1Signatures.length === 0) throw new Error("Invalid signature format");

  const age = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (age > 300) throw new Error("Webhook timestamp too old");

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signed = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(`${timestamp}.${body}`),
  );
  const expected = new TextDecoder().decode(encode(new Uint8Array(signed)));

  if (!v1Signatures.includes(expected)) throw new Error("Invalid webhook signature");

  return JSON.parse(body);
}
