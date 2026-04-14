import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Heart, Users, Handshake, Bot, TrendingUp, Package } from "lucide-react";
import Layout from "@/components/layout/Layout";

const values = [
  { icon: ShieldCheck, title: "Cumplir la ley", desc: "Operamos con total transparencia y cumplimiento normativo." },
  { icon: Heart, title: "Cuidar a nuestros socios", desc: "Tu satisfacción es nuestra prioridad número uno." },
  { icon: Users, title: "Cuidar al equipo", desc: "Salarios dignos, buen ambiente y desarrollo profesional." },
  { icon: Handshake, title: "Respetar proveedores", desc: "Relaciones justas y de largo plazo con todos nuestros productores." },
];

const techFeatures = [
  { icon: Bot, title: "Soporte IA 24/7", desc: "Nuestro asistente virtual resuelve dudas al instante, aprende de cada interacción." },
  { icon: TrendingUp, title: "Recomendaciones inteligentes", desc: "Analizamos tus preferencias para sugerirte productos que te encantarán." },
  { icon: Package, title: "Logística optimizada", desc: "IA para gestionar inventario, predecir demanda y reducir desperdicios." },
];

export default function AboutUs() {
  return (
    <Layout>
      {/* Hero */}
      <section className="bg-foreground text-background py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge variant="top" className="mb-4">Sobre nosotros</Badge>
            <h1 className="text-4xl md:text-5xl font-black mb-4">
              Calidad premium,<br />
              <span className="text-primary">precios de club</span>
            </h1>
            <p className="text-background/60 text-lg">
              En MaxRico creemos que todo el mundo merece acceder a los mejores sabores latinos sin arruinarse. Por eso creamos un modelo de club: tú pagas una membresía anual y nosotros te damos los mejores precios, siempre.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-4">Nuestra misión</h2>
            <p className="text-muted-foreground mb-4">
              Ofrecer productos latinos congelados de calidad premium al mejor precio posible, construyendo una comunidad de socios que comparten la pasión por los sabores auténticos de Latinoamérica.
            </p>
            <p className="text-muted-foreground">
              Trabajamos directamente con productores artesanales para traer recetas auténticas a tu mesa. Cada empanada, cada tequeño, cada arepa tiene la calidad y el sabor de lo hecho en casa.
            </p>
          </div>
          <div className="bg-primary/10 rounded-2xl p-8 text-center">
            <p className="text-5xl font-black text-primary mb-2">1.000+</p>
            <p className="font-bold">Socios activos</p>
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div>
                <p className="text-2xl font-black">7</p>
                <p className="text-sm text-muted-foreground">Productos</p>
              </div>
              <div>
                <p className="text-2xl font-black">5⭐</p>
                <p className="text-sm text-muted-foreground">Valoración media</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl md:text-3xl font-black text-center mb-10">Nuestros valores</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="bg-card rounded-xl p-6 border border-border">
                <v.icon className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-bold mb-2">{v.title}</h3>
                <p className="text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tech & AI */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <Badge variant="top" className="mb-3"><Bot className="h-3 w-3 mr-1" /> Tecnología e IA</Badge>
          <h2 className="text-2xl md:text-3xl font-black">Innovación al servicio del sabor</h2>
          <p className="text-muted-foreground mt-2 max-w-lg mx-auto">
            Usamos tecnología de vanguardia e inteligencia artificial para ofrecer la mejor experiencia.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {techFeatures.map((f) => (
            <div key={f.title} className="border border-border rounded-xl p-6 hover:border-primary/30 transition-colors">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-bold mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
}
