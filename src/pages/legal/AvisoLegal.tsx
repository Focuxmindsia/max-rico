import Layout from "@/components/layout/Layout";
import { useSeo } from "@/hooks/useSeo";

export default function LegalAviso() {
  useSeo({
    canonical: window.location.href,
    title: "Aviso Legal — MaxRico",
    description: "Información legal sobre el titular del sitio web maxrico.es conforme a la LSSICE.",
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Aviso Legal</h1>
        <p className="text-sm text-muted-foreground mb-8">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-bold mb-2">Titular del sitio</h2>
            <p>En cumplimiento de la <strong>Ley 34/2002 de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSICE)</strong>:</p>
            <ul className="list-disc pl-6 space-y-1 mt-2">
              <li><strong>Titular:</strong> MaxRico</li>
              <li><strong>Domicilio:</strong> Zaragoza (España)</li>
              <li><strong>Contacto:</strong> <a href="mailto:info@maxrico.es" className="text-primary underline">info@maxrico.es</a> · WhatsApp <a href="https://wa.me/34695798632" className="text-primary underline">+34 695 79 86 32</a></li>
              <li><strong>Dominio:</strong> maxrico.es</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">Propiedad intelectual</h2>
            <p>Todos los contenidos del sitio (textos, imágenes, logotipos, marcas) son propiedad de MaxRico o de terceros con autorización, y están protegidos por la normativa de propiedad intelectual e industrial.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">Uso del sitio</h2>
            <p>El usuario se compromete a hacer un uso lícito del sitio, sin incurrir en actividades ilegales o contrarias a la buena fe.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">Legislación aplicable</h2>
            <p>Este aviso legal se rige por la legislación española.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
