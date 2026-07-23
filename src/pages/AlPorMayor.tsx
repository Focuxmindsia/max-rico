import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Truck, Building2, Utensils, PackageCheck, PhoneCall } from "lucide-react";
import { useSeo } from "@/hooks/useSeo";

const WHATSAPP_URL =
  "https://wa.me/34695798632?text=" +
  encodeURIComponent(
    "Hola MaxRico, estoy interesado en vuestros productos al por mayor para mi negocio."
  );

const faqs = [
  {
    q: "¿Cuál es el pedido mínimo para negocios?",
    a: "El pedido mínimo mayorista es orientativo de 150€ (placeholder — a confirmar por el dueño). Para restaurantes, bares o cafeterías con pedidos recurrentes valoramos condiciones especiales.",
  },
  {
    q: "¿A qué zonas hacéis envío?",
    a: "Hacemos entrega en Zaragoza capital con vehículo propio y enviamos productos ultracongelados a toda España mediante transporte refrigerado (placeholder — a confirmar por el dueño).",
  },
  {
    q: "¿Manejáis precios mayoristas / tarifa HORECA?",
    a: "Sí. Disponemos de una tarifa específica para hostelería (HORECA), restaurantes colombianos y latinos, cafeterías y food trucks, con descuentos por volumen (placeholder — a confirmar por el dueño).",
  },
  {
    q: "¿Cuáles son los tiempos de entrega?",
    a: "En Zaragoza capital: 24–48h. Envíos ultracongelados a España peninsular: 24–72h laborables (placeholder — a confirmar por el dueño).",
  },
];

const productos = [
  "Empanadas colombianas 100% maíz (grandes y cocteleras)",
  "Arepas rellenas y para rellenar",
  "Tequeños",
  "PandeBono colombiano",
  "Chorizo santarrosano y chorizo XL",
  "Combos fritos listos para consumir",
];

export default function AlPorMayor() {
  useSeo({
    title: "Venta al por mayor — MaxRico | Distribuidor de empanadas y productos latinos en España",
    description:
      "MaxRico distribuye empanadas colombianas, arepas, tequeños, PandeBono y chorizos a bares, restaurantes, cafeterías y hostelería (HORECA) en Zaragoza y toda España. Pedidos recurrentes y precios mayoristas.",
    canonical: "https://maxrico.es/al-por-mayor",
    keywords:
      "empanadas al por mayor España, distribuidor productos colombianos España, mayorista empanadas Zaragoza, HORECA colombiano, catering latino, proveedor arepas tequeños",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-foreground text-background py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Badge variant="top" className="mb-4">Para Negocios y Eventos</Badge>
          <h1 className="text-4xl md:text-5xl font-black mb-4">
            Venta <span className="text-primary">al por mayor</span> para bares, restaurantes y hostelería
          </h1>
          <p className="text-background/70 text-lg mb-6">
            <span translate="no" className="notranslate">MaxRico</span> es distribuidor de productos colombianos
            y latinos en España. Suministramos empanadas, arepas, tequeños, PandeBono y chorizos a HORECA con
            pedidos recurrentes y precios mayoristas.
          </p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="cta" size="lg" className="gap-2">
              <PhoneCall className="h-5 w-5" /> Hablar por WhatsApp — +34 695 798 632
            </Button>
          </a>
        </div>
      </section>

      {/* Beneficios */}
      <section className="container mx-auto px-4 py-16 grid md:grid-cols-3 gap-6">
        {[
          { icon: Building2, title: "HORECA & Retail", desc: "Bares, restaurantes, cafeterías, food trucks y tiendas latinas." },
          { icon: Truck, title: "Envío a toda España", desc: "Ultracongelados con cadena de frío o entrega diaria en Zaragoza." },
          { icon: PackageCheck, title: "Pedidos recurrentes", desc: "Programa tu reposición semanal o mensual con precio cerrado." },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="border rounded-2xl p-6">
            <Icon className="h-8 w-8 text-primary mb-3" />
            <h3 className="font-black text-lg mb-1">{title}</h3>
            <p className="text-muted-foreground text-sm">{desc}</p>
          </div>
        ))}
      </section>

      {/* Catálogo mayorista */}
      <section className="bg-secondary py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl font-black mb-6 flex items-center gap-2">
            <Utensils className="h-7 w-7 text-primary" /> Catálogo mayorista
          </h2>
          <ul className="grid sm:grid-cols-2 gap-3">
            {productos.map((p) => (
              <li key={p} className="bg-background rounded-lg px-4 py-3 border">
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="container mx-auto px-4 py-16 max-w-3xl">
        <h2 className="text-3xl font-black mb-6">Preguntas frecuentes</h2>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`}>
              <AccordionTrigger className="text-left font-bold">{f.q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </section>

      {/* CTA final */}
      <section className="bg-primary text-primary-foreground py-14 text-center">
        <div className="container mx-auto px-4 max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-black mb-3">¿Quieres una cotización para tu negocio?</h2>
          <p className="mb-6">Cuéntanos qué productos necesitas y en qué cantidad. Te respondemos en menos de 24h.</p>
          <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="lg" className="gap-2">
              <PhoneCall className="h-5 w-5" /> Solicitar cotización por WhatsApp
            </Button>
          </a>
        </div>
      </section>
    </Layout>
  );
}
