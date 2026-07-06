import { defineTool } from "@lovable.dev/mcp-js";
import { categories, products } from "../catalog-data";

export default defineTool({
  name: "list_categories",
  title: "Listar categorías",
  description: "Devuelve las categorías del catálogo MaxRico y el número de productos en cada una.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => {
    const counts = categories.map((c) => ({
      category: c,
      count: products.filter((p) => p.category === c).length,
    }));
    return {
      content: [{ type: "text", text: JSON.stringify(counts, null, 2) }],
      structuredContent: { categories: counts },
    };
  },
});
