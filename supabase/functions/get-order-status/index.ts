import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, stripeGatewayJson } from "../_shared/stripe.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function formatEur(cents: number, currency = "eur") {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: currency.toUpperCase() }).format((cents ?? 0) / 100);
}

async function sendEmail(templateName: string, recipientEmail: string, idempotencyKey: string, templateData?: Record<string, unknown>) {
  try {
    const url = `${Deno.env.get("SUPABASE_URL")}/functions/v1/send-transactional-email`;
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${serviceRoleKey}`,
        "x-internal-service-key": serviceRoleKey ?? "",
        "x-lovable-api-key": lovableApiKey ?? "",
      },
      body: JSON.stringify({ templateName, recipientEmail, idempotencyKey, templateData }),
    });
    if (!res.ok) console.error("send-transactional-email failed", templateName, await res.text());
  } catch (e) {
    console.error("send-transactional-email error", templateName, e);
  }
}

async function sendOrderEmails(session: any, order: any) {
  const m = session.metadata || {};
  let items: any[] = [];
  try { items = m.items ? JSON.parse(m.items) : []; } catch (_) { items = []; }
  const itemsForEmail = items.map((it: any) => ({
    name: it.name || it.title || "Producto",
    qty: it.quantity || it.qty || 1,
    price: it.price ? formatEur(Math.round(Number(it.price) * 100), session.currency ?? "eur") : "",
  }));
  const commonData = {
    customerName: order.customer_name,
    customerEmail: order.customer_email,
    customerPhone: order.customer_phone,
    orderId: session.id.slice(-8).toUpperCase(),
    totalEur: formatEur(session.amount_total ?? 0, session.currency ?? "eur"),
    deliveryMethod: order.delivery_method,
    city: order.city,
    address: order.customer_address,
    scheduledFor: order.scheduled_for,
    notes: order.notes,
    items: itemsForEmail,
  };
  await sendEmail("order-receipt", order.customer_email, `order-receipt-${session.id}`, commonData);
  await sendEmail("order-admin-alert", "clientes@maxrico.es", `order-admin-${session.id}`, commonData);
}

function sanitizeOrder(order: any) {
  return {
    id: order.id,
    stripe_session_id: order.stripe_session_id,
    customer_email: order.customer_email,
    customer_name: order.customer_name,
    customer_phone: order.customer_phone,
    customer_address: order.customer_address,
    city: order.city,
    delivery_method: order.delivery_method,
    scheduled_for: order.scheduled_for,
    items: order.items,
    amount_total_cents: order.amount_total_cents,
    currency: order.currency,
    status: order.status,
    notes: order.notes,
    created_at: order.created_at,
  };
}

function formatSessionAsOrder(session: any, env: StripeEnv) {
  const m = session.metadata || {};
  let items: any[] = [];
  try {
    items = m.items ? JSON.parse(m.items) : [];
  } catch (_) {
    items = [];
  }

  return {
    stripe_session_id: session.id,
    customer_email: session.customer_email || session.customer_details?.email || "",
    customer_name: m.customerName || session.customer_details?.name || null,
    customer_phone: m.customerPhone || null,
    customer_address: m.customerAddress || null,
    city: m.city || null,
    delivery_method: m.deliveryMethod === "domicilio" ? "domicilio" : "recogida",
    scheduled_for: m.scheduledFor || null,
    items,
    amount_total_cents: session.amount_total ?? 0,
    currency: session.currency ?? "eur",
    status: session.payment_status === "paid" ? "paid" : "pending",
    notes: m.notes || null,
    environment: env,
  };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const { sessionId } = await req.json();
    if (!sessionId || !/^cs_(test|live)_[a-zA-Z0-9]+$/.test(sessionId)) {
      return new Response(JSON.stringify({ error: "Referencia de pago no válida" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("stripe_session_id", sessionId)
      .maybeSingle();

    if (error) throw error;

    if (!data) {
      const env: StripeEnv = sessionId.startsWith("cs_test_") ? "sandbox" : "live";
      const session = await stripeGatewayJson(env, `/v1/checkout/sessions/${sessionId}`, {
        method: "GET",
      });

      if (!session || session.payment_status !== "paid") {
        return new Response(JSON.stringify({ status: "processing", order: null }), {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const orderPayload = formatSessionAsOrder(session, env);
      const { data: createdOrder, error: upsertError } = await supabase
        .from("orders")
        .upsert(orderPayload, { onConflict: "stripe_session_id" })
        .select("*")
        .single();

      if (upsertError) throw upsertError;

      // Webhook may not have fired (test mode / missing endpoint). Send emails here.
      // Idempotency keys ensure no duplicates if the webhook eventually arrives.
      if (createdOrder?.customer_email && createdOrder.status === "paid") {
        await sendOrderEmails(session, createdOrder);
      }

      return new Response(JSON.stringify({ status: "found", order: sanitizeOrder(createdOrder) }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ status: "found", order: sanitizeOrder(data) }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("get-order-status error", e);
    return new Response(JSON.stringify({ error: "No pudimos cargar el comprobante" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});