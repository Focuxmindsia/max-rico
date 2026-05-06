import { Link } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { posts } from "@/data/blog";
import { useSeo } from "@/hooks/useSeo";

export default function Blog() {
  useSeo({
    title: "Blog MaxRico | Empanadas colombianas, recetas y sabores latinos en España",
    description:
      "Blog de MaxRico (maxrico.es): artículos sobre empanadas colombianas en España, recetas, beneficios del maíz, sin gluten, comida latina, tequeños, arepas y mucho más. Envío a toda España desde Zaragoza.",
    canonical: "https://maxrico.es/blog",
    keywords:
      "blog MaxRico, maxrico.es, masrico, empanadas colombianas en España, empanadas Zaragoza, empanadas sin gluten, empanadas de maíz, empanadas a domicilio, comida colombiana España, recetas empanadas, arepas, tequeños, pandebono",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Blog",
      name: "Blog MaxRico",
      url: "https://maxrico.es/blog",
      publisher: { "@type": "Organization", name: "MaxRico" },
    },
  });

  return (
    <Layout>
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge variant="top" className="mb-4">Blog <span translate="no" className="notranslate">MaxRico</span></Badge>
          <h1 className="text-3xl md:text-5xl font-black mb-4">
            Sabores latinos, historias auténticas
          </h1>
          <p className="text-background/70 text-lg max-w-2xl">
            Recetas, consejos y artículos sobre empanadas colombianas, comida latina y los productos artesanales de <span translate="no" className="notranslate">MaxRico</span> en España.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-5xl">
        <div className="grid gap-8 md:grid-cols-2">
          {posts.map((post) => (
            <Link
              key={post.slug}
              to={`/blog/${post.slug}`}
              className="group rounded-2xl overflow-hidden border border-border hover:border-primary/40 transition-all hover:shadow-lg bg-card"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                <img
                  src={post.cover}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
              </div>
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 3).map((t) => (
                    <Badge key={t} variant="secondary" className="text-[10px]">
                      {t}
                    </Badge>
                  ))}
                </div>
                <h2 className="text-xl md:text-2xl font-black mb-2 group-hover:text-primary transition-colors">
                  {post.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center gap-3">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" /> {new Date(post.date).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" })}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readingTime}</span>
                  </div>
                  <span className="text-primary font-semibold flex items-center gap-1">
                    Leer <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-16 p-8 rounded-2xl bg-secondary">
          <h3 className="text-2xl font-black mb-2">¿Hambre de empanadas?</h3>
          <p className="text-muted-foreground mb-4">Explora todo el catálogo y recibe envío a toda España.</p>
          <Link to="/catalogo">
            <Button variant="cta" size="lg">Ver catálogo <ArrowRight className="h-4 w-4 ml-1" /></Button>
          </Link>
        </div>
      </section>
    </Layout>
  );
}
