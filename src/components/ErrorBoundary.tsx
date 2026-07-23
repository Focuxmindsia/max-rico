import { Component, ReactNode } from "react";
import { copyCurrentUrl, isInAppBrowser, openInExternalBrowser } from "@/lib/inAppBrowser";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  copied: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, copied: false };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: unknown) {
    // eslint-disable-next-line no-console
    console.error("[ErrorBoundary] Render error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleOpenExternal = async () => {
    const ok = await copyCurrentUrl();
    this.setState({ copied: ok });
    openInExternalBrowser();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    const inApp = isInAppBrowser();

    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "24px",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          background: "#ffffff",
          color: "#0a0a0a",
        }}
      >
        <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>😔</div>
          <h1 style={{ fontSize: 22, fontWeight: 800, margin: "0 0 8px" }}>
            Algo ha fallado al cargar la página
          </h1>
          <p style={{ fontSize: 14, color: "#525252", margin: "0 0 20px" }}>
            {inApp
              ? "Parece que estás usando el navegador interno de una red social. Para la mejor experiencia, ábrelo en tu navegador (Chrome o Safari)."
              : "Ha ocurrido un problema inesperado. Por favor recarga la página o inténtalo de nuevo en unos minutos."}
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button
              onClick={this.handleReload}
              style={{
                background: "#FFD400",
                color: "#0a0a0a",
                border: "none",
                borderRadius: 10,
                padding: "12px 16px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Recargar página
            </button>
            <button
              onClick={this.handleOpenExternal}
              style={{
                background: "#ffffff",
                color: "#0a0a0a",
                border: "2px solid #0a0a0a",
                borderRadius: 10,
                padding: "12px 16px",
                fontWeight: 700,
                fontSize: 15,
                cursor: "pointer",
              }}
            >
              Abrir en el navegador
            </button>
            {this.state.copied && (
              <p style={{ fontSize: 12, color: "#059669", margin: "4px 0 0" }}>
                Enlace copiado al portapapeles ✓
              </p>
            )}
          </div>

          <p style={{ fontSize: 11, color: "#a3a3a3", marginTop: 20 }}>
            Si el problema continúa, escríbenos por WhatsApp al +34 695 798 632.
          </p>
        </div>
      </div>
    );
  }
}
