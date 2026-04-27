import { createClient } from "npm:@supabase/supabase-js@2";
import { type StripeEnv, verifyWebhook } from "../_shared/stripe.ts";

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

async function handleCheckoutCompleted(session: any, env: StripeEnv) {
  const m = session.metadata || {};
  let items: any[] = [];
  try {
    items = m.items ? JSON.parse(m.items) : [];
  } catch (_) {
    items = [];
  }

  await getSupabase().from("orders").upsert(
    {
      stripe_session_id: session.id,
      customer_email: session.customer_email || session.customer_details?.email || "unknown@maxrico.es",
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
    },
    { onConflict: "stripe_session_id" },
  );
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
    if (event.type === "checkout.session.completed") {
      await handleCheckoutCompleted(event.data.object, env);
    } else {
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
