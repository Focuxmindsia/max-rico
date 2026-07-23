/**
 * SSR-time polyfills. Loaded FIRST from `entry-ssr.tsx` so any transitive
 * module that touches `localStorage`, `sessionStorage`, `window`, or
 * `document` at import time (e.g. the Supabase client) does not crash the
 * Node prerender.
 *
 * These stubs are inert — they only exist for module-init side effects.
 * Runtime browser code (Supabase auth calls, Stripe, meta pixel) runs inside
 * `useEffect` / event handlers and therefore never executes during SSR.
 */

type StorageLike = {
  length: number;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
};

function memStorage(): StorageLike {
  const m = new Map<string, string>();
  return {
    get length() {
      return m.size;
    },
    getItem: (k) => (m.has(k) ? m.get(k)! : null),
    setItem: (k, v) => void m.set(k, String(v)),
    removeItem: (k) => void m.delete(k),
    clear: () => m.clear(),
    key: (i) => Array.from(m.keys())[i] ?? null,
  };
}

const g = globalThis as unknown as Record<string, unknown>;

if (typeof g.localStorage === "undefined") g.localStorage = memStorage();
if (typeof g.sessionStorage === "undefined") g.sessionStorage = memStorage();

// Minimal window/document shims. React DOM Server does NOT touch document,
// but Supabase's `detectSessionInUrl` reads `window.location` at init.
if (typeof g.window === "undefined") {
  g.window = {
    location: {
      href: "https://maxrico.es/",
      origin: "https://maxrico.es",
      pathname: "/",
      search: "",
      hash: "",
    },
    localStorage: g.localStorage,
    sessionStorage: g.sessionStorage,
    addEventListener: () => {},
    removeEventListener: () => {},
    matchMedia: () => ({
      matches: false,
      media: "",
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  } as unknown;
}

if (typeof g.document === "undefined") {
  const noop = () => {};
  const elementStub = {
    setAttribute: noop,
    getAttribute: () => null,
    appendChild: noop,
    removeChild: noop,
    addEventListener: noop,
    removeEventListener: noop,
    style: {},
  };
  g.document = {
    documentElement: { lang: "es", setAttribute: noop, getAttribute: () => null },
    createElement: () => ({ ...elementStub }),
    head: { appendChild: noop, querySelector: () => null, querySelectorAll: () => [] },
    body: { appendChild: noop, querySelector: () => null, querySelectorAll: () => [] },
    addEventListener: noop,
    removeEventListener: noop,
    querySelector: () => null,
    querySelectorAll: () => [],
    getElementsByTagName: () => [],
    getElementById: () => null,
  } as unknown;
}


if (typeof g.navigator === "undefined") {
  g.navigator = { userAgent: "node-ssr" } as unknown;
}

export {};
