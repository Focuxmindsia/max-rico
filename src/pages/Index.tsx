import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Truck, Sparkles, Users, Zap, ShieldCheck, Bot } from "lucide-react";
import { products } from "@/data/products";
import ProductCard from "@/components/catalog/ProductCard";
import Layout from "@/components/layout/Layout";
import heroBanner from "@/assets/hero-banner.jpg";

const howItWorks = [
  { icon: Users, title: "Hazte socio", desc: "Únete al club por solo 59€/año" },
  { icon: Truck, title: "Envío gratis", desc: "En pedidos elegibles para socios" },
  { icon: Sparkles, title: "Descuentos exclusivos", desc: "Precios especiales en todo el catálogo" },
  { icon: Zap, title: "Acceso anticipado", desc: "Sé el primero en ver las promos" },
];

const testimonials = [
  { name: "María G.", text: "Las empanadas están increíbles, como las de mi abuela en Bogotá. ¡Y el envío gratis es genial!", rating: 5 },
  { name: "Carlos R.", text: "Los tequeños desaparecen en minutos en casa. Calidad premium a precio de club.", rating: 5 },
  { name: "Ana P.", text: "Me encanta que tengan pan de bono congelado. Desayunos colombianos sin esfuerzo.", rating: 4 },
];

export default function Index() {
  const featured = products.filter((p) => p.badge === "top" || p.badge === "oferta").slice(0, 4);
  const newProducts = products.filter((p) => p.badge === "nuevo");

  return (
    <Layout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-foreground">
        <div className="absolute inset-0">
          <img src={heroBanner} alt="Sabores latinos congelados" className="w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-foreground via-foreground/80 to-transparent" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-xl">
            <Badge variant="top" className="mb-4">🎉 Club de Sabores Latinos</Badge>
            <h1 className="text-4xl md:text-6xl font-black text-background leading-tight mb-4">
              <span translate="no" className="notranslate">MaxRico</span> — Sabores latinos,<br />
              <span className="text-primary">calidad top,</span><br />
              precios de socio.
            </h1>
            <p className="text-background/70 text-lg mb-8 max-w-md">
              Empanadas, tequeños, arepas y más. Congelados premium directo a tu puerta. Hazte socio y ahorra en cada pedido.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalogo">
                <Button variant="cta" size="lg">
                  Ver catálogo <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
              <Link to="/socios">
                <Button variant="hero" size="lg" className="border border-background/20">
                  Hazte socio — 59€/año
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured products */}
      <section className="container mx-auto px-4 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-black">Productos destacados</h2>
            <p className="text-muted-foreground mt-1">Los favoritos de nuestros socios</p>
          </div>
          <Link to="/catalogo">
            <Button variant="outline" size="sm">
              Ver todo <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {featured.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* New products */}
      {newProducts.length > 0 && (
        <section className="bg-secondary py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-black mb-8">
              <Badge variant="nuevo" className="mr-2">Nuevo</Badge>
              Recién llegados
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {newProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* How membership works */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-3xl font-black">¿Cómo funciona el club?</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Ser socio de MaxRico tiene sus ventajas. Todo por solo 59€ al año.
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {howItWorks.map((item) => (
            <div key={item.title} className="text-center p-6 rounded-xl border border-border hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-1">{item.title}</h3>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/socios">
            <Button variant="cta" size="lg">
              Unirme al club <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* AI Section */}
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="top" className="mb-4">
                <Bot className="h-3 w-3 mr-1" /> Tecnología e IA
              </Badge>
              <h2 className="text-2xl md:text-3xl font-black mb-4">
                IA al servicio de tu compra
              </h2>
              <p className="text-background/70 mb-6">
                Usamos inteligencia artificial para personalizar tu experiencia: recomendaciones basadas en tus gustos, soporte automatizado 24/7 y optimización de pedidos para que recibas todo en perfecto estado.
              </p>
              <div className="space-y-4">
                {[
                  { icon: Sparkles, text: "Recomendaciones inteligentes basadas en tus compras" },
                  { icon: Bot, text: "Asistente virtual para resolver dudas al instante" },
                  { icon: ShieldCheck, text: "Logística optimizada con IA para envíos rápidos" },
                ].map((f) => (
                  <div key={f.text} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-md bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                      <f.icon className="h-4 w-4 text-primary" />
                    </div>
                    <p className="text-sm text-background/80">{f.text}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-background/5 border border-background/10 rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="h-4 w-4 text-primary-foreground" />
                </div>
                <div>
                  <p className="font-bold text-sm">Asistente MaxRico</p>
                  <p className="text-[10px] text-background/40">Online</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="bg-background/10 rounded-lg p-3 text-sm">
                  ¡Hola! 👋 Soy el asistente de MaxRico. ¿En qué puedo ayudarte?
                </div>
                <div className="bg-primary/20 rounded-lg p-3 text-sm ml-8">
                  ¿Cuál es la mejor forma de preparar las empanadas?
                </div>
                <div className="bg-background/10 rounded-lg p-3 text-sm">
                  ¡Buena pregunta! Te recomiendo el air fryer a 180°C por 12 minutos. Quedan súper crujientes. 🔥 ¿Quieres que te sugiera un combo con tequeños?
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-10">Lo que dicen nuestros socios</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div key={t.name} className="border border-border rounded-xl p-6">
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-primary text-sm">★</span>
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-4 italic">"{t.text}"</p>
              <p className="font-bold text-sm">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="bg-primary py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl md:text-3xl font-black text-primary-foreground mb-3">
            ¿Listo para probar los mejores sabores latinos?
          </h2>
          <p className="text-primary-foreground/70 mb-6 max-w-md mx-auto">
            Únete al club, ahorra en cada compra y recibe envío gratis.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/catalogo">
              <Button variant="hero" size="lg">Ver catálogo</Button>
            </Link>
            <Link to="/socios">
              <Button variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground">
                Hazte socio — 59€/año
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
