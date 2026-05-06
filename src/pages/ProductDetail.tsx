import { useParams, Link } from "react-router-dom";
import { useState, useMemo } from "react";
import { products } from "@/data/products";
import { getProductExtras } from "@/data/productExtras";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Minus, Plus, ArrowLeft, Thermometer, ChefHat, Snowflake, Check } from "lucide-react";
import ProductCard from "@/components/catalog/ProductCard";
import Layout from "@/components/layout/Layout";
import ImageLightbox from "@/components/catalog/ImageLightbox";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

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

  const EXTRA_RECOMMENDATIONS: Record<string, string[]> = {
    "7": ["10", "21"],
  };
  const extraIds = EXTRA_RECOMMENDATIONS[product.id] ?? [];
  const extraRelated = extraIds.map((rid) => products.find((p) => p.id === rid)).filter(Boolean) as typeof products;
  const sameCategory = products.filter((p) => p.category === product.category && p.id !== product.id);
  const related = Array.from(
    new Map([...sameCategory, ...extraRelated].map((p) => [p.id, p])).values()
  ).slice(0, 4);
  const savings = product.price - product.memberPrice;
  const extras = getProductExtras(product);

  // Galería combinada: imagen principal + gallery del producto + extras (sin duplicados)
  const fullGallery = useMemo(() => {
    const base = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
    const all = [...base, ...extras.galleryExtras];
    return Array.from(new Set(all));
  }, [product, extras]);

  const currentImage = fullGallery[selectedImage] ?? product.image;

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
            <div className="relative rounded-2xl overflow-hidden bg-secondary cursor-pointer" onClick={() => setLightboxOpen(true)}>
              <img
                src={currentImage}
                alt={product.name}
                className="w-full aspect-square object-cover"
                style={selectedImage === 0 && product.imagePosition ? { objectPosition: product.imagePosition } : undefined}
              />
              {product.badge && (
                <Badge variant={badgeMap[product.badge].variant} className="absolute top-4 left-4 text-sm">
                  {badgeMap[product.badge].label}
                </Badge>
              )}
            </div>
            {fullGallery.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {fullGallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`rounded-lg overflow-hidden border-2 transition-all w-20 h-20 ${
                      selectedImage === idx ? "border-primary" : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <p className="text-sm text-muted-foreground mb-1">{product.category} · {product.packSize}</p>
            <h1 className="text-2xl md:text-3xl font-black mb-4 whitespace-pre-line">{product.name}</h1>
            <p className="text-muted-foreground mb-4 whitespace-pre-line">{extras.longDescription}</p>

            {/* Highlights */}
            {extras.highlights && extras.highlights.length > 0 && (
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-6">
                {extras.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm bg-secondary/60 rounded-lg p-2.5">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium">{h}</span>
                  </li>
                ))}
              </ul>
            )}

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

      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        src={currentImage}
        alt={product.name}
      />
    </Layout>
  );
}
