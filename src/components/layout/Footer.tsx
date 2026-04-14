import { Link } from "react-router-dom";

const footerSections = [
  {
    title: "Comprar",
    links: [
      { to: "/catalogo", label: "Catálogo" },
      { to: "/socios", label: "Hazte socio" },
      { to: "/catalogo?cat=Empanadas", label: "Empanadas" },
      { to: "/catalogo?cat=Tequeños", label: "Tequeños" },
    ],
  },
  {
    title: "Empresa",
    links: [
      { to: "/sobre-nosotros", label: "Sobre nosotros" },
      { to: "/empleo", label: "Trabaja con nosotros" },
      { to: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Soporte",
    links: [
      { to: "/cuenta", label: "Mi cuenta" },
      { to: "/carrito", label: "Carrito" },
      { to: "#", label: "Contacto" },
      { to: "#", label: "FAQ" },
    ],
  },
  {
    title: "Legal",
    links: [
      { to: "#", label: "Términos y condiciones" },
      { to: "#", label: "Política de privacidad" },
      { to: "#", label: "Cookies" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-foreground text-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-md bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-black text-sm">MR</span>
              </div>
              <span className="font-black text-lg">MaxRico</span>
            </div>
            <p className="text-sm text-background/60 leading-relaxed">
              Sabores latinos, calidad top, precios de socio. Tu club de congelados premium.
            </p>
          </div>

          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-bold text-sm mb-3 text-primary">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      className="text-sm text-background/60 hover:text-background transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-background/10 mt-10 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-background/40">
            © {new Date().getFullYear()} MaxRico. Todos los derechos reservados.
          </p>
          <p className="text-xs text-background/40">
            Hecho con ❤️ y tecnología e IA
          </p>
        </div>
      </div>
    </footer>
  );
}
