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
  price?: number; // EUR
}

interface Body {
  items: CheckoutItem[];
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  city?: string;
  deliveryMethod: "recogida" | "domicilio";
  scheduledFor?: string;
  notes?: string;
  returnUrl: string;
  environment: StripeEnv;
  userId?: string;
  meta?: {
    fbp?: string;
    fbc?: string;
    userAgent?: string;
    eventSourceUrl?: string;
  };
}

const SOCIO_PRICE_ID = "socio_anual_59";
const SOCIO_AMOUNT_CENTS = 5900;

// Recargo de envío: 3,50€ a domicilio si el subtotal de productos NO-fritos < 29€.
// Los combos fritos ya llevan el domicilio incluido en el precio.
const FRITOS_PRODUCT_IDS = new Set(["20", "21", "22", "23", "24", "29", "30", "31", "32", "40", "41", "42", "43"]);
const SHIPPING_FEE_CENTS = 350;
const FREE_SHIPPING_THRESHOLD_CENTS = 2900;

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

    const isSubscription = body.items.some((i) => i.priceId === SOCIO_PRICE_ID);

    const params = new URLSearchParams();
    params.append("mode", isSubscription ? "subscription" : "payment");
    params.append("ui_mode", "embedded");
    params.append("return_url", body.returnUrl);
    if (body.customerEmail) params.append("customer_email", body.customerEmail);

    // Build line items inline (no lookup keys) so it works with any Stripe account
    body.items.forEach((item, index) => {
      const qty = Math.max(1, Math.min(50, item.quantity || 1));
      const base = `line_items[${index}]`;

      if (item.priceId === SOCIO_PRICE_ID) {
        params.append(`${base}[price_data][currency]`, "eur");
        params.append(`${base}[price_data][unit_amount]`, String(SOCIO_AMOUNT_CENTS));
        params.append(`${base}[price_data][product_data][name]`, "Membresía Club MaxRico (anual)");
        params.append(`${base}[price_data][recurring][interval]`, "year");
        params.append(`${base}[quantity]`, String(qty));
      } else {
        if (!item.name || typeof item.price !== "number" || item.price <= 0) {
          throw new Error(`Item inválido (falta name/price): ${item.priceId}`);
        }
        const cents = Math.round(item.price * 100);
        params.append(`${base}[price_data][currency]`, "eur");
        params.append(`${base}[price_data][unit_amount]`, String(cents));
        params.append(`${base}[price_data][product_data][name]`, item.name);
        params.append(`${base}[quantity]`, String(qty));
      }
    });

    // Añade recargo de envío (3,50€) si es domicilio y el subtotal de productos NO-fritos < 29€.
    // No es suscripción para evitar mezclar modos.
    if (!isSubscription && body.deliveryMethod === "domicilio") {
      const nonFritoSubtotalCents = body.items.reduce((sum, i) => {
        if (i.priceId === SOCIO_PRICE_ID) return sum;
        const pid = String(i.productId ?? "");
        if (FRITOS_PRODUCT_IDS.has(pid)) return sum;
        const qty = Math.max(1, Math.min(50, i.quantity || 1));
        const price = typeof i.price === "number" ? i.price : 0;
        return sum + Math.round(price * 100) * qty;
      }, 0);

      if (nonFritoSubtotalCents > 0 && nonFritoSubtotalCents < FREE_SHIPPING_THRESHOLD_CENTS) {
        const idx = body.items.length;
        const base = `line_items[${idx}]`;
        params.append(`${base}[price_data][currency]`, "eur");
        params.append(`${base}[price_data][unit_amount]`, String(SHIPPING_FEE_CENTS));
        params.append(`${base}[price_data][product_data][name]`, "Envío a domicilio (Zaragoza)");
        params.append(`${base}[quantity]`, "1");
      }
    }

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
    // Meta CAPI: guardamos fbp/fbc/userAgent/URL para deduplicar con el Pixel del navegador
    if (body.meta?.fbp) baseMetadata.metaFbp = body.meta.fbp.slice(0, 100);
    if (body.meta?.fbc) baseMetadata.metaFbc = body.meta.fbc.slice(0, 200);
    if (body.meta?.userAgent) baseMetadata.metaUa = body.meta.userAgent.slice(0, 400);
    if (body.meta?.eventSourceUrl) baseMetadata.metaUrl = body.meta.eventSourceUrl.slice(0, 400);
    // IP del cliente para CAPI
    const ipHeader = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "";
    const clientIp = ipHeader.split(",")[0].trim();
    if (clientIp) baseMetadata.metaIp = clientIp.slice(0, 64);

    Object.entries(baseMetadata).forEach(([key, value]) =>
      params.append(`metadata[${key}]`, value),
    );
    if (isSubscription && body.userId) {
      params.append("subscription_data[metadata][userId]", body.userId);
    }

    const session = await stripeGatewayJson(body.environment, "/v1/checkout/sessions", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
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
