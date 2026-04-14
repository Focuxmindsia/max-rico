import { useState } from "react";
import { Link } from "react-router-dom";
import { Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import ImageLightbox from "@/components/catalog/ImageLightbox";

const badgeMap = {
  oferta: { variant: "offer" as const, label: "Oferta" },
  nuevo: { variant: "nuevo" as const, label: "Nuevo" },
  top: { variant: "top" as const, label: "Top ventas" },
};

export default function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const badgeInfo = product.badge ? badgeMap[product.badge] : null;
  const savings = product.price - product.memberPrice;

  return (
    <div className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300">
      <div className="relative overflow-hidden cursor-pointer" onClick={() => setLightboxOpen(true)}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {badgeInfo && (
          <Badge variant={badgeInfo.variant} className="absolute top-3 left-3">
            {badgeInfo.label}
          </Badge>
        )}
        {savings > 0 && (
          <div className="absolute top-3 right-3 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-1 rounded-full">
            Socios ahorran {savings.toFixed(2)}€
          </div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/producto/${product.id}`}>
          <p className="text-xs text-muted-foreground mb-1">{product.category} · {product.packSize}</p>
          <h3 className="font-bold text-sm leading-tight mb-2 group-hover:text-primary/80 transition-colors">
            {product.name}
          </h3>
        </Link>

        {product.rating && (
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            <span className="text-xs font-semibold">{product.rating}</span>
          </div>
        )}

        <div className="flex items-end justify-between">
          <div>
            <p className="text-lg font-black">{product.price.toFixed(2)}€</p>
            <p className="text-xs text-primary font-semibold">
              Socio: {product.memberPrice.toFixed(2)}€
            </p>
          </div>
          <Button
            variant="cta"
            size="sm"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <ImageLightbox
        open={lightboxOpen}
        onOpenChange={setLightboxOpen}
        src={product.image}
        alt={product.name}
      />
    </div>
  );
}
