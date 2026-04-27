import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface MembershipCheckoutProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function MembershipCheckout({ open, onOpenChange }: MembershipCheckoutProps) {
  const { user } = useAuth();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !user) {
      setClientSecret(null);
      setError(null);
      return;
    }
    let cancelled = false;
    (async () => {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          items: [{ priceId: "socio_anual_59", quantity: 1 }],
          deliveryMethod: "recogida", // requerido por el endpoint, irrelevante para suscripciones
          customerEmail: user.email,
          userId: user.id,
          returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}&type=socio`,
          environment: getStripeEnvironment(),
        },
      });
      if (cancelled) return;
      if (error || !data?.clientSecret) {
        setError(error?.message || "No pudimos abrir el pago");
        return;
      }
      setClientSecret(data.clientSecret);
    })();
    return () => {
      cancelled = true;
    };
  }, [open, user]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Hazte socio del Club <span translate="no" className="notranslate">MaxRico</span></DialogTitle>
          <DialogDescription>59€ al año · Acceso inmediato a precios de socio</DialogDescription>
        </DialogHeader>

        {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded">{error}</div>}

        {!clientSecret && !error && (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" /> Cargando pago seguro...
          </div>
        )}

        {clientSecret && (
          <div id="checkout">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ clientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
