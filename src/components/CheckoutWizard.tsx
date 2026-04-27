import { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { EmbeddedCheckoutProvider, EmbeddedCheckout } from "@stripe/react-stripe-js";
import { getStripe, getStripeEnvironment } from "@/lib/stripe";
import { supabase } from "@/integrations/supabase/client";
import { isProductFrito, getPriceId } from "@/data/priceIds";
import { Product } from "@/data/products";
import { useSubscription } from "@/hooks/useSubscription";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, Truck, Store, Clock, AlertTriangle, Loader2 } from "lucide-react";
import { toast } from "sonner";

export interface CartCheckoutItem {
  product: Product;
  quantity: number;
}

interface CheckoutWizardProps {
  // Modo 1 producto (legacy, desde catálogo)
  product?: Product | null;
  priceId?: string | null;
  // Modo carrito (múltiples productos)
  cartItems?: CartCheckoutItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "location" | "delivery" | "schedule" | "form" | "payment" | "waitlist";

const ZARAGOZA_POSTAL_PREFIX = "50"; // Zaragoza province postal codes

export function CheckoutWizard({ product, priceId, cartItems, open, onOpenChange }: CheckoutWizardProps) {
  const { isSocio } = useSubscription();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("location");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [delivery, setDelivery] = useState<"recogida" | "domicilio">("recogida");
  const [scheduledFor, setScheduledFor] = useState<string>(""); // datetime-local
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistSent, setWaitlistSent] = useState(false);

  const isFrito = product ? isProductFrito(product.id) : false;
  const isInZaragoza = postalCode.startsWith(ZARAGOZA_POSTAL_PREFIX);

  const reset = () => {
    setStep("location");
    setPostalCode("");
    setCity("");
    setDelivery("recogida");
    setScheduledFor("");
    setName("");
    setEmail("");
    setPhone("");
    setAddress("");
    setNotes("");
    setLoading(false);
    setWaitlistSent(false);
  };

  const handleClose = (o: boolean) => {
    if (!o) reset();
    onOpenChange(o);
  };

  // Compute min datetime for fritos (now + 2h)
  const minDateTime = useMemo(() => {
    const d = new Date(Date.now() + 2 * 60 * 60 * 1000);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  }, [open]);

  const validateFritoSchedule = (iso: string): string | null => {
    if (!iso) return "Selecciona fecha y hora";
    const target = new Date(iso);
    const now = new Date();
    const diffH = (target.getTime() - now.getTime()) / 3_600_000;
    if (diffH < 2) return "Mínimo 2 horas de antelación";
    const h = target.getHours();
    const inComida = h >= 12 && h < 17;
    const inCena = h >= 19 && h < 23;
    if (!inComida && !inCena) {
      return "Horario disponible: comida (12:00–17:00) o cena (19:00–23:00)";
    }
    return null;
  };

  const handleLocationNext = () => {
    if (postalCode.length < 5) {
      toast.error("Introduce un código postal válido");
      return;
    }
    if (!isInZaragoza) {
      // Resto de España: bloqueo + waitlist
      setStep("waitlist");
      return;
    }
    setStep("delivery");
  };

  const handleDeliveryNext = () => {
    if (isFrito) setStep("schedule");
    else setStep("form");
  };

  const handleScheduleNext = () => {
    const err = validateFritoSchedule(scheduledFor);
    if (err) {
      toast.error(err);
      return;
    }
    setStep("form");
  };

  const handleSubmitWaitlist = async () => {
    if (!email || !email.includes("@")) {
      toast.error("Introduce un email válido");
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("waitlist_resto_espana").insert({
      email,
      name: name || null,
      phone: phone || null,
      city: city || null,
      postal_code: postalCode || null,
      products_interested: product ? [{ id: product.id, name: product.name }] : [],
    });
    setLoading(false);
    if (error) {
      toast.error("No se pudo registrar. Inténtalo de nuevo.");
      return;
    }
    setWaitlistSent(true);
    toast.success("¡Te avisaremos cuando lleguemos a tu zona!");
  };

  const handleStartPayment = () => {
    if (!name || !email || !phone) {
      toast.error("Completa nombre, email y teléfono");
      return;
    }
    if (delivery === "domicilio" && !address) {
      toast.error("Indica la dirección de entrega");
      return;
    }
    setStep("payment");
  };

  const fetchClientSecret = async (): Promise<string> => {
    if (!priceId || !product) throw new Error("Sin producto");
    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        items: [{ priceId, quantity: 1 }],
        customerEmail: email,
        customerName: name,
        customerPhone: phone,
        customerAddress: delivery === "domicilio" ? address : null,
        city: city || "Zaragoza",
        deliveryMethod: delivery,
        scheduledFor: isFrito && scheduledFor ? new Date(scheduledFor).toISOString() : null,
        notes,
        userId: user?.id,
        returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
      },
    });
    if (error || !data?.clientSecret) {
      throw new Error(error?.message || "No se pudo iniciar el pago");
    }
    return data.clientSecret;
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">
            {product?.name ?? "Comprar"}
          </DialogTitle>
          <DialogDescription>
            {step === "location" && "1 / 3 · ¿A dónde lo enviamos?"}
            {step === "delivery" && "2 / 3 · ¿Cómo prefieres recibirlo?"}
            {step === "schedule" && "3 / 3 · ¿Cuándo lo necesitas?"}
            {step === "form" && "Casi listo · Tus datos de contacto"}
            {step === "payment" && "Paga con tarjeta de forma segura"}
            {step === "waitlist" && "Aún no llegamos a tu zona"}
          </DialogDescription>
        </DialogHeader>

        {/* STEP 1: LOCATION */}
        {step === "location" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <MapPin className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-900">
                Actualmente solo entregamos en <strong>Zaragoza capital y provincia</strong> (códigos postales que empiezan por 50).
              </p>
            </div>
            <div>
              <Label htmlFor="cp">Código postal *</Label>
              <Input id="cp" value={postalCode} onChange={(e) => setPostalCode(e.target.value.replace(/\D/g, "").slice(0, 5))} placeholder="50001" inputMode="numeric" />
            </div>
            <div>
              <Label htmlFor="city">Ciudad / Localidad</Label>
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} placeholder="Zaragoza" />
            </div>
            <Button onClick={handleLocationNext} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
              Continuar
            </Button>
          </div>
        )}

        {/* STEP 2: DELIVERY METHOD */}
        {step === "delivery" && (
          <div className="space-y-4">
            <RadioGroup value={delivery} onValueChange={(v) => setDelivery(v as any)}>
              <label htmlFor="r-recogida" className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/40 has-[:checked]:border-yellow-400 has-[:checked]:bg-yellow-50">
                <RadioGroupItem value="recogida" id="r-recogida" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold"><Store className="h-4 w-4" /> Recogida en local</div>
                  <p className="text-sm text-muted-foreground mt-1">Recoge tu pedido en nuestro punto de Zaragoza. Sin coste de envío.</p>
                </div>
              </label>
              <label htmlFor="r-domicilio" className="flex items-start gap-3 p-4 border-2 rounded-lg cursor-pointer hover:bg-muted/40 has-[:checked]:border-yellow-400 has-[:checked]:bg-yellow-50">
                <RadioGroupItem value="domicilio" id="r-domicilio" className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold"><Truck className="h-4 w-4" /> Domicilio en Zaragoza</div>
                  <p className="text-sm text-muted-foreground mt-1">Te lo llevamos a casa. Coordinamos la hora por WhatsApp.</p>
                </div>
              </label>
            </RadioGroup>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("location")} className="flex-1">Atrás</Button>
              <Button onClick={handleDeliveryNext} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Continuar</Button>
            </div>
          </div>
        )}

        {/* STEP 3: SCHEDULE (only fritos) */}
        {step === "schedule" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Clock className="h-5 w-5 text-orange-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-900 space-y-1">
                <p><strong>Producto frito recién hecho.</strong> Los pedidos para hoy requieren <strong>mínimo 2 horas de antelación</strong> para garantizar la entrega.</p>
                <p>Horario disponible: <strong>comida (12:00–17:00)</strong> o <strong>cena (19:00–23:00)</strong>. También puedes reservar para cualquier día futuro.</p>
              </div>
            </div>
            <div>
              <Label htmlFor="when">Fecha y hora *</Label>
              <Input id="when" type="datetime-local" min={minDateTime} value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("delivery")} className="flex-1">Atrás</Button>
              <Button onClick={handleScheduleNext} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Continuar</Button>
            </div>
          </div>
        )}

        {/* STEP 4: CONTACT FORM */}
        {step === "form" && (
          <div className="space-y-3">
            <div>
              <Label htmlFor="name">Nombre completo *</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <Label htmlFor="phone">Teléfono *</Label>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} />
            </div>
            {delivery === "domicilio" && (
              <div>
                <Label htmlFor="addr">Dirección de entrega *</Label>
                <Input id="addr" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Calle, número, piso" />
              </div>
            )}
            <div>
              <Label htmlFor="notes">Notas (opcional)</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Alergias, instrucciones, etc." />
            </div>
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setStep(isFrito ? "schedule" : "delivery")} className="flex-1">Atrás</Button>
              <Button onClick={handleStartPayment} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                Pagar {product?.price.toFixed(2)}€
              </Button>
            </div>
          </div>
        )}

        {/* STEP 5: PAYMENT */}
        {step === "payment" && priceId && (
          <div id="checkout" className="min-h-[500px]">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {/* STEP 6: WAITLIST (resto de España) */}
        {step === "waitlist" && (
          <div className="space-y-4">
            {!waitlistSent ? (
              <>
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">
                    Por ahora solo entregamos en <strong>Zaragoza</strong>. Déjanos tu email y te avisamos en cuanto lleguemos a tu zona.
                  </p>
                </div>
                <div>
                  <Label htmlFor="w-name">Nombre</Label>
                  <Input id="w-name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="w-email">Email *</Label>
                  <Input id="w-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                  <Label htmlFor="w-city">Ciudad</Label>
                  <Input id="w-city" value={city} onChange={(e) => setCity(e.target.value)} />
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setStep("location")} className="flex-1">Atrás</Button>
                  <Button onClick={handleSubmitWaitlist} disabled={loading} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                    {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />} Avisarme
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8 space-y-3">
                <div className="text-5xl">🎉</div>
                <p className="font-bold text-lg">¡Listo, te tenemos en la lista!</p>
                <p className="text-sm text-muted-foreground">Te escribiremos a {email} cuando lleguemos a tu zona.</p>
                <Button onClick={() => handleClose(false)} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Cerrar</Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
