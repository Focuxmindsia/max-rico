import productEmpanadaCarneTernera from "@/assets/empanada-carne-ternera-x10.jpeg";
import productEmpanadasGrandesPollo from "@/assets/empanadas-pollo-v2.jpg";
import productEmpanadasCocteleras17 from "@/assets/combo-17-fritas.png";
import productEmpanadasCocteleras51 from "@/assets/combo-51-fritas.png";
import productEmpanadas from "@/assets/product-empanadas-v2.jpg";
import comboXXLMixto from "/combo-xxl-mixto.png";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  readingTime: string;
  author: string;
  tags: string[];
  keywords: string;
}

export const posts: BlogPost[] = [
  {
    slug: "empanadas-colombianas-en-espana",
    title:
      "Empanadas Colombianas en España: 100% maíz molido, sin gluten y a domicilio",
    excerpt:
      "Descubre por qué las empanadas de MaxRico son las más auténticas de España: 100% maíz molido, sin harinas de trigo, sin gluten, y rellenas solo con carne de ternera o pollo. Envío a toda España desde Zaragoza.",
    cover: productEmpanadaCarneTernera,
    date: "2026-05-06",
    readingTime: "6 min",
    author: "Equipo MaxRico",
    tags: ["Empanadas", "Colombia", "Sin gluten", "Zaragoza", "España"],
    keywords:
      "MaxRico, Max Rico, maxrico.es, masrico, masrico.es, empanadas colombianas, empanadas colombianas en España, empanadas España, empanadas Zaragoza, empanadas a domicilio, empanadas congeladas, empanadas sin gluten, empanadas de maíz, empanadas de pollo, empanadas de ternera, comida colombiana en España, empanadas más rico, comprar empanadas online",
  },
];

export const blogImages = {
  hero: productEmpanadaCarneTernera,
  pollo: productEmpanadasGrandesPollo,
  cocteleras17: productEmpanadasCocteleras17,
  cocteleras51: productEmpanadasCocteleras51,
  grandes: productEmpanadas,
  combo: comboXXLMixto,
};
