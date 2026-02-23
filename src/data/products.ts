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
  {
    id: "1",
    name: "Empanadas Colombianas - Pack 10",
    slug: "empanadas-pack-10",
    category: "Empanadas",
    description: "Deliciosas empanadas colombianas rellenas de carne mechada, papa y especias tradicionales. Masa crujiente por fuera, jugosas por dentro.",
    ingredients: "Harina de maíz, carne de res, papa, cebolla, ajo, comino, sal, pimienta, aceite vegetal.",
    preparation: "Horno: 200°C por 15 min. Air fryer: 180°C por 12 min. Freír: aceite a 180°C por 5 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado. Consumir antes de la fecha indicada.",
    price: 12.99,
    memberPrice: 10.99,
    image: "https://images.unsplash.com/photo-1604467707321-70d009801bf0?w=400&h=300&fit=crop",
    badge: "top",
    rating: 4.8,
    packSize: "10 unidades",
  },
  {
    id: "2",
    name: "Empanadas Colombianas - Pack 20",
    slug: "empanadas-pack-20",
    category: "Empanadas",
    description: "El pack familiar de nuestras famosas empanadas colombianas. Perfectas para reuniones y celebraciones.",
    ingredients: "Harina de maíz, carne de res, papa, cebolla, ajo, comino, sal, pimienta, aceite vegetal.",
    preparation: "Horno: 200°C por 15 min. Air fryer: 180°C por 12 min. Freír: aceite a 180°C por 5 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 22.99,
    memberPrice: 18.99,
    image: "https://images.unsplash.com/photo-1604467707321-70d009801bf0?w=400&h=300&fit=crop",
    badge: "oferta",
    rating: 4.9,
    packSize: "20 unidades",
  },
  {
    id: "3",
    name: "Empanadas Colombianas - Pack 40",
    slug: "empanadas-pack-40",
    category: "Empanadas",
    description: "El mega pack para los verdaderos fans. Ahorra más con el formato más grande. Ideal para eventos y negocio.",
    ingredients: "Harina de maíz, carne de res, papa, cebolla, ajo, comino, sal, pimienta, aceite vegetal.",
    preparation: "Horno: 200°C por 15 min. Air fryer: 180°C por 12 min. Freír: aceite a 180°C por 5 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 39.99,
    memberPrice: 32.99,
    image: "https://images.unsplash.com/photo-1604467707321-70d009801bf0?w=400&h=300&fit=crop",
    rating: 4.9,
    packSize: "40 unidades",
  },
  {
    id: "4",
    name: "Tequeños de Queso - Pack 10",
    slug: "tequenos-pack-10",
    category: "Tequeños",
    description: "Crujientes palitos de masa rellenos de queso fundente. El snack venezolano más adictivo.",
    ingredients: "Harina de trigo, queso semiduro, mantequilla, huevo, sal, azúcar.",
    preparation: "Horno: 190°C por 12 min. Air fryer: 180°C por 10 min. Freír: aceite a 180°C por 4 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 9.99,
    memberPrice: 7.99,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    badge: "nuevo",
    rating: 4.7,
    packSize: "10 unidades",
  },
  {
    id: "5",
    name: "Pan de Bono - Pack 10",
    slug: "pan-de-bono-pack-10",
    category: "Pan de bono",
    description: "Bollitos de yuca y queso, esponjosos y con ese sabor colombiano inconfundible. Perfectos para el desayuno.",
    ingredients: "Almidón de yuca, queso costeño, huevo, mantequilla, sal.",
    preparation: "Horno: 180°C por 18 min. Air fryer: 170°C por 15 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 8.99,
    memberPrice: 6.99,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=300&fit=crop",
    rating: 4.6,
    packSize: "10 unidades",
  },
  {
    id: "6",
    name: "Buñuelos Colombianos - Pack 10",
    slug: "bunuelos-pack-10",
    category: "Buñuelos",
    description: "Bolitas de queso fritas, crujientes por fuera y suaves por dentro. Tradición colombiana en cada bocado.",
    ingredients: "Almidón de maíz, queso fresco, huevo, azúcar, sal, polvo de hornear.",
    preparation: "Freír: aceite a 170°C por 6 min (dorar por todos los lados). Horno: 190°C por 15 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 8.99,
    memberPrice: 7.49,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=300&fit=crop",
    badge: "oferta",
    rating: 4.5,
    packSize: "10 unidades",
  },
  {
    id: "7",
    name: "Arepas Rellenas de Queso - Pack 6",
    slug: "arepas-queso-pack-6",
    category: "Arepas",
    description: "Arepas de maíz rellenas de queso fundido. La base de la cocina venezolana y colombiana.",
    ingredients: "Harina de maíz precocida, queso mozzarella, mantequilla, sal, agua.",
    preparation: "Plancha/sartén: 4 min por lado a fuego medio. Horno: 200°C por 12 min. Air fryer: 180°C por 10 min.",
    conservation: "Conservar congelado a -18°C. No recongelar una vez descongelado.",
    price: 10.99,
    memberPrice: 8.99,
    image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400&h=300&fit=crop",
    badge: "nuevo",
    rating: 4.7,
    packSize: "6 unidades",
  },
];
