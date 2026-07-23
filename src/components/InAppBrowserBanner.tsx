import { useEffect, useState } from "react";
import { copyCurrentUrl, detectInAppName, openInExternalBrowser } from "@/lib/inAppBrowser";

const DISMISS_KEY = "inapp-banner-dismissed";

function safeGet(key: string): string | null {
  try {
    return sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function safeSet(key: string, value: string) {
  try {
    sessionStorage.setItem(key, value);
  } catch {}
}

export default function InAppBrowserBanner() {
  const [visible, setVisible] = useState(false);
  const [name, setName] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const n = detectInAppName();
    if (n && !safeGet(DISMISS_KEY)) {
      setName(n);
      setVisible(true);
    }
  }, []);

  if (!visible) return null;

  const handleOpen = async () => {
    const ok = await copyCurrentUrl();
    setCopied(ok);
    openInExternalBrowser();
  };

  const handleDismiss = () => {
    safeSet(DISMISS_KEY, "1");
    setVisible(false);
  };

  return (
    <div
      role="alert"
      style={{
        position: "sticky",
        top: 0,
        zIndex: 60,
        background: "#FFF7CC",
        color: "#0a0a0a",
        borderBottom: "1px solid #F5CE00",
        padding: "8px 12px",
        fontSize: 13,
        lineHeight: 1.35,
        display: "flex",
        alignItems: "center",
        gap: 10,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <strong>Estás en {name}.</strong>{" "}
        Para la mejor experiencia de compra, toca los tres puntos (⋯) y elige{" "}
        <strong>"Abrir en el navegador"</strong>.
        {copied && (
          <span style={{ color: "#059669", marginLeft: 6 }}>Enlace copiado ✓</span>
        )}
      </div>
      <button
        onClick={handleOpen}
        style={{
          background: "#0a0a0a",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "6px 10px",
          fontWeight: 700,
          fontSize: 12,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Abrir
      </button>
      <button
        onClick={handleDismiss}
        aria-label="Cerrar aviso"
        style={{
          background: "transparent",
          border: "none",
          color: "#525252",
          fontSize: 18,
          lineHeight: 1,
          cursor: "pointer",
          padding: "0 4px",
        }}
      >
        ×
      </button>
    </div>
  );
}
