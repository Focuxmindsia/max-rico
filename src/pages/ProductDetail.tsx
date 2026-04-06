import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { products } from "@/data/products";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, ArrowLeft, Thermometer, ChefHat, Snowflake } from "lucide-react";
import ProductCard from "@/components/catalog/ProductCard";
import Layout from "@/components/layout/Layout";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  const product = products.find((p) => p.id === id);
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center">
          <p className="text-xl font-bold">Producto no encontrado</p>
          <Link to="/catalogo"><Button variant="cta" className="mt-4">Volver al catálogo</Button></Link>
        </div>
      </Layout>
    );
  }

  const related = products.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);
  const savings = product.price - product.memberPrice;

  const badgeMap = {
    oferta: { variant: "offer" as const, label: "Oferta" },
    nuevo: { variant: "nuevo" as const, label: "Nuevo" },
    top: { variant: "top" as const, label: "Top ventas" },
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Link to="/catalogo" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="h-4 w-4" /> Volver al catálogo
        </Link>

        <div className="grid md:grid-cols-2 gap-8 md:gap-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-secondary">
              <img
                src={product.gallery ? product.gallery[selectedImage] : product.image}
                alt={product.name}
                className="w-full aspect-square object-cover"
              />
              {product.badge && (
                <Badge variant={badgeMap[product.badge].variant} className="absolute top-4 left-4 text-sm">
                  {badgeMap[product.badge].label}
                </Badge>
              )}
            </div>
            {product.gallery && product.gallery.length > 1 && (
              <div className="flex gap-2">
                {product.gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden border-2 transition-all w-20 h-20 ${
                      selectedImage === idx ? "border-primary" : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.category} · {product.packSize}</p>
            <h1 className="text-2xl md:text-3xl font-black mb-4">{product.name}</h1>
            <p className="text-muted-foreground mb-6">{product.description}</p>

            {/* Price */}
            <div className="bg-secondary rounded-xl p-5 mb-6">
              <div className="flex items-end gap-3 mb-2">
                <span className="text-3xl font-black">{product.price.toFixed(2)}€</span>
                <span className="text-lg text-primary font-bold">Socio: {product.memberPrice.toFixed(2)}€</span>
              </div>
              {savings > 0 && (
                <p className="text-sm text-primary font-semibold">
                  ✨ Los socios ahorran {savings.toFixed(2)}€ en este producto
                </p>
              )}
            </div>

            {/* Quantity + Add */}
            <div className="flex items-center gap-4 mb-8">
              <div className="flex items-center border border-border rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-3 hover:bg-secondary transition-colors">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="px-4 font-bold">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-secondary transition-colors">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <Button variant="cta" size="lg" className="flex-1" onClick={() => addToCart(product, quantity)}>
                <ShoppingCart className="h-4 w-4 mr-2" /> Añadir al carrito
              </Button>
            </div>

            {/* Details */}
            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
                <ChefHat className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm mb-1">Preparación</p>
                  <p className="text-sm text-muted-foreground">{product.preparation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
                <Snowflake className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm mb-1">Conservación</p>
                  <p className="text-sm text-muted-foreground">{product.conservation}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border">
                <Thermometer className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-sm mb-1">Ingredientes</p>
                  <p className="text-sm text-muted-foreground">{product.ingredients}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related */}
        {related.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-black mb-6">Combina con…</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}
