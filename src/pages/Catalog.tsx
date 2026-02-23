import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { products, categories } from "@/data/products";
import ProductCard from "@/components/catalog/ProductCard";
import Layout from "@/components/layout/Layout";

type SortOption = "relevance" | "price-asc" | "price-desc" | "rating";

export default function Catalog() {
  const [selectedCategory, setSelectedCategory] = useState("Todas");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("relevance");

  const filtered = useMemo(() => {
    let result = products;
    if (selectedCategory !== "Todas") {
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
        <h1 className="text-3xl md:text-4xl font-black mb-2">Catálogo</h1>
        <p className="text-muted-foreground mb-8">
          Encuentra tus productos latinos congelados favoritos
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
