import { Link, useParams, Navigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, CheckCircle2, Truck, Wheat, Leaf, Flame, MapPin } from "lucide-react";
import { posts, blogImages } from "@/data/blog";
import { useSeo } from "@/hooks/useSeo";

export default function BlogPost() {
  const { slug } = useParams();
  const post = posts.find((p) => p.slug === slug);

  if (!post) return <Navigate to="/blog" replace />;

  useSeo({
    title: `${post.title} | Blog MaxRico`,
    description: post.excerpt,
    canonical: `https://maxrico.es/blog/${post.slug}`,
    keywords: post.keywords,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Article",
      headline: post.title,
      description: post.excerpt,
      image: [`https://maxrico.es${post.cover}`],
      author: { "@type": "Organization", name: "MaxRico" },
      publisher: {
        "@type": "Organization",
        name: "MaxRico",
        url: "https://maxrico.es",
      },
      datePublished: post.date,
      mainEntityOfPage: `https://maxrico.es/blog/${post.slug}`,
      keywords: post.keywords,
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative bg-foreground text-background overflow-hidden">
        <div className="absolute inset-0">
          <img src={post.cover} alt={post.title} className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/40" />
        </div>
        <div className="relative container mx-auto px-4 py-20 md:py-28 max-w-4xl">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((t) => (
              <Badge key={t} variant="top">{t}</Badge>
            ))}
          </div>
          <h1 className="text-3xl md:text-5xl font-black mb-4 leading-tight">{post.title}</h1>
          <p className="text-background/70 text-lg max-w-2xl mb-6">{post.excerpt}</p>
          <div className="flex flex-wrap items-center gap-4 text-sm text-background/60">
            <span className="flex items-center gap-1"><Calendar className="h-4 w-4" /> {new Date(post.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span className="flex items-center gap-1"><Clock className="h-4 w-4" /> {post.readingTime} de lectura</span>
            <span>· {post.author}</span>
          </div>
        </div>
      </section>

      {/* CTA superior */}
      <section className="bg-primary py-4">
        <div className="container mx-auto px-4 max-w-4xl flex flex-wrap items-center justify-between gap-3">
          <p className="font-bold text-primary-foreground">
            🥟 Empanadas colombianas auténticas, envío a toda España.
          </p>
          <Link to="/catalogo">
            <Button variant="hero" size="sm" className="bg-foreground text-background hover:bg-foreground/90">
              Ver catálogo <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Contenido */}
      <article className="container mx-auto px-4 py-16 max-w-3xl prose-custom">
        <p className="text-lg leading-relaxed text-foreground/90 mb-8">
          En <strong translate="no" className="notranslate">MaxRico</strong> llevamos a tu mesa el sabor real de Colombia: empanadas
          artesanales hechas con <strong>100% maíz molido</strong>, sin harinas de trigo, sin gluten,
          y rellenas únicamente con <strong>carne de ternera</strong> o <strong>carne de pollo</strong>{" "}
          de calidad. Cocinamos como en casa, congelamos al instante y enviamos a toda España desde Zaragoza.
        </p>

        {/* Bloque destacado: por qué nuestras empanadas */}
        <div className="grid sm:grid-cols-2 gap-4 my-10 not-prose">
          {[
            { icon: Wheat, title: "100% maíz molido", desc: "Sin harinas de trigo. Masa auténtica colombiana." },
            { icon: Leaf, title: "Sin gluten", desc: "Aptas para celíacos e intolerantes al gluten." },
            { icon: Flame, title: "Solo ternera y pollo", desc: "Carnes seleccionadas, recetas tradicionales." },
            { icon: Truck, title: "Envío nacional", desc: "Desde Zaragoza a toda España, en frío." },
          ].map((b) => (
            <div key={b.title} className="flex gap-3 p-4 rounded-xl border border-border bg-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <b.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-bold">{b.title}</p>
                <p className="text-sm text-muted-foreground">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <h2 className="text-2xl md:text-3xl font-black mt-12 mb-4">
          ¿Qué hace especiales a las empanadas colombianas de <span translate="no" className="notranslate">MaxRico</span>?
        </h2>
        <p className="leading-relaxed mb-4">
          La empanada colombiana se distingue del resto por su masa de <strong>maíz amarillo molido</strong>,
          que aporta una textura crujiente por fuera y suave por dentro. A diferencia de las empanadas argentinas
          o españolas (hechas con harina de trigo), la nuestra es <strong>naturalmente sin gluten</strong>, más
          ligera y con un sabor inconfundible.
        </p>
        <p className="leading-relaxed mb-6">
          En <span translate="no" className="notranslate">MaxRico</span> respetamos esa tradición: nuestras empanadas se elaboran
          con receta colombiana, congeladas al momento para que conserven todo su sabor hasta tu cocina,
          ya estés en <strong>Zaragoza, Madrid, Barcelona, Valencia, Sevilla o cualquier punto de España</strong>.
        </p>

        <figure className="my-10 not-prose">
          <img
            src={blogImages.pollo}
            alt="Empanadas colombianas de pollo MaxRico"
            className="w-full rounded-2xl shadow-lg"
            loading="lazy"
          />
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            Empanadas grandes de pollo mechado · 100% maíz, sin gluten.
          </figcaption>
        </figure>

        <h2 className="text-2xl md:text-3xl font-black mt-12 mb-4">Beneficios de comer empanadas de maíz</h2>
        <ul className="space-y-3 not-prose mb-6">
          {[
            "Naturalmente sin gluten: aptas para celíacos.",
            "Energía de calidad gracias a los carbohidratos complejos del maíz.",
            "Aportan fibra, antioxidantes y minerales como magnesio y fósforo.",
            "Más digestibles que las masas de trigo refinado.",
            "Versátiles: ideales para comidas, cenas, picoteo o eventos.",
          ].map((t) => (
            <li key={t} className="flex gap-3">
              <CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <span>{t}</span>
            </li>
          ))}
        </ul>

        <h2 className="text-2xl md:text-3xl font-black mt-12 mb-4">
          Empanadas de ternera y empanadas de pollo: solo lo esencial
        </h2>
        <p className="leading-relaxed mb-4">
          En <span translate="no" className="notranslate">MaxRico</span> no usamos rellenos extraños ni mezclas de carnes raras.
          Solo trabajamos con dos proteínas, las dos más queridas de la cocina colombiana:
        </p>
        <div className="grid md:grid-cols-2 gap-6 my-8 not-prose">
          <div className="rounded-2xl overflow-hidden border border-border bg-card">
            <img src={blogImages.hero} alt="Empanadas de ternera MaxRico" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <div className="p-5">
              <h3 className="font-black text-lg mb-1">Empanadas de ternera</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Carne de ternera guisada con papa, cebolla y especias. Sabor profundo, masa crujiente.
              </p>
              <Link to="/catalogo">
                <Button variant="cta" size="sm">Ver catálogo <ArrowRight className="h-3 w-3 ml-1" /></Button>
              </Link>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border bg-card">
            <img src={blogImages.pollo} alt="Empanadas de pollo MaxRico" className="w-full aspect-[4/3] object-cover" loading="lazy" />
            <div className="p-5">
              <h3 className="font-black text-lg mb-1">Empanadas de pollo</h3>
              <p className="text-sm text-muted-foreground mb-3">
                Pollo mechado jugoso, especias suaves y masa de maíz dorada. Favorita de toda la familia.
              </p>
              <Link to="/catalogo">
                <Button variant="cta" size="sm">Ver catálogo <ArrowRight className="h-3 w-3 ml-1" /></Button>
              </Link>
            </div>
          </div>
        </div>

        <h2 className="text-2xl md:text-3xl font-black mt-12 mb-4">
          Empanadas cocteleras: el aperitivo perfecto para eventos
        </h2>
        <p className="leading-relaxed mb-6">
          ¿Vas a organizar un cumpleaños, una boda, una reunión de empresa o un cóctel?
          Nuestras <strong>empanadas cocteleras</strong> de 8 cm son el snack ideal: tamaño bocado, sabor gigante.
          Disponibles en packs de 17 y 51 unidades, en pollo o ternera.
        </p>
        <div className="grid grid-cols-2 gap-4 my-8 not-prose">
          <img src={blogImages.cocteleras17} alt="Empanadas cocteleras pack 17" className="w-full rounded-xl shadow-md" loading="lazy" />
          <img src={blogImages.cocteleras51} alt="Empanadas cocteleras pack 51" className="w-full rounded-xl shadow-md" loading="lazy" />
        </div>

        <h2 className="text-2xl md:text-3xl font-black mt-12 mb-4">
          ¿Cómo prepararlas? Horno, freidora de aire o sartén
        </h2>
        <p className="leading-relaxed mb-4">
          Nuestras empanadas llegan <strong>congeladas a -18°C</strong>, listas para cocinar sin descongelar:
        </p>
        <ul className="space-y-2 mb-6 not-prose">
          <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span><strong>Air fryer:</strong> 180°C durante 12 min. Crujientes y sin aceite extra.</span></li>
          <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span><strong>Horno:</strong> 200°C durante 15 min.</span></li>
          <li className="flex gap-3"><CheckCircle2 className="h-5 w-5 text-primary shrink-0 mt-0.5" /><span><strong>Freidora tradicional:</strong> aceite a 180°C, 4-5 min hasta dorar.</span></li>
        </ul>

        <figure className="my-10 not-prose">
          <img src={blogImages.combo} alt="Combo XXL empanadas MaxRico" className="w-full rounded-2xl shadow-lg" loading="lazy" />
          <figcaption className="text-center text-sm text-muted-foreground mt-2">
            Combos XXL para compartir · Empanadas, tequeños y más.
          </figcaption>
        </figure>

        <h2 className="text-2xl md:text-3xl font-black mt-12 mb-4">
          Empanadas colombianas en Zaragoza y envío a toda España
        </h2>
        <p className="leading-relaxed mb-4">
          <span translate="no" className="notranslate">MaxRico</span> nace en <strong>Zaragoza</strong>, pero llevamos el sabor colombiano a todo el país.
          Si buscas <em>empanadas colombianas en España</em>, <em>empanadas congeladas</em>, <em>empanadas a domicilio</em>{" "}
          o <em>comida colombiana cerca de ti</em>, en <a href="https://maxrico.es" className="text-primary underline">maxrico.es</a> tienes el catálogo completo.
        </p>
        <p className="leading-relaxed mb-4">
          Servimos a particulares (B2C) y también a <strong>negocios y eventos</strong> (B2B): bares, restaurantes,
          cafeterías y caterings que quieren sumar producto latino auténtico a su carta.
        </p>
        <p className="flex items-center gap-2 text-muted-foreground mb-8">
          <MapPin className="h-4 w-4" /> Origen: Zaragoza · Envío: toda la península.
        </p>

        <h2 className="text-2xl md:text-3xl font-black mt-12 mb-4">
          Hazte socio del club <span translate="no" className="notranslate">MaxRico</span>
        </h2>
        <p className="leading-relaxed mb-6">
          Por solo <strong>59€/año</strong> accedes a precios de socio en todo el catálogo, envío gratis en pedidos
          elegibles y promociones exclusivas. Es nuestra forma de premiar a quienes hacen de las empanadas
          colombianas un imprescindible de su cocina.
        </p>

        {/* CTA final */}
        <div className="not-prose my-12 p-8 rounded-2xl bg-foreground text-background text-center">
          <h3 className="text-2xl md:text-3xl font-black mb-2">Pide hoy tus empanadas <span translate="no" className="notranslate">MaxRico</span></h3>
          <p className="text-background/70 mb-6 max-w-md mx-auto">
            100% maíz, sin gluten, solo ternera y pollo. Envío a toda España desde Zaragoza.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/catalogo">
              <Button variant="cta" size="lg">Ver catálogo <ArrowRight className="h-4 w-4 ml-1" /></Button>
            </Link>
            <Link to="/socios">
              <Button variant="hero" size="lg" className="border border-background/20">
                Hazte socio — 59€/año
              </Button>
            </Link>
          </div>
        </div>

        <p className="text-xs text-muted-foreground mt-10">
          Palabras clave: MaxRico, Max Rico, maxrico.es, masrico, masrico.es, MaxRico empanadas,
          empanadas más rico, empanadas colombianas, empanadas colombianas en España, empanadas España,
          empanadas Zaragoza, empanadas a domicilio, empanadas congeladas, empanadas sin gluten,
          empanadas de maíz, empanadas de pollo, empanadas de ternera, comida colombiana en España,
          arepas, tequeños, pandebono.
        </p>
      </article>
    </Layout>
  );
}
