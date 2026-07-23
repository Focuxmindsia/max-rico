import productEmpanadaCarneTernera from "@/assets/empanada-carne-ternera-x10.jpeg";
import productEmpanadasGrandesPollo from "@/assets/empanadas-pollo-v2.jpg";
import productEmpanadasCocteleras17 from "/combo-17-fritas-new.jpg";
import productEmpanadasCocteleras51 from "/combo-51-fritas-new.png";
import productEmpanadas from "@/assets/product-empanadas-v2.jpg";
import comboXXLMixto from "/combo-xxl-mixto.png";
import cajaEmpanadasMaxRico15 from "@/assets/empanadas-maxrico-caja-15.png.asset.json";
import empanadasCongeladasTerneraPollo from "@/assets/empanadas-congeladas-ternera-pollo.png.asset.json";

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
  {
    slug: "maxrico-empanadas-colombianas-zaragoza-instagram",
    title: "MaxRico: Empanadas Colombianas en Zaragoza — síguenos en Instagram y pide online",
    excerpt:
      "Somos MaxRico, tu tienda de comestibles colombianos en Zaragoza. Venta a particulares y negocios, envíos ultracongelados a toda España y una comunidad viva en Instagram: @maxrico_empanadas.",
    cover: productEmpanadasGrandesPollo,
    date: "2026-07-20",
    readingTime: "4 min",
    author: "Equipo MaxRico",
    tags: ["MaxRico", "Instagram", "Zaragoza", "Colombia", "Al por mayor"],
    keywords:
      "MaxRico, MaxRico Instagram, empanadas colombianas en Zaragoza, comida colombiana Zaragoza, empanadas al por mayor Zaragoza, tienda colombiana Zaragoza, productos colombianos Zaragoza, empanadas colombianas Instagram, delivery empanadas Zaragoza",
    bodyHtml: `
      <p class="text-lg leading-relaxed mb-6">En <span translate="no" class="notranslate">MaxRico</span> llevamos el sabor de Colombia a Zaragoza: <strong>empanadas colombianas en Zaragoza</strong> recién hechas, PandeBonos, arepas, chorizos santarrosanos y una tienda completa de comestibles colombianos para llevar la despensa latina hasta tu casa o tu negocio.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Quiénes somos</h2>
      <p class="mb-4">Somos una marca familiar dedicada a la <strong>comida colombiana en Zaragoza</strong> y alrededores. Vendemos a particulares con entrega a domicilio en la capital aragonesa y enviamos productos <strong>ultracongelados a toda España</strong>. También trabajamos con bares, restaurantes, cafeterías, hoteles y empresas de catering que buscan proveedor estable de <strong>empanadas al por mayor en Zaragoza</strong> y congelados latinos.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Nuestra comunidad en Instagram</h2>
      <p class="mb-4">La forma más rápida de ver novedades, combos del día, promociones y detrás de cámaras es seguirnos en <strong>MaxRico Instagram</strong>. Nos encontrarás como <a class="text-primary underline" href="https://www.instagram.com/maxrico_empanadas?igsh=OGR2cWdqbTdlOGE3" target="_blank" rel="noopener">@maxrico_empanadas</a> — perfil oficial <em>"MaxRico | Empanadas Colombianas en Zaragoza"</em>. Ahí publicamos horarios, disponibilidad de combos fritos y respondemos dudas de pedidos.</p>

      <div class="not-prose my-8 p-5 rounded-2xl bg-secondary text-center">
        <p class="font-bold mb-3">📸 Síguenos en Instagram</p>
        <a href="https://www.instagram.com/maxrico_empanadas?igsh=OGR2cWdqbTdlOGE3" target="_blank" rel="noopener" class="inline-block bg-foreground text-background font-bold px-5 py-3 rounded-md">@maxrico_empanadas →</a>
      </div>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Qué vas a encontrar en el catálogo</h2>
      <ul class="list-disc pl-6 mb-4 space-y-2">
        <li>Empanadas colombianas 100% de maíz molido, sin gluten (pollo y ternera).</li>
        <li>Combos fritos listos para consumir con entrega a domicilio en Zaragoza.</li>
        <li>PandeBonos, arepas rellenas, tequeños y chorizos santarrosanos.</li>
        <li>Salsas artesanales de la casa: ají tradicional, ají picante, perejil y picante casero.</li>
        <li>Ultracongelados para toda España y formatos <strong>al por mayor</strong> para negocios.</li>
      </ul>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Pide online o pregunta por WhatsApp</h2>
      <p class="mb-4">Puedes hacer tu pedido directamente en el <a class="text-primary underline" href="/catalogo">catálogo online</a> con pago seguro, o escribirnos por WhatsApp al <a class="text-primary underline" href="https://wa.me/34695798632">+34 695 798 632</a>. Si representas a un negocio, en la sección <a class="text-primary underline" href="/al-por-mayor">Para Negocios y Eventos</a> te preparamos un presupuesto a medida.</p>

      ${ctaHtml}

      <p class="text-center text-sm text-muted-foreground">¿Prefieres ver antes lo que hacemos? Pásate por nuestro Instagram <a class="text-primary underline" href="https://www.instagram.com/maxrico_empanadas?igsh=OGR2cWdqbTdlOGE3" target="_blank" rel="noopener">@maxrico_empanadas</a> y para pedidos de empresa entra en <a class="text-primary underline" href="/al-por-mayor">/al-por-mayor</a>.</p>
    `,
  },
  {
    slug: "empanadas-colombianas-zaragoza-guia-completa",
    title: "Empanadas Colombianas en Zaragoza: La Guía Completa 2026 (MaxRico)",
    excerpt:
      "Guía definitiva 2026 para comprar empanadas colombianas en Zaragoza: dónde pedirlas, diferencias con la empanada española, venta al por mayor para bares y restaurantes, envío nacional de productos latinos y cómo prepararlas en casa.",
    cover: productEmpanadasGrandesPollo,
    date: "2026-07-23",
    readingTime: "9 min",
    author: "Equipo MaxRico",
    tags: ["Guía", "Zaragoza", "Empanadas", "Colombia", "Al por mayor", "SEO"],
    keywords:
      "empanadas colombianas Zaragoza, comprar empanadas colombianas, empanadas congeladas Zaragoza, comida colombiana Zaragoza, empanadas al por mayor Zaragoza, proveedor de empanadas, distribuidor de productos latinos, envío nacional de productos latinos, empanadas para restaurantes, empanadas para bares y cafeterías, tienda latina Zaragoza",
    bodyHtml: `
      <p class="text-lg leading-relaxed mb-6">Esta es la <strong>guía completa 2026</strong> para entender, comprar y disfrutar las <strong>empanadas colombianas en Zaragoza</strong>. Está pensada tanto para personas que quieren pedirlas a casa como para bares, restaurantes y cafeterías que buscan un <strong>proveedor de empanadas</strong> estable en Aragón y en el resto de España. Todo lo que necesitas saber, respondido de forma directa.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">¿Dónde comprar empanadas colombianas en Zaragoza?</h2>
      <p class="mb-3"><strong>Respuesta directa:</strong> en <span translate="no" class="notranslate">MaxRico</span>. Servimos <strong>empanadas colombianas en Zaragoza</strong> con envío a domicilio en la capital y envío ultracongelado a toda España.</p>
      <p class="mb-4">Puedes <a class="text-primary underline" href="/catalogo">comprar empanadas colombianas</a> desde nuestro catálogo online, con pago seguro con tarjeta o pedido por WhatsApp al <a class="text-primary underline" href="https://wa.me/34695798632">+34 695 798 632</a>. En Zaragoza capital repartimos combos fritos calientes listos para consumir; para el resto de España enviamos producto ultracongelado por mensajería refrigerada.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">¿Qué diferencia a las empanadas colombianas de las españolas?</h2>
      <p class="mb-3"><strong>Respuesta directa:</strong> la masa. La empanada colombiana se hace con <strong>maíz amarillo molido</strong>, es naturalmente sin gluten, se fríe y queda crujiente. La española se hace con harina de trigo y suele ir al horno.</p>
      <p class="mb-4">También cambia el formato y el relleno: la colombiana es individual, con relleno jugoso de carne o pollo y se acompaña con ají. La española es más grande, para compartir, y suele llevar atún, bonito o carne guisada. Si buscas <strong>comida colombiana en Zaragoza</strong> auténtica, la referencia es esta masa de maíz sin trigo.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">¿Se pueden comprar al por mayor para bares, restaurantes y cafeterías?</h2>
      <p class="mb-3"><strong>Respuesta directa:</strong> sí. En MaxRico trabajamos con negocios HORECA como <strong>proveedor de empanadas</strong> y <strong>distribuidor de productos latinos</strong> en Zaragoza y toda España.</p>
      <p class="mb-4">Ofrecemos precios de <strong>empanadas al por mayor en Zaragoza</strong> y envío nacional para <strong>empanadas para restaurantes</strong>, <strong>empanadas para bares y cafeterías</strong>, hoteles, food trucks y empresas de catering. Formatos ultracongelados listos para freír, packaging profesional y logística refrigerada. Toda la info y solicitud de presupuesto en <a class="text-primary underline" href="/al-por-mayor">/al-por-mayor</a>.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">¿Las empanadas vienen congeladas o listas para comer?</h2>
      <p class="mb-3"><strong>Respuesta directa:</strong> las dos opciones. Tenemos <strong>empanadas congeladas en Zaragoza</strong> para preparar en casa y <strong>combos fritos ya calientes</strong> listos para consumir con reparto a domicilio en la capital.</p>
      <ul class="space-y-2 mb-4 list-disc pl-6">
        <li><strong>Congeladas (envío nacional):</strong> las recibes ultracongeladas y las preparas cuando quieras. Ideales para tener siempre a mano o para negocios.</li>
        <li><strong>Combos fritos listos:</strong> te llegan recién hechas y calientes, solo dentro de Zaragoza capital.</li>
        <li><strong>Extras que se pueden añadir a cualquiera de los dos:</strong> tarrinas de ají tradicional, ají picante, salsa de perejil y picante de la casa. Estas tarrinas se pueden pedir junto con combos fritos o junto con empanadas congeladas, no se venden sueltas.</li>
      </ul>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">¿Cómo se preparan las empanadas congeladas en casa?</h2>
      <p class="mb-3"><strong>Respuesta directa:</strong> en air fryer, horno o sartén honda, siempre <strong>sin descongelar</strong>. Tienes la guía detallada aquí: <a class="text-primary underline" href="/blog/como-preparar-empanadas-air-fryer">Cómo preparar empanadas en air fryer, horno o sartén</a>.</p>
      <ul class="space-y-2 mb-4 list-disc pl-6">
        <li><strong>Air fryer:</strong> 180 °C, 12 minutos, dando la vuelta a mitad. Sin aceite añadido.</li>
        <li><strong>Horno:</strong> 200 °C, 15 minutos sobre papel de horno, pinceladas con un poco de aceite.</li>
        <li><strong>Sartén honda / freidora:</strong> aceite a 180 °C, 4–5 minutos hasta que floten y estén doradas.</li>
      </ul>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Zonas de reparto y envío nacional</h2>
      <p class="mb-3"><strong>Respuesta directa:</strong> reparto a domicilio en Zaragoza capital y <strong>envío nacional de productos latinos</strong> ultracongelados a toda España.</p>
      <p class="mb-4">Dentro de Zaragoza cubrimos barrios como Centro, Delicias, Actur, La Almozara, Torrero, Las Fuentes, Universidad, Casablanca, Valdespartera y Miralbueno, entre otros. Para el resto de España enviamos por mensajería refrigerada en formato ultracongelado, manteniendo la calidad del producto desde nuestra <strong>tienda latina en Zaragoza</strong> hasta tu puerta. Si quieres una visión más amplia del contexto en el país, echa un vistazo a <a class="text-primary underline" href="/blog/empanadas-colombianas-en-espana">Empanadas colombianas en España</a>.</p>

      ${ctaHtml}

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Síguenos y pide</h2>
      <p class="mb-3"><strong>Respuesta directa:</strong> síguenos en Instagram <a class="text-primary underline" href="https://www.instagram.com/maxrico_empanadas?igsh=OGR2cWdqbTdlOGE3" target="_blank" rel="noopener">@maxrico_empanadas</a> y en <a class="text-primary underline" href="https://www.facebook.com/maxricoempanadas" target="_blank" rel="noopener">Facebook</a>. Para pedir, ve al <a class="text-primary underline" href="/catalogo">catálogo</a>; para negocios, a <a class="text-primary underline" href="/al-por-mayor">/al-por-mayor</a>.</p>
      <p class="mb-6">Publicamos disponibilidad de combos del día, novedades y promociones especialmente en Instagram. Para pedidos directos siempre puedes escribirnos por WhatsApp al <a class="text-primary underline" href="https://wa.me/34695798632">+34 695 798 632</a>.</p>

      <h2 class="text-2xl md:text-3xl font-black mt-10 mb-4">Preguntas frecuentes</h2>
      <div class="space-y-5 mb-4">
        <div>
          <p class="font-bold mb-1">¿Las empanadas de MaxRico llevan gluten?</p>
          <p>No. Nuestra masa es 100% maíz amarillo molido, sin harinas de trigo, apta para dieta sin gluten.</p>
        </div>
        <div>
          <p class="font-bold mb-1">¿Hacéis envío a toda España?</p>
          <p>Sí. Enviamos productos ultracongelados por mensajería refrigerada a toda la península. Los combos fritos calientes solo se sirven en Zaragoza capital.</p>
        </div>
        <div>
          <p class="font-bold mb-1">¿Puedo comprar solo las tarrinas de ají?</p>
          <p>No. Las tarrinas y el chorizo extra son complementos y solo se pueden añadir junto con un combo frito o con empanadas congeladas del catálogo.</p>
        </div>
        <div>
          <p class="font-bold mb-1">¿Trabajáis con bares y restaurantes?</p>
          <p>Sí. Somos proveedor y distribuidor de productos latinos para HORECA en Zaragoza y toda España. Solicita presupuesto en <a class="text-primary underline" href="/al-por-mayor">/al-por-mayor</a>.</p>
        </div>
        <div>
          <p class="font-bold mb-1">¿Cuál es la mejor forma de prepararlas en casa?</p>
          <p>El air fryer a 180 °C durante 12 minutos, sin descongelar y sin aceite añadido. Quedan crujientes por fuera y jugosas por dentro.</p>
        </div>
        <div>
          <p class="font-bold mb-1">¿Cómo hago mi pedido?</p>
          <p>Desde el <a class="text-primary underline" href="/catalogo">catálogo online</a> con pago seguro, o por WhatsApp al <a class="text-primary underline" href="https://wa.me/34695798632">+34 695 798 632</a>.</p>
        </div>
      </div>

      <script type="application/ld+json">
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "¿Dónde comprar empanadas colombianas en Zaragoza?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "En MaxRico. Servimos empanadas colombianas en Zaragoza con envío a domicilio en la capital y envío ultracongelado a toda España. Puedes pedir desde https://maxrico.es/catalogo o por WhatsApp al +34 695 798 632."
            }
          },
          {
            "@type": "Question",
            "name": "¿Las empanadas de MaxRico llevan gluten?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Nuestra masa es 100% maíz amarillo molido, sin harinas de trigo, apta para dieta sin gluten."
            }
          },
          {
            "@type": "Question",
            "name": "¿Hacéis envío a toda España?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí. Enviamos productos ultracongelados por mensajería refrigerada a toda la península. Los combos fritos calientes solo se sirven en Zaragoza capital."
            }
          },
          {
            "@type": "Question",
            "name": "¿Puedo comprar solo las tarrinas de ají o el chorizo extra?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "No. Las tarrinas de ají y el chorizo extra son complementos y solo se pueden añadir junto con un combo frito o con empanadas congeladas del catálogo."
            }
          },
          {
            "@type": "Question",
            "name": "¿Trabajáis con bares, restaurantes y cafeterías?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Sí. Somos proveedor de empanadas y distribuidor de productos latinos para HORECA en Zaragoza y toda España. Solicita presupuesto en https://maxrico.es/al-por-mayor."
            }
          },
          {
            "@type": "Question",
            "name": "¿Cuál es la mejor forma de preparar las empanadas congeladas en casa?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "En air fryer a 180 °C durante 12 minutos, sin descongelar y sin aceite añadido. Quedan crujientes por fuera y jugosas por dentro."
            }
          }
        ]
      }
      </script>
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
