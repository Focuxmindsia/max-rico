import esbuild from "esbuild";
import fs from "fs";
import path from "path";

const stubPlugin = {
  name: "stub-assets",
  setup(build) {
    build.onResolve({ filter: /\.(png|jpe?g|webp|svg|gif|avif)$/ }, args => ({ path: args.path, namespace: "stub" }));
    build.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: 'export default "";', loader: "js" }));
    build.onResolve({ filter: /^@\// }, args => ({ path: path.resolve("/dev-server/src", args.path.slice(2)) }));
    build.onResolve({ filter: /^\// }, args => ({ path: args.path, namespace: "stub" }));
  }
};

const res = await esbuild.build({
  entryPoints: ["/dev-server/src/data/products.ts"],
  bundle: true, format: "esm", write: false, platform: "neutral",
  plugins: [stubPlugin],
});
fs.writeFileSync("/tmp/products-bundle.mjs", res.outputFiles[0].text);
const mod = await import("/tmp/products-bundle.mjs");
const stripped = mod.products.map(p => ({
  id: p.id, slug: p.slug, name: p.name, category: p.category,
  description: p.description, ingredients: p.ingredients,
  preparation: p.preparation, conservation: p.conservation,
  price: p.price, originalPrice: p.originalPrice ?? null,
  memberPrice: p.memberPrice, packSize: p.packSize,
  weight: p.weight ?? null, format: p.format ?? null,
  soldOut: !!p.soldOut, badge: p.badge ?? null,
}));
fs.writeFileSync("/dev-server/src/lib/mcp/catalog-data.ts",
`// AUTO-GENERATED from src/data/products.ts. Do not edit by hand.
export const categories = ${JSON.stringify(mod.categories, null, 2)} as const;
export const products = ${JSON.stringify(stripped, null, 2)} as const;
`);
console.log("wrote", stripped.length, "products,", mod.categories.length, "categories");
