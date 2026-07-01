import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, CheckCircle2, Clock, Loader2, MessageCircle, PackageCheck, Printer, RefreshCw, Search, Truck } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { isAdminEmail } from "@/lib/admin";
import { buildOrderWhatsAppMessage, formatCurrency, formatDateTime, getOrderItemDetails, type OrderItemLike } from "@/lib/orderUtils";
import { toast } from "sonner";

const WHATSAPP_NUMBER = "34695798632";

type OrderStatus = "pending" | "paid" | "preparing" | "ready" | "completed" | "cancelled";

interface AdminOrder {
  id: string;
  stripe_session_id: string | null;
  customer_email: string;
  customer_name: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  city: string | null;
  delivery_method: "recogida" | "domicilio";
  scheduled_for: string | null;
  items: OrderItemLike[];
  amount_total_cents: number;
  currency: string;
  status: OrderStatus;
  notes: string | null;
  environment: string;
  created_at: string;
  updated_at: string;
}

const statusLabel: Record<OrderStatus, string> = {
  pending: "Pendiente",
  paid: "Pagado",
  preparing: "Preparando",
  ready: "Listo",
  completed: "Entregado",
  cancelled: "Cancelado",
};

const statusClasses: Record<OrderStatus, string> = {
  pending: "bg-orange-100 text-orange-800 border-orange-200",
  paid: "bg-green-100 text-green-800 border-green-200",
  preparing: "bg-blue-100 text-blue-800 border-blue-200",
  ready: "bg-yellow-100 text-yellow-900 border-yellow-200",
  completed: "bg-slate-100 text-slate-800 border-slate-200",
  cancelled: "bg-red-100 text-red-800 border-red-200",
};

export default function AdminOrders() {
  const { user, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");
  const isAdmin = isAdminEmail(user?.email);

  const loadOrders = async () => {
    if (!isAdmin) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("admin-orders", {
      body: { action: "list", status: statusFilter },
    });
    setLoading(false);

    if (error) {
      toast.error("No pudimos cargar los pedidos");
      return;
    }
    setOrders(data?.orders || []);
  };

  useEffect(() => {
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin, statusFilter]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    const previous = orders;
    setOrders((current) => current.map((order) => (order.id === orderId ? { ...order, status } : order)));

    const { error } = await supabase.functions.invoke("admin-orders", {
      body: { action: "update-status", orderId, status },
    });

    if (error) {
      setOrders(previous);
      toast.error("No pudimos actualizar el estado");
      return;
    }
    toast.success("Estado actualizado");
  };

  const filteredOrders = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return orders;
    return orders.filter((order) => {
      const ref = (order.stripe_session_id || order.id).slice(-8).toLowerCase();
      return [order.customer_name, order.customer_email, order.customer_phone, order.customer_address, order.city, ref]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(term));
    });
  }, [orders, search]);

  const stats = useMemo(() => {
    const paidToday = orders.filter((order) => order.status !== "cancelled").length;
    const total = orders.reduce((sum, order) => sum + (order.status === "cancelled" ? 0 : order.amount_total_cents), 0);
    const active = orders.filter((order) => !["completed", "cancelled"].includes(order.status)).length;
    return { paidToday, total, active };
  }, [orders]);

  if (authLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto" />
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 max-w-md text-center">
          <Card>
            <CardContent className="p-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-yellow-600 mx-auto" />
              <h1 className="text-2xl font-black">Acceso de administración</h1>
              <p className="text-muted-foreground">Inicia sesión con el correo autorizado para ver los pedidos.</p>
              <Button asChild className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
                <Link to="/auth?next=/admin/pedidos">Iniciar sesión</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 max-w-md text-center">
          <Card>
            <CardContent className="p-8 space-y-4">
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
              <h1 className="text-2xl font-black">No autorizado</h1>
              <p className="text-muted-foreground">Tu cuenta {user.email} no tiene permiso para administrar pedidos.</p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <p className="text-sm font-bold text-yellow-700 uppercase tracking-wide">Panel MaxRico</p>
            <h1 className="text-3xl font-black">Pedidos pagados</h1>
            <p className="text-muted-foreground">Aquí ves cada pedido que entra por tarjeta aunque el correo automático esté bloqueado.</p>
          </div>
          <div className="flex gap-2 print:hidden">
            <Button variant="outline" onClick={() => window.print()}>
              <Printer className="h-4 w-4 mr-2" /> Imprimir
            </Button>
            <Button onClick={loadOrders} disabled={loading} className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold">
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCw className="h-4 w-4 mr-2" />} Actualizar
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <CheckCircle2 className="h-9 w-9 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">Pedidos cargados</p>
                <p className="text-2xl font-black">{stats.paidToday}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <Clock className="h-9 w-9 text-yellow-600" />
              <div>
                <p className="text-sm text-muted-foreground">Activos por preparar</p>
                <p className="text-2xl font-black">{stats.active}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 flex items-center gap-3">
              <PackageCheck className="h-9 w-9 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Importe visible</p>
                <p className="text-2xl font-black">{formatCurrency(stats.total, "eur")}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="print:hidden">
          <CardContent className="p-4 grid md:grid-cols-[1fr_220px] gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar por cliente, teléfono, dirección o referencia..." className="pl-9" />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                {Object.entries(statusLabel).map(([value, label]) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {loading && orders.length === 0 ? (
          <div className="text-center py-16">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" />
            <p className="text-muted-foreground">Cargando pedidos...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <Card>
            <CardContent className="p-10 text-center text-muted-foreground">No hay pedidos con esos filtros.</CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => {
              const reference = (order.stripe_session_id || order.id).slice(-8).toUpperCase();
              const whatsappHref = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(buildOrderWhatsAppMessage(order))}`;

              return (
                <Card key={order.id} className="overflow-hidden">
                  <CardHeader className="p-5 bg-muted/40">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div>
                        <CardTitle className="text-xl flex flex-wrap items-center gap-2">
                          Pedido #{reference}
                          <Badge variant="outline" className={statusClasses[order.status]}>{statusLabel[order.status]}</Badge>
                          {order.environment === "sandbox" && <Badge variant="outline">Prueba</Badge>}
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">Pagado el {formatDateTime(order.created_at)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 print:hidden">
                        <Select value={order.status} onValueChange={(value) => updateStatus(order.id, value as OrderStatus)}>
                          <SelectTrigger className="w-[180px] bg-white">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.entries(statusLabel).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button asChild className="bg-green-600 hover:bg-green-700 text-white">
                          <a href={whatsappHref} target="_blank" rel="noopener noreferrer">
                            <MessageCircle className="h-4 w-4 mr-2" /> WhatsApp
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-5 grid lg:grid-cols-[1.2fr_1fr] gap-6">
                    <div className="space-y-4">
                      <div className="grid sm:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-black mb-1">Cliente</p>
                          <p>{order.customer_name || "Cliente"}</p>
                          <p>{order.customer_email}</p>
                          {order.customer_phone && <p>{order.customer_phone}</p>}
                        </div>
                        <div>
                          <p className="font-black mb-1 flex items-center gap-1"><Truck className="h-4 w-4" /> Entrega</p>
                          <p>{order.delivery_method === "domicilio" ? "Domicilio" : "Recogida en local"}</p>
                          {order.customer_address && <p>{order.customer_address}</p>}
                          {order.city && <p>{order.city}</p>}
                          {order.scheduled_for && <p className="font-semibold">{formatDateTime(order.scheduled_for)}</p>}
                        </div>
                      </div>
                      {order.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm">
                          <p className="font-black mb-1">Notas</p>
                          <p>{order.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <p className="font-black">Productos</p>
                      <div className="space-y-3">
                        {(order.items || []).map((item, index) => {
                          const details = getOrderItemDetails(item);
                          return (
                            <div key={`${details.name}-${index}`} className="flex gap-3 items-center text-sm">
                              {details.image && <img src={details.image} alt={details.name} className="h-14 w-14 rounded-lg object-cover" />}
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold leading-snug">{details.quantity} x {details.name}</p>
                                {details.packSize && <p className="text-xs text-muted-foreground">{details.packSize}</p>}
                              </div>
                              {details.unitPrice && <p className="font-bold">{details.unitPrice.toFixed(2)}€</p>}
                            </div>
                          );
                        })}
                      </div>
                      <div className="border-t pt-3 flex justify-between text-lg">
                        <span className="font-black">Total</span>
                        <span className="font-black">{formatCurrency(order.amount_total_cents, order.currency)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </Layout>
  );
}