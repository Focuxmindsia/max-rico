// Load polyfills FIRST — before any import that may touch browser globals.
import "./lib/ssr-polyfills";

import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Routes, Route } from "react-router-dom";
import { CartProvider } from "@/contexts/CartContext";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "@/pages/Index";
import CatalogoPublico from "@/pages/CatalogoPublico";
import ProductDetail from "@/pages/ProductDetail";
import Blog from "@/pages/Blog";
import BlogPost from "@/pages/BlogPost";
import Socios from "@/pages/Socios";
import AboutUs from "@/pages/AboutUs";
import AlPorMayor from "@/pages/AlPorMayor";
import { products } from "@/data/products";
import { posts } from "@/data/blog";

/**
 * Routes we currently prerender full-body. Keep this list conservative —
 * pages listed here MUST render safely without browser globals at render
 * time (event handlers / effects are fine, they never run during SSR).
 */
export const SSR_ROUTES: string[] = [
  "/",
  "/catalogo",
  "/blog",
  "/socios",
  "/sobre-nosotros",
  "/al-por-mayor",
  ...products.map((p) => `/producto/${p.slug}`),
  ...posts.map((p) => `/blog/${p.slug}`),
];

export function render(url: string): string {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false, staleTime: Infinity } },
  });
  return renderToString(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <StaticRouter location={url}>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/catalogo" element={<CatalogoPublico />} />
              <Route path="/producto/:id" element={<ProductDetail />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/socios" element={<Socios />} />
              <Route path="/sobre-nosotros" element={<AboutUs />} />
              <Route path="/al-por-mayor" element={<AlPorMayor />} />
            </Routes>
          </StaticRouter>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>,
  );
}

