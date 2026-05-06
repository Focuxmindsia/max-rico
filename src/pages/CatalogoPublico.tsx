import { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { Search, MessageCircle, Star, ChevronRight, ChevronLeft, Instagram, PartyPopper, Store, Flame, CreditCard } from "lucide-react";
import heroEmpanadas from "@/assets/hero-empanadas.jpeg";
import heroEmpanadas2 from "@/assets/hero-empanadas-2.jpg";
import heroEmpanadas3 from "@/assets/hero-empanadas-3.jpg";
import heroEmpanadas5 from "@/assets/hero-empanadas-5.jpg";
import heroEmpamadas from "@/assets/empamadas.png";
import { products, categories, type Product } from "@/data/products";
import { Badge } from "@/components/ui/badge";
import { CheckoutWizard } from "@/components/CheckoutWizard";
import { getPriceId, isProductFrito } from "@/data/priceIds";
import { useSeo } from "@/hooks/useSeo";

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
  useSeo({
    title: "Catálogo MaxRico | Empanadas colombianas, arepas y tequeños congelados en España",
    description:
      "Catálogo MaxRico: empanadas artesanales, gourmet, caseras y congeladas. Empanadas colombianas en España, arepas, tequeños, pandebono y chorizos. Pide online por WhatsApp.",
    canonical: "https://maxrico.es/catalogo",
    keywords:
      "MaxRico, Max Rico, maxrico.es, masrico, masrico.es, MaxRico empanadas, empanadas más rico, empanadas, empanadas artesanales, empanadas gourmet, empanadas caseras, empanadas congeladas, empanadas congelas, empanadas colombianas, empanadas colombianas en España, empanadas España, comprar empanadas, pedir empanadas online, empanadas a domicilio, delivery de empanadas, mejores empanadas colombianas, empanadas en Zaragoza, comida colombiana en Zaragoza, arepas, tequeños, pandebono, chorizos",
  });

  const [selectedCategory, setSelectedCategory] = useState("Todos los Productos Congelados");
  const [search, setSearch] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [checkoutProduct, setCheckoutProduct] = useState<Product | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const openCheckout = (p: Product) => {
    setCheckoutProduct(p);
    setCheckoutOpen(true);
  };

  const heroImages = [heroEmpanadas, heroEmpanadas2, heroEmpanadas3, heroEmpanadas5, heroEmpamadas];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory !== "Todos los Productos Congelados") {
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
              El Catálogo Particular
            </h1>
            <p className="text-primary-foreground/70 text-lg max-w-lg mx-auto md:mx-0">
              Empanadas colombianas auténtico sabor 100% de Maíz molido. <br />
              No contienen harina / Sin Gluten. haz tu pedido Particulares | Eventos | Negocios.
            </p>
          </div>
          <div className="w-full md:w-80 lg:w-96 flex-shrink-0 relative overflow-hidden rounded-xl shadow-lg h-48 md:h-56">
            {heroImages.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Empanadas MaxRico ${idx + 1}`}
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
                  idx === currentSlide ? "opacity-100" : "opacity-0"
                }`}
              />
            ))}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
              {heroImages.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    idx === currentSlide ? "bg-white" : "bg-white/40"
                  }`}
                />
              ))}
            </div>
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
            {categories.map((cat) => {
              const isCombo = cat === "Combos";
              const label = isCombo ? "🔥 Combos de cajas fritas" : cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    isCombo
                      ? selectedCategory === cat
                        ? "bg-[hsl(45,100%,45%)] text-foreground font-bold"
                        : "bg-[hsl(45,100%,51%)] text-foreground font-bold hover:bg-[hsl(45,100%,45%)]"
                      : selectedCategory === cat
                        ? "bg-foreground text-background"
                        : "bg-secondary text-foreground hover:bg-secondary/80"
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <button
              onClick={() => setSelectedCategory("Al por Mayor")}
              className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                selectedCategory === "Al por Mayor"
                  ? "bg-destructive text-destructive-foreground"
                  : "bg-destructive/90 text-destructive-foreground hover:bg-destructive"
              }`}
            >
              🔥 Para Negocios ó Eventos
            </button>
          </div>
        </div>

        {/* Wholesale section */}
        {selectedCategory === "Al por Mayor" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {/* Card: Eventos */}
            <div className="bg-card rounded-xl border-2 border-primary overflow-hidden shadow-lg flex flex-col">
              <div className="bg-primary p-6 text-center">
                <PartyPopper className="h-12 w-12 text-primary-foreground mx-auto mb-3" />
                <h3 className="text-xl font-black text-primary-foreground">Para Eventos</h3>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  ¿Necesitas empanadas para un <strong>evento puntual</strong>, tu <strong>cumpleaños</strong>, fiestas o celebraciones? Te ofrecemos empanadas al por mayor con el auténtico sabor colombiano.
                </p>
                <ul className="text-sm space-y-2 mb-6 text-foreground">
                  <li>🍽️ Empresas de catering</li>
                  <li>🎂 Cumpleaños y fiestas</li>
                  <li>🎉 Eventos y celebraciones</li>
                  <li>🤝 Reuniones empresariales</li>
                  <li>⛪ Iglesias o ministerios</li>
                </ul>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, necesito empanadas al por mayor para celebrar un evento o un cumpleaños. ¿Me podrían dar más información?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white py-3 rounded-lg text-sm font-bold transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Pedir para mi Evento
                </a>
              </div>
            </div>

            {/* Card: Negocios */}
            <div className="bg-card rounded-xl border-2 border-destructive overflow-hidden shadow-lg flex flex-col">
              <div className="bg-destructive p-6 text-center">
                <Store className="h-12 w-12 text-destructive-foreground mx-auto mb-3" />
                <h3 className="text-xl font-black text-destructive-foreground">Para Negocios</h3>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
                  ¿Tienes un <strong>negocio</strong> y quieres ofrecer nuestras empanadas a tus clientes? Abastece tu local con producto de calidad, sin gluten y 100% de maíz molido.
                </p>
                <ul className="text-sm space-y-2 mb-6 text-foreground">
                  <li>🏪 Restaurantes,  cafeterías y Bar</li>
                  <li>🛒 Tiendas y supermercados</li>
                  <li>📦 Pedidos recurrentes</li>
                </ul>
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hola, necesito empanadas para abastecer mi negocio. ¿Me podrían dar más información sobre precios al por mayor?")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white py-3 rounded-lg text-sm font-bold transition-colors"
                >
                  <MessageCircle className="h-5 w-5" />
                  Pedir para mi Negocio
                </a>
              </div>
            </div>
          </div>
        ) : (
        /* Products grid */
        (() => {
          const regularProducts = filtered.filter((p) => p.category !== "Combos");
          const comboProducts = filtered.filter((p) => p.category === "Combos");

          const renderProductCard = (product: typeof filtered[0]) => {
            const badgeInfo = product.badge ? badgeMap[product.badge] : null;
            const isSoldOut = product.soldOut === true;
            return (
              <div
                key={product.id}
                className={`group rounded-xl border overflow-hidden transition-all duration-300 flex flex-col ${
                  isSoldOut ? "bg-muted border-muted-foreground/20 opacity-70" : "bg-card border-border hover:shadow-lg"
                }`}
              >
                <Link to={`/producto/${product.id}`} className="relative overflow-hidden block" aria-label={`Ver detalles de ${product.name}`}>
                  <img
                    src={product.image}
                    alt={product.name}
                    className={`w-full h-48 object-cover transition-transform duration-300 ${isSoldOut ? "grayscale" : "group-hover:scale-105"}`}
                    style={product.imagePosition ? { objectPosition: product.imagePosition } : undefined}
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
                  {product.category === "Combos" && !isSoldOut && (
                    <div className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-center py-1.5 font-bold text-sm tracking-wide">
                      🚚 DOMICILIO GRATIS
                    </div>
                  )}
                  {product.category !== "Combos" && !isSoldOut && (
                    <div className="absolute bottom-2 right-2 bg-sky-100 text-sky-700 text-[10px] font-semibold px-2 py-0.5 rounded-full">
                      🧊 Ultracongelado
                    </div>
                  )}
                </Link>

                <div className="p-4 flex flex-col flex-1">
                  <p className="text-xs text-muted-foreground mb-1">
                    {product.category} · {product.packSize}
                  </p>
                  <Link to={`/producto/${product.id}`} className="block">
                    <h3 className="font-bold text-sm leading-tight mb-2 line-clamp-2 whitespace-pre-line hover:text-primary/80 transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  {product.rating && (
                    <div className="flex items-center gap-1 mb-2">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" />
                      <span className="text-xs font-semibold">{product.rating}</span>
                    </div>
                  )}

                  <div className="mt-auto">
                    <div className="flex items-center gap-2 mb-3">
                      <p className="text-lg font-black">{product.price.toFixed(2)}€</p>
                      {product.originalPrice && (
                        <p className="text-sm text-muted-foreground line-through">{product.originalPrice.toFixed(2)}€</p>
                      )}
                    </div>

                    {isSoldOut ? (
                      <div className="flex items-center justify-center w-full bg-muted text-muted-foreground py-2.5 rounded-lg text-sm font-bold cursor-not-allowed">
                        Agotado
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {getPriceId(product.id) && (
                          <button
                            onClick={() => openCheckout(product)}
                            className="flex items-center justify-center gap-2 w-full bg-yellow-400 hover:bg-yellow-500 text-black py-2.5 rounded-lg text-sm font-black transition-colors shadow-sm"
                          >
                            <CreditCard className="h-4 w-4" />
                            Comprar con tarjeta
                          </button>
                        )}
                        {isProductFrito(product.id) && (
                          <a
                            href={getWhatsAppUrl(product.name)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-2 w-full bg-[#25D366] hover:bg-[#1da851] text-white py-2 rounded-lg text-xs font-bold transition-colors"
                          >
                            <MessageCircle className="h-3.5 w-3.5" />
                            Consultar por WhatsApp
                          </a>
                        )}
                      </div>
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
                <div id="combo-cajas-fritas" className="mt-12">
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
        })())}

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
              href="https://www.instagram.com/maxrico_empanadas?igsh=OGR2cWdqbTdlOGE3"
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

      {/* Floating buttons */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col gap-3 items-end">
        <button
          onClick={() => {
            setSelectedCategory("Combos");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="bg-[hsl(45,100%,50%)] text-foreground font-black px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 text-xs"
        >
          <Flame className="h-4 w-4" />
          Caja de empanadas fritas
        </button>
        <button
          onClick={() => {
            setSelectedCategory("Al por Mayor");
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="bg-destructive text-foreground font-black px-4 py-3 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center gap-2 text-xs"
        >
          <Store className="h-4 w-4" />
          Para Negocios ó Eventos
        </button>
      </div>

      <CheckoutWizard
        product={checkoutProduct}
        priceId={checkoutProduct ? getPriceId(checkoutProduct.id) : null}
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
      />
    </div>
  );
}
