import { type StripeEnv, stripeGatewayJson } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface CheckoutItem {
  priceId: string;
  quantity: number;
  productId?: string;
  name?: string;
  price?: number;
}

interface Body {
  items: CheckoutItem[];
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  city?: string;
  deliveryMethod: "recogida" | "domicilio";
  scheduledFor?: string; // ISO
  notes?: string;
  returnUrl: string;
  environment: StripeEnv;
  userId?: string; // for subscriptions (membresía)
}

function encodeForm(data: Record<string, string | number | boolean | null | undefined>) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(data)) {
    if (value !== undefined && value !== null && value !== "") params.append(key, String(value));
  }
  return params;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405, headers: corsHeaders });
  }

  try {
    const body = (await req.json()) as Body;

    if (!body?.items?.length) throw new Error("No items");
    if (!body.deliveryMethod || !["recogida", "domicilio"].includes(body.deliveryMethod)) {
      throw new Error("Invalid deliveryMethod");
    }
    if (!body.returnUrl) throw new Error("Missing returnUrl");
    if (body.environment !== "sandbox" && body.environment !== "live") {
      throw new Error("Invalid environment");
    }

    // Resolve all priceIds via lookup_keys
    const lookupKeys = body.items.map((i) => i.priceId);
    for (const k of lookupKeys) {
      if (!/^[a-zA-Z0-9_-]+$/.test(k)) throw new Error(`Invalid priceId: ${k}`);
    }

    const priceParams = new URLSearchParams({ limit: "100" });
    lookupKeys.forEach((key, index) => priceParams.append(`lookup_keys[${index}]`, key));
    const prices = await stripeGatewayJson(body.environment, `/v1/prices?${priceParams.toString()}`, {
      method: "GET",
    });
    const priceData = Array.isArray(prices?.data) ? prices.data : [];
    const byKey = new Map(priceData.map((p: any) => [p.lookup_key, p]));

    const line_items = body.items.map((item) => {
      const p: any = byKey.get(item.priceId);
      if (!p) throw new Error(`Price not found: ${item.priceId}`);
      return { price: p.id, quantity: Math.max(1, Math.min(50, item.quantity || 1)) };
    });

    const isSubscription = priceData.some((p: any) => p.type === "recurring");

    const baseMetadata: Record<string, string> = {
      deliveryMethod: body.deliveryMethod,
      city: body.city ?? "",
      customerName: body.customerName ?? "",
      customerPhone: body.customerPhone ?? "",
      customerAddress: body.customerAddress ?? "",
      scheduledFor: body.scheduledFor ?? "",
      notes: (body.notes ?? "").slice(0, 400),
      items: JSON.stringify(body.items).slice(0, 450),
      environment: body.environment,
    };
    if (body.userId) baseMetadata.userId = body.userId;

    const sessionParams = encodeForm({
      mode: isSubscription ? "subscription" : "payment",
      ui_mode: "embedded",
      return_url: body.returnUrl,
      customer_email: body.customerEmail,
    });
    line_items.forEach((item, index) => {
      sessionParams.append(`line_items[${index}][price]`, item.price);
      sessionParams.append(`line_items[${index}][quantity]`, String(item.quantity));
    });
    Object.entries(baseMetadata).forEach(([key, value]) => sessionParams.append(`metadata[${key}]`, value));
    if (isSubscription && body.userId) {
      sessionParams.append("subscription_data[metadata][userId]", body.userId);
    }

    const session = await stripeGatewayJson(body.environment, "/v1/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: sessionParams,
    });

    return new Response(JSON.stringify({ clientSecret: session.client_secret }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("create-checkout error", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
