import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export default function Unsubscribe() {
  const [params] = useSearchParams();
  const token = params.get("token");
  const [state, setState] = useState<"loading" | "valid" | "invalid" | "already" | "done" | "error">("loading");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setState("invalid"); return; }
    (async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_KEY } },
        );
        const data = await res.json();
        if (!res.ok) { setState("invalid"); return; }
        if (data.valid) setState("valid");
        else if (data.reason === "already_unsubscribed") setState("already");
        else setState("invalid");
      } catch { setState("error"); }
    })();
  }, [token]);

  const handleConfirm = async () => {
    if (!token) return;
    setSubmitting(true);
    try {
      const { data, error } = await supabase.functions.invoke("handle-email-unsubscribe", { body: { token } });
      if (error) { setState("error"); return; }
      if (data?.success) setState("done");
      else if (data?.reason === "already_unsubscribed") setState("already");
      else setState("error");
    } finally { setSubmitting(false); }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <Card className="max-w-md w-full p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold">Cancelar suscripción</h1>
        {state === "loading" && <p className="text-muted-foreground">Validando enlace…</p>}
        {state === "valid" && (
          <>
            <p className="text-muted-foreground">¿Quieres dejar de recibir emails de Max Rico?</p>
            <Button onClick={handleConfirm} disabled={submitting} variant="destructive" className="w-full">
              {submitting ? "Procesando…" : "Confirmar baja"}
            </Button>
          </>
        )}
        {state === "done" && <p className="text-green-700">Listo. Ya no recibirás más emails.</p>}
        {state === "already" && <p className="text-muted-foreground">Ya estabas dado de baja.</p>}
        {state === "invalid" && <p className="text-destructive">Enlace inválido o caducado.</p>}
        {state === "error" && <p className="text-destructive">Ha ocurrido un error. Inténtalo más tarde.</p>}
      </Card>
    </div>
  );
}
