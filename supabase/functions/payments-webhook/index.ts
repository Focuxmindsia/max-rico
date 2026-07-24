import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";
import { sendMetaEvent } from "../_shared/meta-capi.ts";

let _supabase: ReturnType<typeof createClient> | null = null;
function getSupabase() {
  if (!_supabase) {
    _supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );
  }
  return _supabase;
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

function formatEur(cents: number, currency = "eur") {
  return new Intl.NumberFormat("es-ES", { style: "currency", currency: currency.toUpperCase() }).format((cents ?? 0) / 100);
}

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  // If it's a subscription checkout, the subscription.* events handle it
  if (session.mode === "subscription") return;

  const m = session.metadata || {};
  let items: any[] = [];
  try {
    items = m.items ? JSON.parse(m.items) : [];
  } catch (_) {
    items = [];
  }

  const customerEmail = session.customer_email || session.customer_details?.email || "unknown@maxrico.es";
  const customerName = m.customerName || session.customer_details?.name || null;
  const totalEur = formatEur(session.amount_total ?? 0, session.currency ?? "eur");
  const itemsForEmail = items.map((it: any) => ({
    name: it.name || it.title || "Producto",
    qty: it.quantity || it.qty || 1,
    price: it.price ? formatEur(Math.round(Number(it.price) * 100), session.currency ?? "eur") : "",
  }));

  await getSupabase().from("orders").upsert(
    {
      stripe_session_id: session.id,
      customer_email: customerEmail,
      customer_name: customerName,
      customer_phone: m.customerPhone || null,
      customer_address: m.customerAddress || null,
      city: m.city || null,
      delivery_method: m.deliveryMethod === "domicilio" ? "domicilio" : "recogida",
      scheduled_for: m.scheduledFor || null,
      items,
      amount_total_cents: session.amount_total ?? 0,
      currency: session.currency ?? "eur",
      status: "pending",
      notes: m.notes || null,
      environment: env,
    },
    { onConflict: "stripe_session_id" },
  );

  // Send order receipt to customer + admin alert (only on paid)
  if (session.payment_status === "paid" && customerEmail !== "unknown@maxrico.es") {
    const commonData = {
      customerName,
      customerEmail,
      customerPhone: m.customerPhone || null,
      orderId: session.id.slice(-8).toUpperCase(),
      totalEur,
      deliveryMethod: m.deliveryMethod === "domicilio" ? "domicilio" : "recogida",
      city: m.city || null,
      address: m.customerAddress || null,
      scheduledFor: m.scheduledFor || null,
      notes: m.notes || null,
      items: itemsForEmail,
      createAccountUrl: `https://maxrico.es/checkout/return?session_id=${session.id}`,
    };
    await sendEmail("order-receipt", customerEmail, `order-receipt-${session.id}`, commonData);
    await sendEmail("order-admin-alert", "clientes@maxrico.es", `order-admin-${session.id}`, commonData);

    // Meta Conversions API — Purchase (dedupe con Pixel del navegador via event_id)
    await sendMetaEvent({
      eventName: "Purchase",
      eventId: `purchase-${session.id}`,
      eventSourceUrl: m.metaUrl || `https://maxrico.es/checkout/return?session_id=${session.id}`,
      user: {
        email: customerEmail,
        phone: m.customerPhone || null,
        firstName: customerName ? String(customerName).split(" ")[0] : null,
        fbp: m.metaFbp || null,
        fbc: m.metaFbc || null,
        clientIpAddress: m.metaIp || null,
        clientUserAgent: m.metaUa || null,
      },
      customData: {
        value: ((session.amount_total ?? 0) / 100),
        currency: (session.currency ?? "eur").toUpperCase(),
        content_ids: items.map((it: any) => it.productId || it.id || it.name).filter(Boolean),
        content_type: "product",
        num_items: items.reduce((s: number, it: any) => s + (it.quantity || it.qty || 1), 0),
        order_id: session.id,
      },
    });
  }
}

async function upsertSubscription(subscription: any, env: StripeEnv) {
  const userId = subscription.metadata?.userId;
  if (!userId) {
    console.error("subscription without userId metadata", subscription.id);
    return;
  }
  const item = subscription.items?.data?.[0];
  const priceId = item?.price?.metadata?.lovable_external_id || item?.price?.id;
  const productId = item?.price?.product;
  const periodStart = item?.current_period_start ?? subscription.current_period_start;
  const periodEnd = item?.current_period_end ?? subscription.current_period_end;

  await getSupabase().from("subscriptions").upsert(
    {
      user_id: userId,
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer,
      product_id: productId,
      price_id: priceId,
      status: subscription.status,
      current_period_start: periodStart ? new Date(periodStart * 1000).toISOString() : null,
      current_period_end: periodEnd ? new Date(periodEnd * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end || false,
      environment: env,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "stripe_subscription_id" },
  );

  // Send welcome email when subscription becomes active (idempotent per subscription)
  if (subscription.status === "active" || subscription.status === "trialing") {
    try {
      const { data: userRes } = await getSupabase().auth.admin.getUserById(userId);
      const email = userRes?.user?.email;
      const name = (userRes?.user?.user_metadata?.full_name as string) || null;
      if (email) {
        await sendEmail("membership-welcome", email, `membership-welcome-${subscription.id}`, { customerName: name });
      }
    } catch (e) {
      console.error("welcome email lookup failed", e);
    }
  }
}

async function markSubscriptionCanceled(subscription: any, env: StripeEnv) {
  await getSupabase()
    .from("subscriptions")
    .update({ status: "canceled", updated_at: new Date().toISOString() })
    .eq("stripe_subscription_id", subscription.id)
    .eq("environment", env);
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405 });

  const rawEnv = new URL(req.url).searchParams.get("env");
  if (rawEnv !== "sandbox" && rawEnv !== "live") {
    return new Response(JSON.stringify({ received: true, ignored: "invalid env" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  const env: StripeEnv = rawEnv;

  try {
    const event = await verifyWebhook(req, env);
    switch (event.type) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(event.data.object, env);
        break;
      case "customer.subscription.created":
      case "customer.subscription.updated":
        await upsertSubscription(event.data.object, env);
        break;
      case "customer.subscription.deleted":
        await markSubscriptionCanceled(event.data.object, env);
        break;
      default:
        console.log("Unhandled event:", event.type);
    }
    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("webhook error", e);
    return new Response("Webhook error", { status: 400 });
  }
});
