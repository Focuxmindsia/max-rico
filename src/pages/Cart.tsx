import { Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight, AlertTriangle } from "lucide-react";
import Layout from "@/components/layout/Layout";
import { CheckoutWizard } from "@/components/CheckoutWizard";
import { toast } from "sonner";
import { SHIPPING_INCLUDED_PRODUCT_IDS, FREE_SHIPPING_THRESHOLD_EUR, SHIPPING_FEE_EUR, computeShippingFeeEUR } from "@/data/priceIds";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const billableSubtotal = useMemo(
    () => items.reduce((s, i) => (SHIPPING_INCLUDED_PRODUCT_IDS.has(i.product.id) ? s : s + i.product.price * i.quantity), 0),
    [items],
  );
  const hasShippingIncludedCombo = useMemo(
    () => items.some((i) => SHIPPING_INCLUDED_PRODUCT_IDS.has(i.product.id)),
    [items],
  );
  const domicilioFee = useMemo(
    () => computeShippingFeeEUR(items.map((i) => ({ productId: i.product.id, price: i.product.price, quantity: i.quantity })), "domicilio"),
    [items],
  );
  const willChargeShipping = domicilioFee > 0;
  const amountToFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD_EUR - billableSubtotal);

  const hasExtraOnly = useMemo(() => {
    const hasExtra = items.some((i) => i.product.requiresCombo);
    const hasCombo = items.some((i) => i.product.category === "Combos");
    return hasExtra && !hasCombo;
  }, [items]);

  const handleCheckout = () => {
    if (hasExtraOnly) {
      toast.error("El Extra Chorizo XL solo se puede comprar junto con un combo. Añade un combo frito a tu carrito.");
      return;
    }
    setCheckoutOpen(true);
  };


  if (items.length === 0) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-black mb-2">Tu carrito está vacío</h1>
          <p className="text-muted-foreground mb-6">Descubre nuestros productos latinos congelados</p>
          <Link to="/catalogo">
            <Button variant="cta" size="lg">Ver catálogo</Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-black mb-8">Tu carrito ({totalItems})</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex gap-4 p-4 border border-border rounded-xl">
                <img src={product.image} alt={product.name} className="w-24 h-24 rounded-lg object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <Link to={`/producto/${product.id}`} className="font-bold text-sm hover:text-primary/80 line-clamp-2">
                    {product.name}
                  </Link>
                  <p className="text-xs text-muted-foreground mt-0.5">{product.packSize}</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center border border-border rounded-lg">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="p-2 hover:bg-secondary transition-colors">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="px-3 text-sm font-bold">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="p-2 hover:bg-secondary transition-colors">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-black">{(product.price * quantity).toFixed(2)}€</span>
                      <button onClick={() => removeFromCart(product.id)} className="text-muted-foreground hover:text-accent transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-secondary rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-black text-lg mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({totalItems} productos)</span>
                <span className="font-semibold">{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío a domicilio</span>
                <span className="font-semibold">
                  {willChargeShipping
                    ? `${SHIPPING_FEE_EUR.toFixed(2).replace(".", ",")}€`
                    : hasShippingIncludedCombo && billableSubtotal === 0
                    ? "Incluido"
                    : "Gratis"}
                </span>
              </div>
              {willChargeShipping && (
                <p className="text-xs text-muted-foreground">
                  Añade <strong>{amountToFreeShipping.toFixed(2).replace(".", ",")}€</strong> más y el envío es <strong>gratis</strong> (mínimo {FREE_SHIPPING_THRESHOLD_EUR}€). Los combos fritos ya llevan envío incluido.
                </p>
              )}
            </div>
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-black text-lg">Total estimado</span>
                <span className="font-black text-lg">
                  {(totalPrice + (willChargeShipping ? SHIPPING_FEE_EUR : 0)).toFixed(2)}€
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground mt-1">
                El envío solo se aplica si eliges "Domicilio" en el checkout.
              </p>
            </div>
            {hasExtraOnly && (
              <div className="flex items-start gap-2 p-3 mb-3 bg-red-50 border border-red-200 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-red-700 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-red-900">
                  El <strong>Extra Chorizo XL</strong> solo se puede comprar junto con uno de nuestros <strong>combos fritos</strong>. Añade un combo para continuar.
                </p>
              </div>
            )}
            <Button
              variant="cta"
              size="lg"
              className="w-full"
              disabled={hasExtraOnly}
              onClick={handleCheckout}
            >
              Ir al checkout <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              Puedes pagar como invitado. Al finalizar podrás guardar el pedido en tu cuenta con 1 clic.
            </p>
          </div>
        </div>
      </div>

      <CheckoutWizard
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        cartItems={items}
      />
    </Layout>
  );
}
