import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

// Local typed wrapper for the beta supabase.auth.oauth namespace
type OAuthApi = {
  getAuthorizationDetails: (id: string) => Promise<{ data: any; error: any }>;
  approveAuthorization: (id: string) => Promise<{ data: any; error: any }>;
  denyAuthorization: (id: string) => Promise<{ data: any; error: any }>;
};
const oauthApi = (supabase.auth as unknown as { oauth: OAuthApi }).oauth;

function isSameOriginRelative(path: string | null): path is string {
  return !!path && path.startsWith("/") && !path.startsWith("//");
}

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) return setError("Falta el parámetro authorization_id");
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        const next = window.location.pathname + window.location.search;
        window.location.href = "/auth?next=" + encodeURIComponent(next);
        return;
      }
      const { data, error } = await oauthApi.getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (error) return setError(error.message);
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    const { data, error } = approve
      ? await oauthApi.approveAuthorization(authorizationId)
      : await oauthApi.denyAuthorization(authorizationId);
    if (error) {
      setBusy(false);
      return setError(error.message);
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      return setError("El servidor de autorización no devolvió una URL de redirección.");
    }
    window.location.href = target;
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-white">
        <div className="max-w-md w-full border-2 border-red-300 rounded-xl p-6 bg-red-50">
          <h1 className="text-xl font-black text-red-700 mb-2">No se pudo cargar la autorización</h1>
          <p className="text-black/80">{error}</p>
        </div>
      </main>
    );
  }
  if (!details) {
    return (
      <main className="min-h-screen flex items-center justify-center p-6 bg-white">
        <p className="text-black/70">Cargando…</p>
      </main>
    );
  }

  const clientName = details.client?.name ?? "una aplicación externa";
  return (
    <main className="min-h-screen flex items-center justify-center p-6 bg-white">
      <div className="max-w-md w-full border-2 border-yellow-400 rounded-xl p-6 bg-yellow-50 space-y-4">
        <h1 className="text-2xl font-black">
          Conectar <span className="notranslate" translate="no">{clientName}</span> a MaxRico
        </h1>
        <p className="text-black/80">
          {clientName} podrá usar las herramientas del catálogo de MaxRico como tú mientras estés
          conectado.
        </p>
        <p className="text-sm text-black/70">
          Esto no salta las políticas ni los permisos internos de MaxRico.
        </p>
        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            disabled={busy}
            onClick={() => decide(false)}
            className="flex-1"
          >
            Cancelar
          </Button>
          <Button
            disabled={busy}
            onClick={() => decide(true)}
            className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-black font-bold"
          >
            Autorizar
          </Button>
        </div>
      </div>
    </main>
  );
}
