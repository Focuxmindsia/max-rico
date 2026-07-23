import productEmpanadaCarneTernera from "@/assets/empanada-carne-ternera-x10.jpeg";
import productEmpanadasGrandesPollo from "@/assets/empanadas-pollo-v2.jpg";
import productEmpanadasCocteleras17 from "/combo-17-fritas-new.jpg";
import productEmpanadasCocteleras51 from "/combo-51-fritas-new.png";
import productEmpanadas from "@/assets/product-empanadas-v2.jpg";
import comboXXLMixto from "/combo-xxl-mixto.png";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  cover: string;
  date: string;
  readingTime: string;
  author: string;
  tags: string[];
  keywords: string;
  /** Optional rich HTML body. If absent, the default template renders. */
  bodyHtml?: string;
}

const ctaHtml = `
  <div class="not-prose my-10 p-6 rounded-2xl bg-primary text-primary-foreground text-center">
    <p class="font-black text-lg mb-3">¿Antojo de empanadas colombianas auténticas?</p>
    <a href="/catalogo" class="inline-block bg-foreground text-background font-bold px-5 py-3 rounded-md">Ver catálogo →</a>
  </div>
`;

export const posts: BlogPost[] = [
  {
    slug: "empanadas-colombianas-en-espana",
    title: "Empanadas Colombianas en España: 100% maíz molido, sin gluten y a domicilio",
    excerpt:
      "Descubre por qué las empanadas de MaxRico son las más auténticas de España: 100% maíz molido, sin harinas de trigo, sin gluten, y rellenas solo con carne de ternera o pollo. Envío a toda España desde Zaragoza.",
    cover: productEmpanadaCarneTernera,
    date: "2026-05-06",
    readingTime: "6 min",
    author: "Equipo MaxRico",
    tags: ["Empanadas", "Colombia", "Sin gluten", "Zaragoza", "España"],
    keywords:
      "MaxRico, empanadas colombianas, empanadas colombianas en España, empanadas Zaragoza, empanadas a domicilio, empanadas congeladas, empanadas sin gluten, empanadas de maíz, empanadas de pollo, empanadas de ternera, comida colombiana en España",
  },
  {
    slug: "empanadas-colombianas-zaragoza",
    title: "Empanadas Colombianas en Zaragoza: dónde comprarlas y pedirlas a domicilio",
    excerpt:
      "Guía definitiva de las empanadas colombianas en Zaragoza: dónde comprarlas, cómo pedirlas a domicilio y por qué MaxRico se ha convertido en referente de la gastronomía latina en Aragón.",
    cover: productEmpanadasGrandesPollo,
    date: "2026-06-12",
    readingTime: "5 min",
    author: "Equipo MaxRico",
    tags: ["Zaragoza", "Empanadas", "Colombia", "Domicilio"],
    keywords:
      "empanadas Zaragoza, empanadas colombianas Zaragoza, comida colombiana Zaragoza, empanadas a domicilio Zaragoza, MaxRico Zaragoza, delivery empanadas Zaragoza, restaurante colombiano Zaragoza",
    bodyHtml: `
      <p class="text-lg leading-relaxed mb-6">Si buscas <strong>empanadas colombianas en Zaragoza</strong>, has llegado al lugar correcto. En <span translate="no" class="notranslate">MaxRico</span> elaboramos empanadas artesanales con receta 100% colombiana y las enviamos calientes o congeladas a toda la capital aragonesa.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">¿Por qué Zaragoza se enamoró de la empanada colombiana?</h2>
      <p class="mb-4">La empanada colombiana no se parece a ninguna otra: masa de <strong>maíz amarillo molido</strong>, corteza crujiente y relleno jugoso. En Zaragoza, cada vez más familias buscan alternativas <strong>sin gluten</strong> y con sabor real. Nuestra masa, sin trigo ni conservantes, encaja perfectamente.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Pedidos a domicilio en Zaragoza capital</h2>
      <p class="mb-4">Servimos <strong>domicilio directo en Zaragoza</strong> (barrios como Centro, Delicias, Actur, La Almozara, Torrero, Las Fuentes, Universidad, Casablanca, Valdespartera, Miralbueno) con nuestros combos fritos listos para consumir. También ofrecemos <strong>recogida en local</strong> y envío nacional para toda España.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Combos fritos calientes vs. congelados</h2>
      <ul class="space-y-2 mb-6 list-disc pl-6">
        <li><strong>Combos fritos:</strong> te llegan ya cocinados y calientes, con domicilio incluido en Zaragoza capital.</li>
        <li><strong>Congelados:</strong> los preparas en tu casa en air fryer, horno o sartén. Envío a toda España.</li>
      </ul>

      ${ctaHtml}

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Eventos y catering colombiano en Zaragoza</h2>
      <p class="mb-6">Organizamos <strong>catering de empanadas colombianas para eventos</strong> en Zaragoza: bodas, cumpleaños, eventos de empresa y fiestas privadas. Empanadas cocteleras, arepas, chorizo santarrosano y salsas de la casa.</p>

      <p class="text-sm text-muted-foreground">Contacto directo por WhatsApp: <a class="text-primary underline" href="https://wa.me/34695798632">+34 695 798 632</a>.</p>
    `,
  },
  {
    slug: "empanadas-congeladas-domicilio-espana",
    title: "Empanadas congeladas a domicilio en toda España: cómo pedirlas online",
    excerpt:
      "Cómo comprar empanadas colombianas congeladas online y recibirlas en cualquier punto de España. Envíos refrigerados desde Zaragoza, sin perder sabor ni textura.",
    cover: productEmpanadas,
    date: "2026-06-20",
    readingTime: "5 min",
    author: "Equipo MaxRico",
    tags: ["Congeladas", "Envío", "España", "Online"],
    keywords:
      "empanadas congeladas, empanadas congeladas España, comprar empanadas online, empanadas a domicilio España, empanadas congeladas Madrid, empanadas congeladas Barcelona, empanadas congeladas Valencia",
    bodyHtml: `
      <p class="text-lg leading-relaxed mb-6">Las <strong>empanadas congeladas de MaxRico</strong> llegan a cualquier ciudad de España conservando toda la frescura del día en que se elaboraron. Envío nacional refrigerado desde Zaragoza.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">¿Cómo funciona el envío?</h2>
      <ol class="space-y-2 mb-6 list-decimal pl-6">
        <li>Eliges tus productos en el <a class="text-primary underline" href="/catalogo">catálogo</a>.</li>
        <li>Nosotros las congelamos justo tras elaborarlas, a -18°C.</li>
        <li>Las enviamos con transporte refrigerado en 24–72 h a toda la península.</li>
        <li>Las guardas en tu congelador hasta 3 meses.</li>
      </ol>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Ciudades donde ya enviamos</h2>
      <p class="mb-4">Madrid, Barcelona, Valencia, Sevilla, Málaga, Bilbao, Zaragoza, Alicante, Murcia, Palma, Vitoria, Pamplona, Logroño, Valladolid, Salamanca, Santander, San Sebastián, Girona, Tarragona, Castellón y muchas más.</p>

      ${ctaHtml}

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Envío gratis para socios</h2>
      <p class="mb-4">Con la <a class="text-primary underline" href="/socios">membresía anual (59€/año)</a> obtienes envío gratis en pedidos elegibles, descuentos y acceso anticipado a nuevos productos.</p>
    `,
  },
  {
    slug: "empanadas-sin-gluten-maiz",
    title: "Empanadas sin gluten: por qué las de maíz colombiano son las mejores",
    excerpt:
      "Las empanadas colombianas son naturalmente sin gluten. Descubre los beneficios de la masa de maíz molido frente a las masas de trigo y por qué son aptas para celíacos.",
    cover: productEmpanadaCarneTernera,
    date: "2026-06-28",
    readingTime: "4 min",
    author: "Equipo MaxRico",
    tags: ["Sin gluten", "Celíacos", "Maíz", "Salud"],
    keywords:
      "empanadas sin gluten, empanadas para celíacos, empanadas de maíz, comida sin gluten España, empanadas colombianas sin gluten, gluten free empanadas",
    bodyHtml: `
      <p class="text-lg leading-relaxed mb-6">Las empanadas colombianas se elaboran con <strong>masa de maíz molido</strong>, no de trigo. Eso las convierte en una opción <strong>naturalmente sin gluten</strong>, apta para celíacos y personas con sensibilidad al gluten.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Trigo vs. maíz: la gran diferencia</h2>
      <p class="mb-4">Las empanadas argentinas, gallegas o hojaldradas se hacen con harina de trigo. La empanada colombiana usa maíz amarillo cocido y molido — sin trazas de gluten en su masa. En <span translate="no" class="notranslate">MaxRico</span> respetamos esa tradición.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Beneficios del maíz molido</h2>
      <ul class="space-y-2 mb-6 list-disc pl-6">
        <li>Sin gluten (apto celíacos).</li>
        <li>Aporta fibra y carbohidratos complejos.</li>
        <li>Rico en magnesio y fósforo.</li>
        <li>Más digestible que las masas refinadas de trigo.</li>
      </ul>

      ${ctaHtml}

      <p class="text-sm text-muted-foreground">Nota: nuestras instalaciones manipulan otros productos; si tienes celiaquía estricta, consúltanos por WhatsApp antes de tu pedido.</p>
    `,
  },
  {
    slug: "comida-colombiana-en-espana",
    title: "Comida colombiana en España: guía de sabores, platos y dónde comprarlos",
    excerpt:
      "De las empanadas al pandebono, pasando por arepas, tequeños y chorizo santarrosano. Guía completa de la gastronomía colombiana en España y cómo disfrutarla desde casa.",
    cover: comboXXLMixto,
    date: "2026-07-04",
    readingTime: "7 min",
    author: "Equipo MaxRico",
    tags: ["Colombia", "Gastronomía", "España", "Latina"],
    keywords:
      "comida colombiana España, gastronomía colombiana, arepas España, tequeños España, pandebono España, chorizo santarrosano, comida latina España, productos colombianos España",
    bodyHtml: `
      <p class="text-lg leading-relaxed mb-6">La <strong>gastronomía colombiana</strong> es una de las más variadas de Latinoamérica: maíz, plátano, quesos frescos, carnes ahumadas y salsas caseras. En España, cada vez más gente busca esos sabores auténticos.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Los imprescindibles</h2>
      <ul class="space-y-3 mb-6 list-disc pl-6">
        <li><strong>Empanadas colombianas</strong>: masa de maíz, sin gluten, rellenas de ternera o pollo.</li>
        <li><strong>Arepas</strong>: discos de maíz molido, rellenas de queso mozzarella.</li>
        <li><strong>Pandebono</strong>: pan colombiano de queso y almidón de yuca.</li>
        <li><strong>Tequeños</strong>: palitos de masa rellenos de queso, crujientes por fuera.</li>
        <li><strong>Chorizo santarrosano</strong>: chorizo artesanal a la parrilla, típico del eje cafetero.</li>
        <li><strong>Salsas de la casa</strong>: ají tradicional, ají picante de tomate, salsa de perejil, salsa picante casera.</li>
      </ul>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">¿Dónde comprarlos en España?</h2>
      <p class="mb-4">En <a class="text-primary underline" href="/catalogo">maxrico.es/catalogo</a> encuentras todos estos productos con envío nacional. Además, si vives en Zaragoza puedes recibir combos fritos ya calientes, listos para consumir.</p>

      ${ctaHtml}

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Para negocios y eventos</h2>
      <p class="mb-4">Restaurantes, bares y caterings en España pueden trabajar con nosotros al por mayor. Escríbenos por WhatsApp al <a class="text-primary underline" href="https://wa.me/34695798632">+34 695 798 632</a>.</p>
    `,
  },
  {
    slug: "como-preparar-empanadas-air-fryer",
    title: "Cómo preparar empanadas colombianas en air fryer, horno o sartén",
    excerpt:
      "Guía paso a paso para preparar empanadas colombianas congeladas en freidora de aire, horno o sartén. Trucos para que queden doraditas y crujientes por fuera y jugosas por dentro.",
    cover: productEmpanadasCocteleras17,
    date: "2026-07-10",
    readingTime: "4 min",
    author: "Equipo MaxRico",
    tags: ["Recetas", "Air fryer", "Cocina"],
    keywords:
      "cómo preparar empanadas, empanadas air fryer, empanadas al horno, empanadas fritas, empanadas congeladas cómo hacer, freidora de aire empanadas",
    bodyHtml: `
      <p class="text-lg leading-relaxed mb-6">Preparar las <strong>empanadas colombianas MaxRico</strong> desde congeladas es rapidísimo. Estos son los tres métodos que recomendamos.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">1. Air fryer (freidora de aire)</h2>
      <p class="mb-2"><strong>Nuestro método favorito.</strong> Precalienta a 180°C. Coloca las empanadas sin descongelar, sin engrasar. Cocina 12 minutos, dando la vuelta a mitad de tiempo. Salen doradas, crujientes y con muy poca grasa.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">2. Horno tradicional</h2>
      <p class="mb-2">Precalienta a 200°C. Pincela ligeramente con aceite. Hornea 15 minutos sobre papel de horno.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">3. Freidora / sartén honda</h2>
      <p class="mb-2">Aceite a 180°C. Sumerge sin descongelar 4–5 minutos hasta que floten y estén doradas.</p>

      ${ctaHtml}
    `,
  },
  {
    slug: "empanadas-para-eventos-catering",
    title: "Empanadas para eventos y catering: la mejor opción para bodas y empresas",
    excerpt:
      "Descubre por qué las empanadas cocteleras son el aperitivo perfecto para eventos, bodas, catering de empresa y celebraciones. Packs de 17 y 51 unidades, sabor auténtico colombiano.",
    cover: productEmpanadasCocteleras51,
    date: "2026-07-16",
    readingTime: "5 min",
    author: "Equipo MaxRico",
    tags: ["Eventos", "Catering", "B2B", "Bodas"],
    keywords:
      "empanadas para eventos, catering empanadas, empanadas para bodas, empanadas cocteleras, catering colombiano España, aperitivos para eventos, snacks para catering",
    bodyHtml: `
      <p class="text-lg leading-relaxed mb-6">Las <strong>empanadas cocteleras de MaxRico</strong> son el aperitivo estrella de bodas, cumpleaños, eventos corporativos y caterings en toda España.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Formato ideal para eventos</h2>
      <ul class="space-y-2 mb-6 list-disc pl-6">
        <li>Tamaño bocado (8 cm): perfecta para comer de pie.</li>
        <li>Packs de 17 y 51 unidades.</li>
        <li>Sabores: pollo y ternera.</li>
        <li>Sin gluten (masa 100% maíz).</li>
      </ul>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Servicio para negocios (B2B)</h2>
      <p class="mb-4">Trabajamos con <strong>bares, restaurantes, cafeterías, hoteles y empresas de catering</strong> en toda España. Precios especiales al por mayor, packaging profesional y logística refrigerada.</p>

      ${ctaHtml}

      <p class="text-sm text-muted-foreground">Solicita presupuesto por WhatsApp: <a class="text-primary underline" href="https://wa.me/34695798632">+34 695 798 632</a>.</p>
    `,
  },
];

export const blogImages = {
  hero: productEmpanadaCarneTernera,
  pollo: productEmpanadasGrandesPollo,
  cocteleras17: productEmpanadasCocteleras17,
  cocteleras51: productEmpanadasCocteleras51,
  grandes: productEmpanadas,
  combo: comboXXLMixto,
};
