import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { products } from "../catalog-data";

export default defineTool({
  name: "list_products",
  title: "Listar productos MaxRico",
  description:
    "Devuelve el catálogo de productos artesanales colombianos (empanadas, tequeños, PandeBono, arepas, chorizos, etc.) con precio normal, precio socio y disponibilidad.",
  inputSchema: {
    category: z
      .string()
      .optional()
      .describe("Filtro opcional por categoría (ej: Empanadas, PandeBono, Arepas)."),
    onlyAvailable: z
      .boolean()
      .optional()
      .describe("Si es true, excluye productos agotados."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, onlyAvailable }) => {
    const filtered = products.filter((p) => {
      if (category && p.category.toLowerCase() !== category.toLowerCase()) return false;
      if (onlyAvailable && p.soldOut) return false;
      return true;
    });
    const rows = filtered.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      price_eur: p.price,
      member_price_eur: p.memberPrice,
      pack_size: p.packSize,
      weight: p.weight ?? null,
      sold_out: !!p.soldOut,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(rows, null, 2) }],
      structuredContent: { products: rows },
    };
  },
});
