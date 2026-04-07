import { useState, useMemo } from "react";
import { Search, MessageCircle, Star, ChevronRight, ChevronLeft, Instagram } from "lucide-react";
import heroEmpanadas from "@/assets/hero-empanadas.jpeg";
import { products, categories } from "@/data/products";
import { Badge } from "@/components/ui/badge";

const WHATSAPP_NUMBER = "34695798632";

const badgeMap = {
  oferta: { variant: "offer" as const, label: "Oferta" },
  nuevo: { variant: "nuevo" as const, label: "Nuevo" },
  top: { variant: "top" as const, label: "Top ventas" },
};

function getWhatsAppUrl(productName: string) {
  const message = encodeURIComponent(
    `Hola, estoy interesado/a en comprar: ${productName}. ¿Me podrían dar más información?`
  );
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`;
}

export default function CatalogoPublico() {
  const [selectedCategory, setSelectedCategory] = useState("Todos los Productos");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory !== "Todos los Productos") {
      result = result.filter((p) => p.category === selectedCategory);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }
    return result;
  }, [selectedCategory, search]);

  return (
    <div className="min-h-screen bg-background" translate="no">
      {/* Header simple */}
      <header className="sticky top-0 z-50 bg-foreground text-background">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-black text-lg">MR</span>
            </div>
            <div>
              <span className="font-black text-xl leading-none">MaxRico</span>
              <span className="block text-[10px] text-background/60 tracking-widest uppercase">
                Catálogo Digital
              </span>
            </div>
          </div>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-[#25D366] hover:bg-[#1da851] text-white px-4 py-2 rounded-full text-sm font-bold transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Contáctanos</span>
          </a>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-primary py-6 md:py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-6 md:gap-10">
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl md:text-5xl font-black text-primary-foreground mb-2">
              El Catálogo
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-lg mx-auto md:mx-0">
              Empanadas colombianas auténtico sabor 100% de Maíz molido. <br />
              No contienen harina / Sin Gluten. haz tu pedido por WhatsApp.
            </p>
          </div>
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
            <img
              src={heroEmpanadas}
              alt="Empanadas congeladas MaxRico"
              className="w-full h-48 md:h-56 object-cover rounded-xl shadow-lg"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Search + Categories */}
        <div className="flex flex-col gap-4 mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === cat
                    ? "bg-foreground text-background"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products grid */}
        {(() => {
          const regularProducts = filtered.filter((p) => p.category !== "Combos");
          const comboProducts = filtered.filter((p) => p.category === "Combos");

          const renderProductCard = (product: typeof filtered[0]) => {
            const badgeInfo = product.badge ? badgeMap[product.badge] : null;
            const isSoldOut = product.soldOut === true;
            return (
              <div
                key={product.id}
                className="group bg-card rounded-xl border border-border overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col"
              >
                <div className="relative overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  {isSoldOut && (
                    <div className="absolute top-3 right-3">
                      <span className="bg-destructive text-destructive-foreground font-black text-xs px-3 py-1.5 rounded-full shadow-lg uppercase tracking-wide">
                        Agotado
                      </span>
                    </div>
                  )}
                  {badgeInfo && !isSoldOut && (
                    <Badge variant={badgeInfo.variant} className="absolute top-3 left-3">
                      {badgeInfo.label}
                    </Badge>
                  )}
                </div>

                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    {product.category} · {product.packSize}
                  </p>
                  <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2">
                    {product.name}
                  </h3>

                  {product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="text-xs font-semibold">{product.rating}</span>
                    </div>
                  )}

                  <div className="mt-auto">
                    <p className="text-lg font-black mb-3">{product.price.toFixed(2)}€</p>

                    {isSoldOut ? (
                      <div className="flex items-center justify-center w-full bg-muted text-muted-foreground py-2.5 rounded-lg text-sm font-bold cursor-not-allowed">
                        Agotado
                      </div>
                    ) : (
                      <a
                        href={getWhatsAppUrl(product.name)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white py-2.5 rounded-lg text-sm font-bold transition-colors"
                      >
                        <MessageCircle className="h-4 w-4" />
                        Pedir por WhatsApp
                      </a>
                    )}
                  </div>
                </div>
              </div>
            );
          };

          if (filtered.length === 0) {
            return (
              <div className="text-center py-20">
                <p className="text-muted-foreground text-lg">No se encontraron productos</p>
              </div>
            );
          }

          return (
            <>
              {regularProducts.length > 0 && (
                <div>
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-foreground">
                      🧊 Productos Ultra Congelados -20° 🧊
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {regularProducts.map(renderProductCard)}
                  </div>
                </div>
              )}

              {comboProducts.length > 0 && (
                <div className="mt-12">
                  <div className="text-center mb-8">
                    <h2 className="text-2xl md:text-3xl font-black text-foreground">
                      🔥 Productos Fritos Listos para Consumir 🔥
                    </h2>
                    <p className="text-muted-foreground mt-2 text-sm md:text-base flex items-center justify-center gap-2">
                      <ChevronRight className="h-5 w-5 text-primary animate-bounce-right" />
                      <span className="font-bold text-foreground underline decoration-primary decoration-2 underline-offset-4">
                        Solo en Zaragoza capital Se Venden los Combos de Cajas Fritas · Incluye domicilio
                      </span>
                      <ChevronLeft className="h-5 w-5 text-primary animate-bounce-left" />
                    </p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {comboProducts.map(renderProductCard)}
                  </div>
                </div>
              )}
            </>
          );
        })()}
      </div>

      {/* Footer simple */}
      <footer className="bg-foreground text-background/60 py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© {new Date().getFullYear()} MaxRico — Sabor Latino. Todos los derechos reservados.</p>
          <div className="flex items-center justify-center gap-6 mt-4">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#25D366] hover:underline text-sm font-semibold"
            >
              <MessageCircle className="h-5 w-5" />
              WhatsApp: +34 695 798 632
            </a>
            <a
              href="https://www.instagram.com/maxrico_distribuidora/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#E1306C] hover:underline text-sm font-semibold"
            >
              <Instagram className="h-5 w-5" />
              Instagram
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
