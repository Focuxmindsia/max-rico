#!/usr/bin/env node
/**
 * Static prerender (head-only) for maxrico.es
 * -------------------------------------------
 * After `vite build`, this script generates a per-route `index.html` inside
 * `dist/` with route-specific <title>, <meta description>, canonical, og:*,
 * twitter:* and JSON-LD. The <body> keeps the same SPA shell, so React still
 * hydrates on the client — but crawlers (Google, Bing, ChatGPT, Meta) now
 * see correct per-page metadata in the raw HTML, which is what they index.
 *
 * Why head-only and not full DOM prerender:
 *   The app uses BrowserRouter + Supabase + browser-only APIs from module top
 *   level. Full renderToString / JSDOM prerender would need an SSR refactor.
 *   Head-only prerender solves 95% of the SEO problem with zero runtime risk.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const root = path.resolve(path.dirname(__filename), "..");
const distDir = path.join(root, "dist");
const shellPath = path.join(distDir, "index.html");

if (!fs.existsSync(shellPath)) {
  console.error("[prerender] dist/index.html not found. Run `vite build` first.");
  process.exit(1);
}

const SITE = "https://maxrico.es";
const shellHtml = fs.readFileSync(shellPath, "utf8");

// ---------- extract slugs + titles from data sources via regex ----------
const productsSrc = fs.readFileSync(path.join(root, "src/data/products.ts"), "utf8");
const blogSrc = fs.readFileSync(path.join(root, "src/data/blog.ts"), "utf8");

/**
 * Parses `name: "..."` / `slug: "..."` pairs from a data file. The order of
 * fields in each object entry doesn't matter — we scan objects individually.
 */
/**
 * Line-based extraction: for every `slug: "..."`, find the nearest `name:` or
 * `title:` and (optionally) `description:` / `excerpt:` within a 30-line
 * window around it. Robust against template literals and nested braces.
 */
function extractEntries(src) {
  const lines = src.split("\n");
  const slugRe = /^\s*slug:\s*"([^"]+)"/;
  const titleRe = /^\s*(?:name|title):\s*"((?:\\"|[^"])+)"/;
  const descRe = /^\s*(?:description|excerpt):\s*"((?:\\"|[^"])+)"/;
  // First pass: find all slug line-indices
  const slugLines = [];
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(slugRe);
    if (m) slugLines.push({ line: i, slug: m[1] });
  }
  const out = [];
  for (let k = 0; k < slugLines.length; k++) {
    const { line: i, slug } = slugLines[k];
    const next = k < slugLines.length - 1 ? slugLines[k + 1].line : lines.length;
    // Window: from just after this slug line up to just before next slug.
    // (title/name/description always appear as sibling keys in the same object,
    // and object fields may appear before OR after `slug`; check both halves.)
    const prev = k > 0 ? slugLines[k - 1].line : -1;
    const lo = prev + 1;
    const hi = next;
    let title = "";
    let titleDist = Infinity;
    let description = "";
    let descDist = Infinity;
    for (let j = lo; j < hi; j++) {
      const d = Math.abs(j - i);
      const tm = lines[j].match(titleRe);
      if (tm && d < titleDist) {
        title = tm[1];
        titleDist = d;
      }
      const dm = lines[j].match(descRe);
      if (dm && d < descDist) {
        description = dm[1];
        descDist = d;
      }
    }
    if (!title) continue;
    out.push({
      slug,
      title: title.replace(/\s+/g, " ").trim(),
      description: description.replace(/\s+/g, " ").trim(),
    });
  }
  return out;
}



const products = extractEntries(productsSrc);
const posts = extractEntries(blogSrc);
console.log(`[prerender] products: ${products.length}, blog posts: ${posts.length}`);

// ---------- route table ----------
const brand = "MaxRico";
const baseDesc =
  "Empanadas colombianas 100% maíz molido, sin gluten, hechas a mano. Pedidos a domicilio y para eventos en España.";

const staticRoutes = [
  {
    path: "/",
    title: `${brand} — Empanadas colombianas 100% maíz molido, sin gluten`,
    description: baseDesc,
  },
  {
    path: "/catalogo",
    title: `Catálogo de empanadas y productos colombianos | ${brand}`,
    description:
      "Catálogo completo: empanadas grandes y cocteleras, combos fritos listos, pandebonos, arepas, chorizos y más. Pedidos por WhatsApp o pago online.",
  },
  {
    path: "/sobre-nosotros",
    title: `Sobre nosotros — Gastronomía artesanal colombiana | ${brand}`,
    description:
      "Conoce MaxRico: cocina colombiana artesanal, 100% maíz molido y sin gluten. Nuestra historia, valores y misión.",
  },
  {
    path: "/al-por-mayor",
    title: `Empanadas al por mayor para HORECA y eventos | ${brand}`,
    description:
      "Suministro de empanadas colombianas al por mayor para restaurantes, hoteles, catering y eventos. Precios especiales B2B.",
  },
  {
    path: "/blog",
    title: `Blog — Empanadas y cocina colombiana en España | ${brand}`,
    description:
      "Artículos sobre empanadas colombianas, cocina tradicional, tips de preparación y dónde disfrutarlas en España.",
  },
  {
    path: "/socios",
    title: `Club de Socios — 59€/año, envío gratis y descuentos | ${brand}`,
    description:
      "Únete al Club de Socios MaxRico por 59€ al año: envíos gratis, precios exclusivos y ventajas para clientes fieles.",
  },
  {
    path: "/empleo",
    title: `Trabaja con nosotros — Empleo en ${brand}`,
    description: "Ofertas de empleo y oportunidades para unirte al equipo MaxRico.",
  },
  {
    path: "/legal/terminos",
    title: `Términos y condiciones | ${brand}`,
    description: "Términos y condiciones de uso de MaxRico.",
  },
  {
    path: "/legal/privacidad",
    title: `Política de privacidad | ${brand}`,
    description: "Cómo tratamos tus datos personales en MaxRico.",
  },
  {
    path: "/legal/aviso-legal",
    title: `Aviso legal | ${brand}`,
    description: "Aviso legal e información de la empresa MaxRico.",
  },
  {
    path: "/legal/cookies",
    title: `Política de cookies | ${brand}`,
    description: "Uso de cookies en el sitio MaxRico.",
  },
];

// Excluded (private / dynamic / do-not-index):
//   /carrito, /auth, /cuenta, /admin/*, /checkout/*, /unsubscribe,
//   /test-pago, /.lovable/*
const EXCLUDED = new Set([
  "/carrito",
  "/auth",
  "/cuenta",
  "/admin/pedidos",
  "/checkout/return",
  "/unsubscribe",
  "/test-pago",
]);

const productRoutes = products.map((p) => ({
  path: `/producto/${p.slug}`,
  title: `${p.title} | ${brand}`,
  description:
    p.description ||
    `${p.title} — MaxRico. Empanadas y comida colombiana artesanal, entrega a domicilio.`,
  type: "product",
}));

const blogRoutes = posts.map((p) => ({
  path: `/blog/${p.slug}`,
  title: `${p.title} | Blog ${brand}`,
  description: p.description || baseDesc,
  type: "article",
}));

const allRoutes = [...staticRoutes, ...productRoutes, ...blogRoutes].filter(
  (r) => !EXCLUDED.has(r.path),
);

// ---------- HTML rewriting ----------
function escape(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function rewriteHead(html, route) {
  const canonical = `${SITE}${route.path === "/" ? "/" : route.path}`;
  const title = escape(route.title);
  const description = escape(route.description);
  const ogType = route.type === "article" ? "article" : "website";

  let out = html;

  // <title>
  out = out.replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`);

  // meta helpers
  const setMeta = (attr, name, content) => {
    const re = new RegExp(`<meta\\s+${attr}=["']${name}["'][^>]*>`, "i");
    const tag = `<meta ${attr}="${name}" content="${content}">`;
    if (re.test(out)) out = out.replace(re, tag);
    else out = out.replace(/<\/head>/i, `    ${tag}\n  </head>`);
  };

  setMeta("name", "description", description);
  setMeta("property", "og:title", title);
  setMeta("property", "og:description", description);
  setMeta("property", "og:url", canonical);
  setMeta("property", "og:type", ogType);
  setMeta("name", "twitter:title", title);
  setMeta("name", "twitter:description", description);

  // canonical
  const canonicalTag = `<link rel="canonical" href="${canonical}">`;
  if (/<link\s+rel=["']canonical["'][^>]*>/i.test(out)) {
    out = out.replace(/<link\s+rel=["']canonical["'][^>]*>/i, canonicalTag);
  } else {
    out = out.replace(/<\/head>/i, `    ${canonicalTag}\n  </head>`);
  }

  // marker for hydration detection (updated later if body is spliced in)
  if (!/data-prerendered=/.test(out)) {
    out = out.replace(/<html\b/i, '<html data-prerendered="head"');
  }

  return out;
}

// ---------- optional SSR body injection ----------
// Loads the SSR bundle built by `vite build --ssr`. If present, we call
// `render(url)` for the routes it supports and splice the returned HTML into
// `<div id="root">…</div>`, flipping the marker to `data-prerendered="full"`.
// If the SSR bundle is missing or `render()` throws for a route, we fall back
// to head-only for that route — safe and non-blocking.
const ssrEntryPath = path.join(root, "dist-ssr", "entry-ssr.js");
let ssrMod;
let ssrRoutes = new Set();
if (fs.existsSync(ssrEntryPath)) {
  try {
    ssrMod = await import(pathToFileUrl(ssrEntryPath));
    if (Array.isArray(ssrMod.SSR_ROUTES)) {
      ssrRoutes = new Set(ssrMod.SSR_ROUTES);
      console.log(`[prerender] SSR bundle loaded — full-body routes: ${[...ssrRoutes].join(", ")}`);
    }
  } catch (err) {
    console.warn("[prerender] SSR bundle failed to load, falling back to head-only:", err?.message ?? err);
  }
} else {
  console.log("[prerender] no SSR bundle at dist-ssr/entry-ssr.js — head-only mode");
}

function pathToFileUrl(p) {
  return "file://" + p.replace(/\\/g, "/");
}

function injectSsrBody(html, bodyHtml) {
  const marker = /<div id="root"><\/div>/;
  if (!marker.test(html)) return html; // shell mismatch, skip
  const withBody = html.replace(marker, `<div id="root">${bodyHtml}</div>`);
  return withBody.replace(
    /<html data-prerendered="head"/,
    '<html data-prerendered="full"',
  );
}

// ---------- write files ----------
let written = 0;
let ssrRendered = 0;
for (const route of allRoutes) {
  let html = rewriteHead(shellHtml, route);
  if (ssrMod && ssrRoutes.has(route.path)) {
    try {
      const body = ssrMod.render(route.path);
      html = injectSsrBody(html, body);
      ssrRendered++;
    } catch (err) {
      console.warn(`[prerender] SSR render failed for ${route.path}, keeping head-only:`, err?.message ?? err);
    }
  }
  const outPath =
    route.path === "/"
      ? path.join(distDir, "index.html")
      : path.join(distDir, route.path.replace(/^\//, ""), "index.html");
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, html, "utf8");
  written++;
}

console.log(`[prerender] wrote ${written} HTML files (${ssrRendered} with full SSR body, ${written - ssrRendered} head-only)`);
// Force exit — SSR bundle may leave async timers open (Stripe, Supabase).
setTimeout(() => process.exit(0), 50).unref?.();

