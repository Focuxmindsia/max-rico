import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Minus, Plus, Trash2, ShoppingCart, ArrowRight } from "lucide-react";
import Layout from "@/components/layout/Layout";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

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
          {/* Items */}
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

          {/* Summary */}
          <div className="bg-secondary rounded-xl p-6 h-fit sticky top-24">
            <h2 className="font-black text-lg mb-4">Resumen del pedido</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal ({totalItems} productos)</span>
                <span className="font-semibold">{totalPrice.toFixed(2)}€</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Envío</span>
                <span className="text-primary font-semibold">Gratis para socios</span>
              </div>
            </div>
            <div className="border-t border-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-black text-lg">Total</span>
                <span className="font-black text-lg">{totalPrice.toFixed(2)}€</span>
              </div>
            </div>
            <Button variant="cta" size="lg" className="w-full">
              Ir al checkout <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-3">
              ¿Eres socio? Los descuentos se aplican en checkout
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}
