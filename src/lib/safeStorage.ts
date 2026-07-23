/**
 * Safe storage shim.
 *
 * Some in-app browsers (Instagram, Facebook, TikTok WebViews) and private/incognito
 * modes throw on ANY access to window.localStorage / window.sessionStorage — not just
 * on setItem, but sometimes even on the property getter itself.
 *
 * The Supabase auth client uses localStorage internally to persist the session, and a
 * single throw during module init is enough to leave the app on a blank white screen.
 *
 * This module wraps both Storage objects with try/catch on every method and falls back
 * to an in-memory Map when the real storage is unusable. It MUST be imported before
 * anything that touches storage (i.e. as the very first import in main.tsx).
 */

type StorageLike = {
  readonly length: number;
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
  clear(): void;
  key(index: number): string | null;
};

function createMemoryStorage(): StorageLike {
  const map = new Map<string, string>();
  return {
    get length() {
      return map.size;
    },
    getItem(key) {
      return map.has(key) ? map.get(key)! : null;
    },
    setItem(key, value) {
      map.set(key, String(value));
    },
    removeItem(key) {
      map.delete(key);
    },
    clear() {
      map.clear();
    },
    key(index) {
      return Array.from(map.keys())[index] ?? null;
    },
  };
}

function wrap(real: Storage | null, label: string): StorageLike {
  const memory = createMemoryStorage();

  // Probe the real storage. If access itself throws, or write/read is blocked,
  // fall through to the in-memory fallback entirely.
  let usable = false;
  try {
    if (real) {
      const probeKey = "__safe_storage_probe__";
      real.setItem(probeKey, "1");
      real.removeItem(probeKey);
      usable = true;
    }
  } catch {
    usable = false;
  }

  if (!usable) {
    // eslint-disable-next-line no-console
    console.warn(`[safeStorage] ${label} unavailable — using in-memory fallback`);
    return memory;
  }

  return {
    get length() {
      try {
        return real!.length;
      } catch {
        return memory.length;
      }
    },
    getItem(key) {
      try {
        return real!.getItem(key);
      } catch {
        return memory.getItem(key);
      }
    },
    setItem(key, value) {
      try {
        real!.setItem(key, value);
      } catch {
        memory.setItem(key, value);
      }
    },
    removeItem(key) {
      try {
        real!.removeItem(key);
      } catch {
        memory.removeItem(key);
      }
    },
    clear() {
      try {
        real!.clear();
      } catch {
        memory.clear();
      }
    },
    key(index) {
      try {
        return real!.key(index);
      } catch {
        return memory.key(index);
      }
    },
  };
}

function install(prop: "localStorage" | "sessionStorage") {
  let real: Storage | null = null;
  try {
    // Accessing the getter itself can throw in locked-down WebViews.
    real = window[prop];
  } catch {
    real = null;
  }

  const safe = wrap(real, prop);

  try {
    Object.defineProperty(window, prop, {
      configurable: true,
      get() {
        return safe;
      },
    });
  } catch {
    // Some browsers refuse to redefine the property. In that case we can't
    // protect direct `window.localStorage` access, but the probe above already
    // confirmed it works, so leaving the native object in place is safe.
  }
}

if (typeof window !== "undefined") {
  install("localStorage");
  install("sessionStorage");
}

export {};
