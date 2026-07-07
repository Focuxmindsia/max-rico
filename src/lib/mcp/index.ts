import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listProducts from "./tools/list-products";
import getProduct from "./tools/get-product";
import listCategories from "./tools/list-categories";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "maxrico-mcp",
  title: "MaxRico — Catálogo",
  version: "0.1.0",
  instructions:
    "Herramientas de solo lectura del catálogo de MaxRico (gastronomía artesanal colombiana, 100% maíz molido, sin gluten). Usa list_categories y list_products para explorar el catálogo, y get_product para la ficha completa. Los pedidos se hacen en https://maxrico.es o por WhatsApp +34 695798632.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listProducts, getProduct, listCategories],
});
