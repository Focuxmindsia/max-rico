import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check, Truck, Sparkles, Zap, ShieldCheck, Crown } from "lucide-react";
import Layout from "@/components/layout/Layout";

const benefits = [
  { icon: Truck, title: "Envío gratis", desc: "En pedidos elegibles. Sin mínimo de compra para socios." },
  { icon: Sparkles, title: "Descuentos exclusivos", desc: "Precios especiales en todo el catálogo, solo para socios." },
  { icon: Zap, title: "Acceso anticipado", desc: "Sé el primero en acceder a nuevos productos y promos flash." },
  { icon: ShieldCheck, title: "Soporte prioritario", desc: "Atención preferente por nuestro equipo y asistente IA." },
];

const comparison = [
  { feature: "Acceso al catálogo", free: true, member: true },
  { feature: "Precios de socio", free: false, member: true },
  { feature: "Envío gratis", free: false, member: true },
  { feature: "Promos anticipadas", free: false, member: true },
  { feature: "Soporte prioritario", free: false, member: true },
  { feature: "Cupones exclusivos", free: false, member: true },
];

export default function Socios() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 text-primary px-4 py-2 rounded-full text-sm font-bold mb-6">
            <Crown className="h-4 w-4" /> Club de Socios
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Únete al club<br />
            <span className="text-primary">y ahorra siempre</span>
          </h1>
          <p className="text-background/60 text-lg max-w-lg mx-auto mb-8">
            Por solo 49€ al año, disfruta de envío gratis, descuentos exclusivos, promos anticipadas y mucho más.
          </p>
          <Button variant="cta" size="lg" className="text-lg px-10">
            Unirme por 49€ / año
          </Button>
          <p className="text-xs text-background/40 mt-3">Cancela cuando quieras. Sin permanencia.</p>
        </div>
      </section>

      {/* Benefits */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-2xl md:text-3xl font-black text-center mb-10">Beneficios del club</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b) => (
            <div key={b.title} className="border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <b.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{b.title}</h3>
              <p className="text-sm text-muted-foreground">{b.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">¿Socio vs. invitado?</h2>
          <div className="max-w-lg mx-auto bg-card rounded-xl border border-border overflow-hidden">
            <div className="grid grid-cols-3 bg-foreground text-background p-4">
              <span className="font-bold text-sm">Característica</span>
              <span className="text-center font-bold text-sm">Invitado</span>
              <span className="text-center font-bold text-sm text-primary">Socio ⭐</span>
            </div>
            {comparison.map((row) => (
              <div key={row.feature} className="grid grid-cols-3 p-4 border-t border-border items-center">
                <span className="text-sm">{row.feature}</span>
                <span className="text-center">{row.free ? <Check className="h-4 w-4 text-foreground mx-auto" /> : <span className="text-muted-foreground">—</span>}</span>
                <span className="text-center"><Check className="h-4 w-4 text-primary mx-auto" /></span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl md:text-3xl font-black mb-4">¿A qué esperas?</h2>
        <p className="text-muted-foreground mb-6 max-w-md mx-auto">
          Más de 1.000 socios ya disfrutan de los mejores sabores latinos a precios de club.
        </p>
        <Button variant="cta" size="lg" className="text-lg px-10">
          Hacerme socio — 49€/año
        </Button>
      </section>
    </Layout>
  );
}
