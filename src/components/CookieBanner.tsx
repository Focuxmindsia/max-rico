import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

const STORAGE_KEY = "cookie-consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem(STORAGE_KEY);
      if (!consent) setVisible(true);
    } catch {
      // localStorage may throw in private mode / in-app browsers — fail silently
      setVisible(true);
    }
  }, []);

  const setConsent = (value: "all" | "essential") => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ value, date: new Date().toISOString() }));
    } catch {
      // ignore storage errors so the UI still dismisses
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-50 p-4 md:p-6 animate-in slide-in-from-bottom">
      <div className="container mx-auto max-w-4xl bg-background border border-border rounded-2xl shadow-2xl p-5 md:p-6 relative">
        <button
          aria-label="Cerrar aviso de cookies"
          className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
          onClick={() => setConsent("essential")}
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1">
            <h3 className="font-black text-base mb-1">🍪 Usamos cookies</h3>
            <p className="text-sm text-muted-foreground">
              Usamos cookies técnicas para el carrito, la cuenta y los pagos. Con tu permiso, también usamos cookies analíticas para mejorar la web.{" "}
              <Link to="/legal/cookies" className="text-primary underline font-semibold">
                Más información
              </Link>
              .
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 shrink-0">
            <Button variant="outline" size="sm" onClick={() => setConsent("essential")}>
              Solo necesarias
            </Button>
            <Button variant="cta" size="sm" onClick={() => setConsent("all")}>
              Aceptar todas
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
