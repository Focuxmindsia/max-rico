import Layout from "@/components/layout/Layout";
import { useSeo } from "@/hooks/useSeo";

export default function LegalPrivacidad() {
  useSeo({
    canonical: window.location.href,
    title: "Política de Privacidad — MaxRico",
    description: "Cómo MaxRico recopila, usa y protege tus datos personales según el RGPD y la LOPDGDD.",
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Política de Privacidad</h1>
        <p className="text-sm text-muted-foreground mb-8">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>

        <div className="space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-bold mb-2">1. Responsable del tratamiento</h2>
            <p><strong>MaxRico</strong> · Zaragoza (España) · <a href="mailto:clientes@maxrico.es" className="text-primary underline">clientes@maxrico.es</a></p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">2. Datos que recopilamos</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Datos de identificación y contacto (nombre, email, teléfono, dirección).</li>
              <li>Datos de pedido y facturación.</li>
              <li>Datos de navegación (cookies técnicas y analíticas).</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">3. Finalidad</h2>
            <ul className="list-disc pl-6 space-y-1">
              <li>Gestionar pedidos, entregas y facturación.</li>
              <li>Gestión de la membresía y de tu cuenta.</li>
              <li>Envío de emails transaccionales (confirmaciones, recibos).</li>
              <li>Cumplimiento de obligaciones legales y fiscales.</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">4. Legitimación</h2>
            <p>Ejecución del contrato de compra, consentimiento del interesado y cumplimiento de obligaciones legales.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">5. Encargados del tratamiento</h2>
            <p>Trabajamos con proveedores que cumplen con el RGPD: <strong>Stripe</strong> (pagos), <strong>Supabase</strong> (hosting y base de datos, servidores en la UE), <strong>Mailgun</strong> (envío de emails).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">6. Conservación</h2>
            <p>Conservamos los datos mientras dure la relación comercial y, tras su fin, durante los plazos legales aplicables (6 años a efectos fiscales).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">7. Tus derechos</h2>
            <p>Puedes ejercer los derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad enviando un email a <a href="mailto:clientes@maxrico.es" className="text-primary underline">clientes@maxrico.es</a>. También puedes reclamar ante la <strong>Agencia Española de Protección de Datos</strong> (aepd.es).</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
