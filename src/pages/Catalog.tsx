import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/catalog/ProductCard";
import Layout from "@/components/layout/Layout";
import { useSeo } from "@/hooks/useSeo";

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating";

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState("Todos los Productos Congelados");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");

  useSeo({
    title: "Catálogo MaxRico | maxrico.es/catalogo — Empanadas, Arepas y Tequeños",
    description:
      "Catálogo MaxRico (maxrico.es/catalogo): empanadas colombianas, arepas, tequeños, pandebono y chorizos congelados. Pide por WhatsApp o hazte socio por 59€/año.",
    canonical: "https://maxrico.es/catalogo",
    keywords:
      "maxrico.es/catalogo, MaxRico catálogo, catalogo MaxRico, empanadas colombianas, arepas, tequeños, pandebono, congelados latinos España",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Catálogo MaxRico",
      url: "https://maxrico.es/catalogo",
      inLanguage: "es-ES",
      isPartOf: { "@type": "WebSite", name: "MaxRico", url: "https://maxrico.es/" },
      about: "Productos congelados latinos: empanadas, arepas, tequeños, pandebono, chorizos",
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Inicio", item: "https://maxrico.es/" },
          { "@type": "ListItem", position: 2, name: "Catálogo", item: "https://maxrico.es/catalogo" },
        ],
      },
    },
  });

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
    switch (sort) {
      case "price-asc":
        return [...result].sort((a, b) => a.price - b.price);
      case "price-desc":
        return [...result].sort((a, b) => b.price - a.price);
      case "rating":
        return [...result].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
      default:
        return result;
    }
  }, [selectedCategory, search, sort]);

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl md:text-4xl font-black mb-2">
          Catálogo <span translate="no" className="notranslate">MaxRico</span>
        </h1>
        <p className="text-muted-foreground mb-8">
          Encuentra tus productos latinos congelados favoritos en maxrico.es/catalogo
        </p>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar productos..."
              className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="px-4 py-2.5 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          >
            <option value="relevance">Relevancia</option>
            <option value="price-asc">Precio: menor a mayor</option>
            <option value="price-desc">Precio: mayor a menor</option>
            <option value="rating">Mejor valorados</option>
          </select>
        </div>

        {/* Categories */}
        <div className="flex flex-wrap gap-2 mb-8">
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

        {/* Results */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-muted-foreground text-lg">No se encontraron productos</p>
            <p className="text-sm text-muted-foreground mt-1">Prueba con otra búsqueda o categoría</p>
          </div>
        )}
      </div>
    </Layout>
  );
}
