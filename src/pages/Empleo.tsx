import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PhoneCall, Users } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";

const WHATSAPP_URL =
  "https://wa.me/34695798632?text=" +
  encodeURIComponent("Hola MaxRico, me gustaría trabajar con vosotros. Os envío mi candidatura.");

export default function Empleo() {
  useSeo({
    title: "Trabaja con nosotros — MaxRico | Empleo en Zaragoza",
    description:
      "Únete al equipo de MaxRico en Zaragoza. Buscamos personas apasionadas por la gastronomía colombiana y latina.",
    canonical: "https://maxrico.es/empleo",
  });

  return (
    <Layout>
      <section className="bg-foreground text-background py-16">
        <div className="container mx-auto px-4 max-w-3xl">
          <Badge variant="top" className="mb-4">Empleo</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Trabaja con <span className="text-primary">nosotros</span>
          </h1>
          <p className="text-background/70 text-lg">
            En <span translate="no" className="notranslate">MaxRico</span> valoramos el talento, el buen ambiente
            y el amor por la cocina colombiana. Si quieres formar parte del equipo, escríbenos.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-2xl text-center">
        <Users className="h-10 w-10 text-primary mx-auto mb-4" />
        <h2 className="text-2xl md:text-3xl font-black mb-3">Envíanos tu candidatura</h2>
        <p className="text-muted-foreground mb-6">
          Mándanos tu CV y una breve presentación por WhatsApp. Te contactaremos si encajas con alguna
          vacante actual o futura.
        </p>
        <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
          <Button variant="cta" size="lg" className="gap-2">
            <PhoneCall className="h-5 w-5" /> Enviar candidatura por WhatsApp
          </Button>
        </a>
      </section>
    </Layout>
  );
}
