import { useState, useMemo, useEffect } from "react";
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
  // Modo 1 producto (desde catálogo / ficha)
  product?: Product | null;
  priceId?: string | null;
  // Modo carrito (múltiples productos)
  cartItems?: CartCheckoutItem[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "location" | "delivery" | "schedule" | "form" | "payment" | "waitlist";

const ZARAGOZA_POSTAL_PREFIX = "50";

export function CheckoutWizard({ product, priceId, cartItems, open, onOpenChange }: CheckoutWizardProps) {
  const { isSocio } = useSubscription();
  const { user } = useAuth();
  const [step, setStep] = useState<Step>("location");
  const [postalCode, setPostalCode] = useState("");
  const [city, setCity] = useState("");
  const [delivery, setDelivery] = useState<"recogida" | "domicilio">("recogida");
  const [scheduledFor, setScheduledFor] = useState<string>("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [waitlistSent, setWaitlistSent] = useState(false);

  // Unifica ambos modos: producto único o carrito
  const effectiveItems: CartCheckoutItem[] = useMemo(() => {
    if (cartItems && cartItems.length > 0) return cartItems;
    if (product) return [{ product, quantity: 1 }];
    return [];
  }, [cartItems, product]);

  const totalPrice = useMemo(
    () => effectiveItems.reduce((s, i) => s + i.product.price * i.quantity, 0),
    [effectiveItems],
  );

  const hasFrito = useMemo(
    () => effectiveItems.some((i) => isProductFrito(i.product.id)),
    [effectiveItems],
  );

  const isInZaragoza = postalCode.startsWith(ZARAGOZA_POSTAL_PREFIX);

  // Pre-rellena con datos del usuario si está logueado
  useEffect(() => {
    if (open && user?.email && !email) setEmail(user.email);
  }, [open, user, email]);

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

  // Lead time interno: 1h 15min mínimo.
  // Horario L-S: 11:00 – 22:00. Domingos: 15:30 – 22:00.
  const OPEN_HOUR = 11;
  const SUNDAY_OPEN_HOUR = 15;
  const SUNDAY_OPEN_MIN = 30;
  const CLOSE_HOUR = 22;
  const LEAD_MINUTES = 75;

  const openingFor = (d: Date): { h: number; m: number } => {
    if (d.getDay() === 0) return { h: SUNDAY_OPEN_HOUR, m: SUNDAY_OPEN_MIN };
    return { h: OPEN_HOUR, m: 0 };
  };

  const isBeforeOpening = (d: Date): boolean => {
    const { h, m } = openingFor(d);
    return d.getHours() < h || (d.getHours() === h && d.getMinutes() < m);
  };

  const computeEarliest = (from: Date = new Date()): Date => {
    const d = new Date(from.getTime() + LEAD_MINUTES * 60 * 1000);
    if (isBeforeOpening(d)) {
      const { h, m } = openingFor(d);
      d.setHours(h, m, 0, 0);
      return d;
    }
    if (d.getHours() >= CLOSE_HOUR) {
      d.setDate(d.getDate() + 1);
      const { h, m } = openingFor(d);
      d.setHours(h, m, 0, 0);
      return d;
    }
    return d;
  };

  const toLocalInputValue = (d: Date): string => {
    const off = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
    return off.toISOString().slice(0, 16);
  };

  const minDateTime = useMemo(() => toLocalInputValue(computeEarliest()), [open]);

  const validateSchedule = (iso: string): string | null => {
    if (!iso) return "Selecciona fecha y hora";
    const target = new Date(iso);
    const earliest = computeEarliest();
    if (target.getTime() < earliest.getTime()) {
      return `La hora más cercana disponible es ${earliest.toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}`;
    }
    if (isBeforeOpening(target)) {
      if (target.getDay() === 0) {
        return "Los domingos el horario empieza a las 15:30";
      }
      return `Horario de entregas: ${OPEN_HOUR}:00 – ${CLOSE_HOUR}:00`;
    }
    if (target.getHours() >= CLOSE_HOUR) {
      return `Horario de entregas: hasta las ${CLOSE_HOUR}:00`;
    }
    return null;
  };

  const handleLocationNext = () => {
    const hasExtra = effectiveItems.some((i) => i.product.requiresCombo);
    const hasCombo = effectiveItems.some((i) => i.product.category === "Combos");
    if (hasExtra && !hasCombo) {
      return toast.error("El Extra Chorizo XL solo se puede comprar junto con un combo frito. Añádelo al carrito con un combo.");
    }
    if (postalCode.length < 5) return toast.error("Introduce un código postal válido");
    if (!isInZaragoza) return setStep("waitlist");
    setStep("delivery");
  };

  const handleDeliveryNext = () => setStep("schedule");

  const handleScheduleNext = () => {
    const err = validateSchedule(scheduledFor);
    if (err) return toast.error(err);
    setStep("form");
  };

  const handleSubmitWaitlist = async () => {
    if (!email || !email.includes("@")) return toast.error("Introduce un email válido");
    setLoading(true);
    const { error } = await supabase.from("waitlist_resto_espana").insert({
      email,
      name: name || null,
      phone: phone || null,
      city: city || null,
      postal_code: postalCode || null,
      products_interested: effectiveItems.map((i) => ({ id: i.product.id, name: i.product.name })),
    });
    setLoading(false);
    if (error) return toast.error("No se pudo registrar. Inténtalo de nuevo.");
    setWaitlistSent(true);
    toast.success("¡Te avisaremos cuando lleguemos a tu zona!");
  };

  const handleStartPayment = () => {
    if (!name || !email || !phone) return toast.error("Completa nombre, email y teléfono");
    if (delivery === "domicilio" && !address) return toast.error("Indica la dirección de entrega");
    if (effectiveItems.length === 0) return toast.error("No hay productos para pagar");
    // Meta Pixel — InitiateCheckout
    import("@/lib/metaPixel").then(({ metaTrack, metaEventId }) => {
      metaTrack(
        "InitiateCheckout",
        {
          content_ids: effectiveItems.map((i) => i.product.id),
          contents: effectiveItems.map((i) => ({ id: i.product.id, quantity: i.quantity, item_price: i.product.price })),
          num_items: effectiveItems.reduce((s, i) => s + i.quantity, 0),
          value: Number(totalPrice.toFixed(2)),
          currency: "EUR",
        },
        metaEventId("ic", Date.now()),
      );
    });
    setStep("payment");
  };

  const fetchClientSecret = async (): Promise<string> => {
    if (effectiveItems.length === 0) throw new Error("Sin productos");

    const items = effectiveItems.map((i) => {
      const pid = priceId && effectiveItems.length === 1 ? priceId : getPriceId(i.product.id);
      if (!pid) throw new Error(`Producto sin precio configurado: ${i.product.name}`);
      return {
        priceId: pid,
        productId: i.product.id,
        name: i.product.name,
        quantity: i.quantity,
        price: i.product.price,
      };
    });

    // Captura cookies de Meta Pixel para Conversions API (dedupe entre Pixel y CAPI)
    const readCookie = (name: string): string | undefined => {
      const m = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
      return m ? decodeURIComponent(m[1]) : undefined;
    };
    const fbp = readCookie("_fbp");
    const fbc = readCookie("_fbc");
    const userAgent = typeof navigator !== "undefined" ? navigator.userAgent : undefined;
    const eventSourceUrl = typeof window !== "undefined" ? window.location.href : undefined;

    const { data, error } = await supabase.functions.invoke("create-checkout", {
      body: {
        items,
        customerEmail: email,
        customerName: name,
        customerPhone: phone,
        customerAddress: delivery === "domicilio" ? address : null,
        city: city || "Zaragoza",
        deliveryMethod: delivery,
        scheduledFor: scheduledFor ? new Date(scheduledFor).toISOString() : null,
        notes,
        userId: user?.id,
        returnUrl: `${window.location.origin}/checkout/return?session_id={CHECKOUT_SESSION_ID}`,
        environment: getStripeEnvironment(),
        meta: { fbp, fbc, userAgent, eventSourceUrl },
      },
    });
    if (error || !data?.clientSecret) throw new Error(error?.message || "No se pudo iniciar el pago");
    return data.clientSecret;
  };

  const title = product?.name ?? (effectiveItems.length > 1 ? `Tu pedido (${effectiveItems.reduce((s,i)=>s+i.quantity,0)} productos)` : "Comprar");

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-black">{title}</DialogTitle>
          <DialogDescription>
            {step === "location" && "1 / 4 · ¿A dónde lo enviamos?"}
            {step === "delivery" && "2 / 4 · ¿Cómo prefieres recibirlo?"}
            {step === "schedule" && "3 / 4 · ¿Cuándo lo quieres?"}
            {step === "form" && "4 / 4 · Tus datos de contacto"}
            {step === "payment" && "Paga con tarjeta de forma segura"}
            {step === "waitlist" && "Aún no llegamos a tu zona"}
          </DialogDescription>
        </DialogHeader>

        {step === "location" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <MapPin className="h-5 w-5 text-yellow-700 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-yellow-900">
                Actualmente solo entregamos pedidos en <strong>Zaragoza capital y alrededores</strong>. Si estás fuera de esta zona, consulta la cobertura de envío con nuestro asistente virtual.
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
            <Button onClick={handleLocationNext} className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Continuar</Button>
          </div>
        )}

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

        {step === "schedule" && (
          <div className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Clock className="h-5 w-5 text-orange-700 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-orange-900 space-y-1">
                <p>Elige cuándo quieres <strong>{delivery === "domicilio" ? "recibir" : "recoger"}</strong> tu pedido.</p>
                <p>Horario de {delivery === "domicilio" ? "entregas" : "recogida"}: <strong>Lunes a Sábado 11:00 – 22:00</strong>.</p>
                <p>Domingos: <strong>15:30 – 22:00</strong>.</p>
                {hasFrito && (
                  <p className="text-orange-800">Tu pedido incluye <strong>productos fritos recién hechos</strong>: los preparamos al momento.</p>
                )}
              </div>
            </div>
            <div>
              <Label htmlFor="when">Fecha y hora *</Label>
              <Input id="when" type="datetime-local" min={minDateTime} value={scheduledFor} onChange={(e) => setScheduledFor(e.target.value)} />
              <p className="text-xs text-muted-foreground mt-1">
                La hora más cercana disponible es {new Date(minDateTime).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setStep("delivery")} className="flex-1">Atrás</Button>
              <Button onClick={handleScheduleNext} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold">Continuar</Button>
            </div>
          </div>
        )}

        {step === "form" && (
          <div className="space-y-3">
            {effectiveItems.length > 1 && (
              <div className="p-3 bg-secondary rounded-lg text-sm">
                <p className="font-bold mb-1">Resumen ({effectiveItems.reduce((s,i)=>s+i.quantity,0)} productos)</p>
                {effectiveItems.map(({ product: p, quantity }) => (
                  <div key={p.id} className="flex justify-between text-xs">
                    <span>{quantity} × {p.name}</span>
                    <span className="font-semibold">{(p.price * quantity).toFixed(2)}€</span>
                  </div>
                ))}
                <div className="flex justify-between font-black mt-2 pt-2 border-t">
                  <span>Total</span><span>{totalPrice.toFixed(2)}€</span>
                </div>
              </div>
            )}
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
              <Button variant="outline" onClick={() => setStep("schedule")} className="flex-1">Atrás</Button>
              <Button onClick={handleStartPayment} className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                Pagar {totalPrice.toFixed(2)}€
              </Button>
            </div>
          </div>
        )}

        {step === "payment" && effectiveItems.length > 0 && (
          <div id="checkout" className="min-h-[500px]">
            <EmbeddedCheckoutProvider stripe={getStripe()} options={{ fetchClientSecret }}>
              <EmbeddedCheckout />
            </EmbeddedCheckoutProvider>
          </div>
        )}

        {step === "waitlist" && (
          <div className="space-y-4">
            {!waitlistSent ? (
              <>
                <div className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-700 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-900">
                    Parece que estás fuera de <strong>Zaragoza capital y alrededores</strong>. Consulta la cobertura de envío con nuestro asistente virtual. También puedes dejarnos tu email y te avisamos cuando ampliemos zona.
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
