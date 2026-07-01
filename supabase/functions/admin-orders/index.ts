import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_EMAILS = new Set([
  "clientes@maxrico.es",
  "maxrico@maxrico.es",
  "alvarodavid3062@gmail.com",
  "exododigital21@gmail.com",
]);

const ALLOWED_STATUSES = new Set(["pending", "paid", "preparing", "ready", "completed", "cancelled"]);

async function requireAdmin(req: Request) {
  const token = req.headers.get("Authorization")?.replace("Bearer ", "").trim();
  if (!token) throw new Error("NO_TOKEN");

  const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user?.email) throw new Error("INVALID_USER");

  const email = data.user.email.toLowerCase();
  if (!ADMIN_EMAILS.has(email)) throw new Error("NOT_ADMIN");

  return { supabase, user: data.user };
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
    const { supabase } = await requireAdmin(req);
    const body = await req.json().catch(() => ({}));
    const action = body.action || "list";

    if (action === "update-status") {
      const orderId = body.orderId;
      const status = body.status;
      if (!orderId || !ALLOWED_STATUSES.has(status)) {
        return new Response(JSON.stringify({ error: "Datos de actualización no válidos" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select("*")
        .single();

      if (error) throw error;
      return new Response(JSON.stringify({ order: data }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const statusFilter = body.status;
    let query = supabase.from("orders").select("*").order("created_at", { ascending: false }).limit(100);
    if (statusFilter && statusFilter !== "all") query = query.eq("status", statusFilter);

    const { data, error } = await query;
    if (error) throw error;

    return new Response(JSON.stringify({ orders: data || [] }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "UNKNOWN";
    const status = message === "NOT_ADMIN" ? 403 : message === "NO_TOKEN" || message === "INVALID_USER" ? 401 : 500;
    console.error("admin-orders error", message);
    return new Response(JSON.stringify({ error: "No autorizado" }), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});