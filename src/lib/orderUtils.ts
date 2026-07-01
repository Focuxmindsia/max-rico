import { products } from "@/data/products";
import { PRICE_ID_BY_PRODUCT_ID } from "@/data/priceIds";

export interface OrderItemLike {
  priceId?: string;
  productId?: string;
  name?: string;
  title?: string;
  quantity?: number;
  qty?: number;
  price?: number;
}

const productById = new Map(products.map((product) => [product.id, product]));
const productByPriceId = new Map(
  Object.entries(PRICE_ID_BY_PRODUCT_ID).map(([productId, priceId]) => [priceId, productById.get(productId)]),
);

export function formatCurrency(cents?: number | null, currency = "eur") {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: (currency || "eur").toUpperCase(),
  }).format((cents || 0) / 100);
}

export function formatDateTime(value?: string | null) {
  if (!value) return "No especificado";
  return new Intl.DateTimeFormat("es-ES", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function getOrderItemDetails(item: OrderItemLike) {
  const product = item.productId ? productById.get(String(item.productId)) : item.priceId ? productByPriceId.get(item.priceId) : undefined;
  const quantity = Number(item.quantity || item.qty || 1);

  return {
    product,
    quantity,
    name: item.name || item.title || product?.name || "Producto MaxRico",
    unitPrice: typeof item.price === "number" ? item.price : product?.price,
    image: product?.image,
    packSize: product?.packSize,
  };
}

export function buildOrderWhatsAppMessage(order: {
  id?: string;
  stripe_session_id?: string | null;
  customer_name?: string | null;
  customer_email?: string | null;
  customer_phone?: string | null;
  delivery_method?: string | null;
  customer_address?: string | null;
  city?: string | null;
  scheduled_for?: string | null;
  notes?: string | null;
  amount_total_cents?: number | null;
  currency?: string | null;
  items?: OrderItemLike[] | null;
}) {
  const shortRef = (order.stripe_session_id || order.id || "").slice(-8).toUpperCase();
  const itemLines = (order.items || [])
    .map((item) => {
      const details = getOrderItemDetails(item);
      return `• ${details.quantity} x ${details.name}`;
    })
    .join("\n");

  return [
    "Hola MaxRico, acabo de pagar mi pedido y quiero confirmar la entrega.",
    shortRef ? `Referencia: ${shortRef}` : "",
    order.customer_name ? `Nombre: ${order.customer_name}` : "",
    order.customer_email ? `Email: ${order.customer_email}` : "",
    order.customer_phone ? `Teléfono: ${order.customer_phone}` : "",
    `Entrega: ${order.delivery_method === "domicilio" ? "Domicilio" : "Recogida"}`,
    order.customer_address ? `Dirección: ${order.customer_address}` : "",
    order.city ? `Ciudad: ${order.city}` : "",
    order.scheduled_for ? `Fecha/hora: ${formatDateTime(order.scheduled_for)}` : "",
    itemLines ? `Productos:\n${itemLines}` : "",
    `Total pagado: ${formatCurrency(order.amount_total_cents, order.currency || "eur")}`,
    order.notes ? `Notas: ${order.notes}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}