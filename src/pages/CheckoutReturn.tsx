import { useEffect, useMemo, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { CheckCircle2, Crown, Loader2, Mail, MessageCircle, Printer, ReceiptText, UserPlus, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import { buildOrderWhatsAppMessage, formatCurrency, formatDateTime, getOrderItemDetails, type OrderItemLike } from "@/lib/orderUtils";
import { metaTrack } from "@/lib/metaPixel";

const WHATSAPP_NUMBER = "34695798632";

interface OrderReceipt {
  id: string;
  stripe_session_id: string | null;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  city: string | null;
  delivery_method: string;
  scheduled_for: string | null;
  items: OrderItemLike[];
  amount_total_cents: number;
  currency: string;
  status: string;
  notes: string | null;
  created_at: string;
}

export default function CheckoutReturn() {
  const [params] = useSearchParams();
  const sessionId = params.get("session_id");
  const type = params.get("type");
  const isSocio = type === "socio";
  const [order, setOrder] = useState<OrderReceipt | null>(null);
  const [loadingOrder, setLoadingOrder] = useState(Boolean(sessionId && !isSocio));
  const [orderError, setOrderError] = useState<string | null>(null);
  const { user } = useAuth();
  const { clearCart } = useCart();
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  const sameEmailAsUser = Boolean(user?.email && order?.customer_email && user.email.toLowerCase() === order.customer_email.toLowerCase());

  // Vaciar carrito una vez confirmado el pago + Meta Pixel Purchase (dedupe con CAPI por event_id)
  useEffect(() => {
    if (order && order.status === "paid") {
      clearCart();
      const ref = order.stripe_session_id || order.id;
      metaTrack(
        "Purchase",
        {
          value: Number(((order.amount_total_cents ?? 0) / 100).toFixed(2)),
          currency: (order.currency || "eur").toUpperCase(),
          content_ids: (order.items || []).map((it) => getOrderItemDetails(it).name),
          content_type: "product",
          num_items: (order.items || []).reduce((s, it) => s + (getOrderItemDetails(it).quantity || 1), 0),
        },
        `purchase-${ref}`,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [order?.id, order?.status]);

  const handleMagicLink = async () => {
    if (!order?.customer_email) return;
    setMagicLoading(true);
    const { error } = await supabase.auth.signInWithOtp({
      email: order.customer_email,
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/`,
        data: order.customer_name ? { full_name: order.customer_name, phone: order.customer_phone ?? undefined } : undefined,
      },
    });
    setMagicLoading(false);
    if (error) {
      toast.error("No pudimos enviar el enlace", { description: error.message });
      return;
    }
    setMagicSent(true);
    toast.success("Revisa tu correo", { description: `Enviamos un enlace a ${order.customer_email}` });
  };

  useEffect(() => {
    if (!sessionId || isSocio) return;

    let cancelled = false;
    const loadOrder = async () => {
      setLoadingOrder(true);
      setOrderError(null);
      const { data, error } = await supabase.functions.invoke("get-order-status", {
        body: { sessionId },
      });

      if (cancelled) return;
      if (error) {
        setOrderError("Tu pago fue recibido, pero no pudimos cargar el comprobante completo en este momento.");
      } else if (data?.order) {
        setOrder(data.order);
      } else {
        setOrderError("Tu pago fue recibido. Estamos terminando de registrar el pedido; guarda esta referencia y contáctanos por WhatsApp si necesitas confirmarlo ahora.");
      }
      setLoadingOrder(false);
    };

    loadOrder();
    return () => {
      cancelled = true;
    };
  }, [sessionId, isSocio]);

  const whatsappMessage = useMemo(() => {
    if (order) return buildOrderWhatsAppMessage(order);
    return `Hola MaxRico, acabo de pagar mi pedido y quiero confirmar la entrega. Referencia: ${(sessionId || "").slice(-8).toUpperCase()}`;
  }, [order, sessionId]);

  const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-2xl w-full text-center space-y-6 bg-white rounded-2xl shadow-lg p-8 border print:shadow-none print:border-0">
        {isSocio ? (
          <>
            <Crown className="h-20 w-20 text-primary mx-auto fill-primary" />
            <h1 className="text-3xl font-black text-foreground">¡Bienvenido al Club!</h1>
            <p className="text-muted-foreground">
              Ya eres socio de <span translate="no" className="notranslate font-bold">MaxRico</span>. Tus precios de socio se aplican automáticamente en todo el catálogo.
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-20 w-20 text-green-500 mx-auto" />
            <h1 className="text-3xl font-black text-foreground">¡Pago recibido!</h1>
            <p className="text-muted-foreground">
              Gracias por tu compra en <span translate="no" className="notranslate font-bold">MaxRico</span>. Tu pedido quedó registrado correctamente.
            </p>
          </>
        )}

        {!isSocio && (
          <div className="space-y-4 text-left">
            {loadingOrder && (
              <Card className="bg-yellow-50 border-yellow-200">
                <CardContent className="p-4 flex items-center gap-3 text-yellow-900">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span className="text-sm font-semibold">Preparando tu comprobante de pedido...</span>
                </CardContent>
              </Card>
            )}

            {orderError && (
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4 text-sm text-orange-900">{orderError}</CardContent>
              </Card>
            )}

            {order && (
              <Card className="overflow-hidden text-left">
                <div className="bg-yellow-400 px-5 py-3 text-black font-black flex items-center gap-2">
                  <ReceiptText className="h-5 w-5" /> Comprobante de pedido pagado
                </div>
                <CardContent className="p-5 space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground">Referencia</p>
                      <p className="font-mono font-bold">{(order.stripe_session_id || order.id).slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Estado</p>
                      <p className="font-bold text-green-700">Pagado correctamente</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Cliente</p>
                      <p className="font-semibold">{order.customer_name || "Cliente"}</p>
                      <p>{order.customer_email}</p>
                      {order.customer_phone && <p>{order.customer_phone}</p>}
                    </div>
                    <div>
                      <p className="text-muted-foreground">Entrega</p>
                      <p className="font-semibold">{order.delivery_method === "domicilio" ? "Domicilio" : "Recogida en local"}</p>
                      {order.customer_address && <p>{order.customer_address}</p>}
                      {order.city && <p>{order.city}</p>}
                      {order.scheduled_for && <p>{formatDateTime(order.scheduled_for)}</p>}
                    </div>
                  </div>

                  <div className="border-t pt-4">
                    <p className="font-black mb-2">Productos</p>
                    <div className="space-y-2">
                      {(order.items || []).map((item, index) => {
                        const details = getOrderItemDetails(item);
                        return (
                          <div key={`${details.name}-${index}`} className="flex items-center justify-between gap-3 text-sm">
                            <span>{details.quantity} x {details.name}</span>
                            {details.unitPrice && <span className="font-semibold">{details.unitPrice.toFixed(2)}€</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {order.notes && (
                    <div className="border-t pt-4 text-sm">
                      <p className="font-black mb-1">Notas del pedido</p>
                      <p>{order.notes}</p>
                    </div>
                  )}

                  <div className="border-t pt-4 flex items-center justify-between text-lg">
                    <span className="font-black">Total pagado</span>
                    <span className="font-black">{formatCurrency(order.amount_total_cents, order.currency)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-green-50 border-green-200 print:hidden">
              <CardContent className="p-4 text-sm text-green-900 flex gap-3">
                <Mail className="h-5 w-5 shrink-0 mt-0.5" />
                <p>
                  Te hemos enviado el comprobante de este pedido por correo electrónico. Si no lo ves en unos minutos, revisa la carpeta de spam o confírmanos por WhatsApp.
                </p>
              </CardContent>
            </Card>

            {order?.customer_email && sameEmailAsUser && (
              <Card className="bg-blue-50 border-blue-200 print:hidden">
                <CardContent className="p-4 text-sm text-blue-900 flex gap-3">
                  <CheckCheck className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>
                    Este pedido se ha añadido a tu cuenta. Puedes ver tu historial cuando quieras iniciando sesión con <strong>{order.customer_email}</strong>.
                  </p>
                </CardContent>
              </Card>
            )}

            {order?.customer_email && !user && !magicSent && (
              <Card className="bg-yellow-50 border-yellow-300 print:hidden">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-start gap-3">
                    <UserPlus className="h-6 w-6 text-yellow-700 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-black text-base">¿Quieres seguir tus pedidos y acumular beneficios de socio?</p>
                      <p className="text-sm text-yellow-900 mt-1">
                        Crea tu cuenta con 1 clic. Te enviamos un enlace mágico a <strong>{order.customer_email}</strong> — sin contraseñas.
                      </p>
                    </div>
                  </div>
                  <Button
                    onClick={handleMagicLink}
                    disabled={magicLoading}
                    className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
                  >
                    {magicLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Crear mi cuenta con 1 clic
                  </Button>
                  <p className="text-xs text-yellow-800 text-center">
                    Si ya tienes cuenta, el mismo enlace te inicia sesión y vincula este pedido.
                  </p>
                </CardContent>
              </Card>
            )}

            {magicSent && (
              <Card className="bg-green-50 border-green-300 print:hidden">
                <CardContent className="p-4 text-sm text-green-900 flex gap-3">
                  <CheckCheck className="h-5 w-5 shrink-0 mt-0.5" />
                  <p>
                    Enlace enviado a <strong>{order?.customer_email}</strong>. Ábrelo desde tu correo para entrar en tu cuenta.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {sessionId && (
          <p className="text-xs text-muted-foreground font-mono break-all">
            Ref: {sessionId}
          </p>
        )}
        <div className="flex flex-col gap-2">
          {!isSocio && (
            <>
              <Button asChild className="bg-green-600 hover:bg-green-700 text-white font-bold print:hidden">
                <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-4 w-4 mr-2" /> Confirmar entrega por WhatsApp
                </a>
              </Button>
              <Button type="button" variant="outline" onClick={() => window.print()} className="print:hidden">
                <Printer className="h-4 w-4 mr-2" /> Imprimir o guardar comprobante
              </Button>
            </>
          )}
          <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
            <Link to="/catalogo">{isSocio ? "Ver catálogo con mis precios" : "Seguir comprando"}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/">Ir al inicio</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

