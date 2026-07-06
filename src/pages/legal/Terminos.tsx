import Layout from "@/components/layout/Layout";
import { useSeo } from "@/hooks/useSeo";

export default function LegalTerminos() {
  useSeo({
    canonical: window.location.href,
    title: "Términos y Condiciones — MaxRico",
    description: "Términos y condiciones de uso y venta de MaxRico. Información sobre pedidos, pagos, envíos y devoluciones.",
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black mb-2">Términos y Condiciones</h1>
        <p className="text-sm text-muted-foreground mb-8">Última actualización: {new Date().toLocaleDateString("es-ES")}</p>

        <div className="prose prose-sm max-w-none space-y-6 text-foreground/90">
          <section>
            <h2 className="text-xl font-bold mb-2">1. Titular</h2>
            <p>Este sitio web (maxrico.es) es titularidad de <strong>MaxRico</strong>, ubicado en Zaragoza (España). Contacto: <a href="mailto:clientes@maxrico.es" className="text-primary underline">clientes@maxrico.es</a> · WhatsApp <a href="https://wa.me/34695798632" className="text-primary underline">+34 695 79 86 32</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">2. Objeto</h2>
            <p>Las presentes condiciones regulan la venta de productos gastronómicos artesanales colombianos a través de la web maxrico.es, así como el uso de la Membresía MaxRico (59 €/año).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">3. Pedidos y precios</h2>
            <p>Los precios se muestran en euros e incluyen IVA. Los socios ven un precio reducido. Los pedidos se confirman por email tras el pago. MaxRico se reserva el derecho a rechazar pedidos por causas justificadas (stock, error tipográfico, etc.).</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">4. Pago</h2>
            <p>Los pagos se procesan a través de <strong>Stripe</strong>. No almacenamos ningún dato de tarjeta en nuestros servidores.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">5. Entrega</h2>
            <p>Envío en Zaragoza capital. Los gastos de envío se indican antes de confirmar el pedido. El plazo estimado es de 24-72 h laborables.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">6. Desistimiento y devoluciones</h2>
            <p>Al tratarse de <strong>productos alimentarios frescos o congelados</strong>, el derecho de desistimiento previsto en el art. 103.d) del RDL 1/2007 <strong>no aplica</strong> una vez el pedido ha sido enviado, salvo defecto de calidad. En caso de producto defectuoso, contacta con nosotros en 48 h desde la recepción.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">7. Membresía MaxRico</h2>
            <p>La membresía anual (59 €) se renueva automáticamente. Puedes cancelarla en cualquier momento desde tu cuenta; la cancelación tendrá efecto al finalizar el período pagado.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">8. Responsabilidad</h2>
            <p>MaxRico no se hace responsable de reacciones alérgicas cuando el cliente no ha revisado la sección de alérgenos publicada en cada ficha de producto.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold mb-2">9. Legislación aplicable</h2>
            <p>Estas condiciones se rigen por la legislación española. Cualquier controversia se someterá a los Juzgados de Zaragoza, salvo que la ley de consumidores disponga otra cosa.</p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
