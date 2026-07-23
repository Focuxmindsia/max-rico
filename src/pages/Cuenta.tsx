import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "@/components/layout/Layout";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscription } from "@/hooks/useSubscription";
import { Button } from "@/components/ui/button";
import { Crown, LogOut } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";

export default function Cuenta() {
  const { user, signOut, loading } = useAuth();
  const { isSocio } = useSubscription();
  const navigate = useNavigate();

  useSeo({
    title: "Mi cuenta — MaxRico",
    description: "Gestiona tu cuenta, tu membresía de socio y tus pedidos en MaxRico.",
    canonical: "https://maxrico.es/cuenta",
  });

  useEffect(() => {
    if (!loading && !user) navigate("/auth", { replace: true });
  }, [loading, user, navigate]);

  if (loading || !user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-20 text-center text-muted-foreground">Cargando...</div>
      </Layout>
    );
  }

  return (
    <Layout>
      <section className="container mx-auto px-4 py-14 max-w-2xl">
        <h1 className="text-3xl md:text-4xl font-black mb-6">Mi cuenta</h1>
        <div className="border rounded-2xl p-6 space-y-4">
          <div>
            <p className="text-xs uppercase text-muted-foreground">Email</p>
            <p className="font-semibold">{user.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-muted-foreground">Estado de socio</p>
            {isSocio ? (
              <p className="font-bold text-primary flex items-center gap-1">
                <Crown className="h-4 w-4" /> Socio activo
              </p>
            ) : (
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">No eres socio todavía.</span>
                <Button size="sm" variant="cta" onClick={() => navigate("/socios")}>
                  Hazte socio
                </Button>
              </div>
            )}
          </div>
          <div className="pt-4 border-t">
            <Button
              variant="outline"
              className="gap-2"
              onClick={async () => {
                await signOut();
                navigate("/");
              }}
            >
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
