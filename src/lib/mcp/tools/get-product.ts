import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { products } from "../catalog-data";

export default defineTool({
  name: "get_product",
  title: "Detalle de producto",
  description:
    "Devuelve la ficha completa de un producto MaxRico por slug o id: descripción, ingredientes, preparación, conservación, precios y disponibilidad.",
  inputSchema: {
    slugOrId: z.string().min(1).describe("Slug o id del producto."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ slugOrId }) => {
    const key = slugOrId.toLowerCase();
    const p = products.find(
      (x) => x.slug.toLowerCase() === key || x.id.toLowerCase() === key,
    );
    if (!p) {
      return {
        content: [{ type: "text", text: `No se encontró ningún producto con "${slugOrId}".` }],
        isError: true,
      };
    }
    const row = {
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      description: p.description,
      ingredients: p.ingredients,
      preparation: p.preparation,
      conservation: p.conservation,
      price_eur: p.price,
      original_price_eur: p.originalPrice ?? null,
      member_price_eur: p.memberPrice,
      pack_size: p.packSize,
      weight: p.weight ?? null,
      format: p.format ?? null,
      sold_out: !!p.soldOut,
      badge: p.badge ?? null,
      url: `https://maxrico.es/producto/${p.slug}`,
    };
    return {
      content: [{ type: "text", text: JSON.stringify(row, null, 2) }],
      structuredContent: { product: row },
    };
  },
});
