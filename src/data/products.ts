import productEmpanadas from "@/assets/product-empanadas.jpg";
import productEmpanadasCocteleras from "@/assets/product-empanadas-cocteleras.jpg";
import productTequenos from "@/assets/product-tequenos.jpg";
import productPandebonos from "@/assets/product-pandebonos.jpg";
import productBunuelos from "@/assets/product-bunuelos.jpg";
import productArepas from "@/assets/product-arepas.jpg";

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  ingredients: string;
  preparation: string;
  conservation: string;
  price: number;
  memberPrice: number;
  image: string;
  badge?: "oferta" | "nuevo" | "top";
  rating?: number;
  packSize: string;
}

export const categories = [
  "Todas",
  "Empanadas",
  "Tequeños",
  "Pan de bono",
  "Buñuelos",
  "Arepas",
];

export const products: Product[] = [
  // === EMPANADAS GRANDES CONGELADAS ===
  {
    id: "1",
    name: "Empanadas Colombianas Grandes de Pollo - Pack 10",
    slug: "empanadas-grandes-pollo-pack-10",
    category: "Empanadas",
    description: "🧊 CONGELADAS · Deliciosas empanadas colombianas grandes rellenas de pollo sazonado con especias tradicionales. Masa crujiente de maíz por fuera, jugosas por dentro.",
    ingredients: "Harina de maíz, pechuga de pollo, papa, cebolla, ajo, comino, sal, pimienta, aceite vegetal.",
    preparation: "Horno: 200°C por 15 min. Air fryer: 180°C por 12 min. Freír: aceite a 180°C por 5 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado. Consumir antes de la fecha indicada.",
    price: 17.90,
    memberPrice: 13.90,
    image: productEmpanadas,
    badge: "top",
    rating: 4.8,
    packSize: "10 unidades",
  },
  {
    id: "2",
    name: "Empanadas Colombianas Grandes de Carne de Vacuno - Pack 20",
    slug: "empanadas-grandes-carne-pack-20",
    category: "Empanadas",
    description: "🧊 CONGELADAS · El pack familiar de nuestras famosas empanadas colombianas grandes rellenas de carne de vacuno mechada, papa y especias. Perfectas para reuniones y celebraciones.",
    ingredients: "Harina de maíz, carne de res, papa, cebolla, ajo, comino, sal, pimienta, aceite vegetal.",
    preparation: "Horno: 200°C por 15 min. Air fryer: 180°C por 12 min. Freír: aceite a 180°C por 5 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 17.90,
    memberPrice: 13.90,
    image: productEmpanadas,
    badge: "oferta",
    rating: 4.9,
    packSize: "20 unidades",
  },
  // === EMPANADAS COCTELERAS / PEQUEÑAS (0,30€/u coste) ===
  {
    id: "8",
    name: "Empanadas Cocteleras (Pequeñas) - Pack 17",
    slug: "empanadas-cocteleras-pack-17",
    category: "Empanadas",
    description: "Mini empanadas colombianas tipo cóctel. Perfectas como aperitivo o snack. Tamaño bocado, sabor gigante. Formato congelado.",
    ingredients: "Harina de maíz, carne de res, papa, cebolla, ajo, comino, sal, pimienta, aceite vegetal.",
    preparation: "Freír: aceite a 180°C por 3-4 min. Air fryer: 180°C por 8 min. Horno: 200°C por 12 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 18.99,
    memberPrice: 14.99,
    image: productEmpanadasCocteleras,
    badge: "nuevo",
    rating: 4.7,
    packSize: "17 unidades",
  },
  {
    id: "9",
    name: "Empanadas Cocteleras (Pequeñas) - Pack 32",
    slug: "empanadas-cocteleras-pack-32",
    category: "Empanadas",
    description: "Mega caja de mini empanadas cocteleras. Ideales para fiestas, eventos y catering. Formato congelado.",
    ingredients: "Harina de maíz, carne de res, papa, cebolla, ajo, comino, sal, pimienta, aceite vegetal.",
    preparation: "Freír: aceite a 180°C por 3-4 min. Air fryer: 180°C por 8 min. Horno: 200°C por 12 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 34.99,
    memberPrice: 27.99,
    image: productEmpanadasCocteleras,
    rating: 4.8,
    packSize: "32 unidades",
  },
  // === TEQUEÑOS (0,60€/u coste fritos, 2€/u público, combos 10x16,99€) ===
  {
    id: "4",
    name: "Tequeños de Queso - Pack 10",
    slug: "tequenos-pack-10",
    category: "Tequeños",
    description: "Crujientes palitos de masa rellenos de queso fundente. El snack venezolano más adictivo. Formato congelado.",
    ingredients: "Harina de trigo, queso semiduro, mantequilla, huevo, sal, azúcar.",
    preparation: "Horno: 190°C por 12 min. Air fryer: 180°C por 10 min. Freír: aceite a 180°C por 4 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 16.99,
    memberPrice: 12.99,
    image: productTequenos,
    badge: "top",
    rating: 4.7,
    packSize: "10 unidades",
  },
  // === PANDEBONOS (0,20€/u coste, 1€/u público, 0,80€/u negocio) ===
  {
    id: "5",
    name: "Pandebonos Colombianos - Pack 10",
    slug: "pandebonos-pack-10",
    category: "Pan de bono",
    description: "Bollitos de yuca y queso, esponjosos y con ese sabor colombiano inconfundible. Perfectos para el desayuno. Formato congelado.",
    ingredients: "Almidón de yuca, queso costeño, huevo, mantequilla, sal.",
    preparation: "Horno: 180°C por 18 min. Air fryer: 170°C por 15 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 9.99,
    memberPrice: 7.99,
    image: productPandebonos,
    rating: 4.6,
    packSize: "10 unidades",
  },
  // === BUÑUELOS (0,80€/u coste, 2,50€/u público, 1,50€/u negocio) ===
  {
    id: "6",
    name: "Buñuelos Colombianos - Pack 10",
    slug: "bunuelos-pack-10",
    category: "Buñuelos",
    description: "Bolitas de queso fritas, crujientes por fuera y suaves por dentro. Tradición colombiana en cada bocado. Formato congelado.",
    ingredients: "Almidón de maíz, queso fresco, huevo, azúcar, sal, polvo de hornear.",
    preparation: "Freír: aceite a 170°C por 6 min (dorar por todos los lados). Horno: 190°C por 15 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 24.99,
    memberPrice: 14.99,
    image: productBunuelos,
    badge: "oferta",
    rating: 4.5,
    packSize: "10 unidades",
  },
  // === AREPAS QUESO (1,50€/u coste, 4€/u público, 3€/u negocio, promo 2x7€) ===
  {
    id: "7",
    name: "Arepas Rellenas de Queso - Pack 6",
    slug: "arepas-queso-pack-6",
    category: "Arepas",
    description: "Arepas de maíz rellenas de queso fundido. La base de la cocina venezolana y colombiana. Formato congelado.",
    ingredients: "Harina de maíz precocida, queso mozzarella, mantequilla, sal, agua.",
    preparation: "Plancha/sartén: 4 min por lado a fuego medio. Horno: 200°C por 12 min. Air fryer: 180°C por 10 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 23.99,
    memberPrice: 17.99,
    image: productArepas,
    badge: "nuevo",
    rating: 4.7,
    packSize: "6 unidades",
  },
];
