import Layout from "@/components/layout/Layout";
import { useSeo } from "@/hooks/useSeo";
import { Button } from "@/components/ui/button";

export default function LegalCookies() {
  useSeo({
    canonical: window.location.href,
    title: "Política de Cookies — MaxRico",
    description: "Qué cookies usa MaxRico y cómo puedes gestionarlas.",
  });

  const resetConsent = () => {
    localStorage.removeItem("cookie-consent");
    window.location.reload();
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Política de Cookies</h1>
        <p className="text-sm text-muted-foreground mb-8">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-bold mb-2">¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos que se descargan en tu dispositivo al visitar un sitio web. Sirven para que el sitio funcione correctamente y para analizar cómo se usa.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">Cookies que utilizamos</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Cookies técnicas (necesarias):</strong> gestión del carrito, autenticación y funcionamiento básico. No requieren consentimiento.</li>
              <li><strong>Cookies de terceros (Stripe):</strong> para procesar pagos de forma segura.</li>
              <li><strong>Cookies analíticas:</strong> solo se activan si aceptas el aviso de cookies. Nos ayudan a mejorar la web.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">Gestión de cookies</h2>
            <p className="mb-3">Puedes cambiar tu configuración en cualquier momento:</p>
            <Button variant="cta" onClick={resetConsent}>
              Volver a mostrar el aviso de cookies
            </Button>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">Cómo deshabilitarlas en el navegador</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Chrome: Configuración → Privacidad y seguridad → Cookies</li>
              <li>Firefox: Preferencias → Privacidad y seguridad</li>
              <li>Safari: Preferencias → Privacidad</li>
              <li>Edge: Configuración → Cookies y permisos del sitio</li>
            </ul>
          </section>
        </div>
      </div>
    </Layout>
  );
}
