// Descripciones ampliadas y galería complementaria por producto.
// Se aplica en /producto/:id para enriquecer la ficha sin tocar products.ts.

import empanadaRelleno from "/empanada-relleno.jpg";
import empanadaMasaMaiz from "@/assets/gallery/empanada-masa-maiz.jpg";
import empanadaCongelada from "/empanada-congelada.png";
import arepaDetalle from "@/assets/gallery/arepa-detalle.jpg";
import arepaPlancha from "@/assets/gallery/arepa-plancha.jpg";
import arepaCongelada from "@/assets/gallery/arepa-congelada.jpg";
import chorizoParrilla from "@/assets/gallery/chorizo-parrilla.jpg";
import embutidoTabla from "@/assets/gallery/embutido-tabla.jpg";
import embutidoCongelado from "@/assets/gallery/embutido-congelado.jpg";
import comboCajaFritas from "@/assets/gallery/combo-caja-fritas.jpg";
import comboListoConsumir from "@/assets/gallery/combo-listo-consumir.jpg";
import comboDomicilio from "@/assets/gallery/combo-domicilio.jpg";
import pandebonoDetalle from "@/assets/gallery/pandebono-detalle.jpg";
import bunueloDetalle from "@/assets/gallery/bunuelo-detalle.jpg";
import tequenoDetalle from "@/assets/gallery/tequeno-detalle.jpg";
import hojaldreDetalle from "@/assets/gallery/hojaldre-detalle.jpg";
import hojaldreGuayaba from "@/assets/gallery/hojaldre-guayaba.jpg";
import champusDetalle from "@/assets/gallery/champus-detalle.jpg";

import type { Product } from "@/data/products";

export interface ProductExtras {
  longDescription: string;
  galleryExtras: string[]; // hasta 3 imágenes complementarias
  highlights?: string[];   // bullets cortos: peso, formato, calidad
}

// Galerías reutilizables por categoría/línea
const G = {
  empanadasCongeladasTernera: [empanadaRelleno, empanadaMasaMaiz, empanadaCongelada],
  empanadasCongeladasPollo: [empanadaRelleno, empanadaMasaMaiz, empanadaCongelada],
  empanadasFritas: [comboCajaFritas, comboListoConsumir, comboDomicilio],
  arepa: [arepaDetalle, arepaPlancha, arepaCongelada],
  chorizo: [chorizoParrilla, embutidoTabla, embutidoCongelado],
  embutido: [embutidoTabla, chorizoParrilla, embutidoCongelado],
  pandebono: [pandebonoDetalle, empanadaMasaMaiz, empanadaCongelada],
  bunuelo: [bunueloDetalle, empanadaMasaMaiz, empanadaCongelada],
  tequeno: [tequenoDetalle, comboCajaFritas, embutidoCongelado],
  hojaldre: [hojaldreDetalle, hojaldreGuayaba, empanadaCongelada],
  comboValluno: [champusDetalle, empanadaRelleno, chorizoParrilla],
};

const FROZEN_DETAIL = "Producto ultracongelado a -18°C para preservar todo su sabor y textura artesanal. Llega a tu casa en perfecto estado, listo para que lo prepares cuando quieras. Sin conservantes artificiales.";

const QUALITY_CORN = "Elaborado con masa 100% de maíz molido, sin harina de trigo y SIN GLUTEN. Receta tradicional colombiana, hecha de forma artesanal con ingredientes seleccionados.";

const FRITO_DETAIL = "🚚 Listo para consumir: te llega ya frito y caliente, con domicilio incluido en Zaragoza capital. Solo abre la caja y disfruta. Si prefieres, calienta 1 min en microondas o 5 min en horno a 180°C para devolverle el toque crujiente.";

export const PRODUCT_EXTRAS: Record<string, ProductExtras> = {
  // === EMPANADAS GRANDES TERNERA ===
  "1": {
    longDescription: `${QUALITY_CORN} Empanadas grandes de 13,5 cm rellenas de carne de Vacuno jugosa, patata cocida y un sofrito tradicional. ${FROZEN_DETAIL}`,
    galleryExtras: G.empanadasCongeladasTernera,
    highlights: ["6 unidades · 450 g", "Tamaño 13,5 cm", "100% maíz · sin gluten", "🧊 Ultracongeladas a -18°C"],
  },
  "2": {
    longDescription: `${QUALITY_CORN} Pack familiar de 10 empanadas grandes de 13,5 cm con relleno de carne de Vacuno, ideales para reuniones, celebraciones o tener siempre en casa. ${FROZEN_DETAIL}`,
    galleryExtras: G.empanadasCongeladasTernera,
    highlights: ["10 unidades · 750 g", "Tamaño 13,5 cm", "Relleno de Vacuno + papa", "🧊 Ultracongeladas a -18°C"],
  },
  "25": {
    longDescription: `${QUALITY_CORN} Pack de 10 empanadas grandes rellenas de pollo desmechado jugoso con un suave sofrito colombiano. ${FROZEN_DETAIL}`,
    galleryExtras: G.empanadasCongeladasPollo,
    highlights: ["10 unidades · 750 g", "Tamaño 13,5 cm", "Pollo desmechado", "🧊 Ultracongeladas a -18°C"],
  },
  // === EMPANADAS COCTELERAS ===
  "8": {
    longDescription: `${QUALITY_CORN} Mini empanadas tipo cóctel de 8 cm rellenas de pollo, perfectas para fiestas, picoteo o aperitivo. Tamaño bocado, sabor gigante. ${FROZEN_DETAIL}`,
    galleryExtras: G.empanadasCongeladasPollo,
    highlights: ["17 unidades · 510 g", "Tamaño 8 cm (cóctel)", "Pollo · sin gluten", "🧊 Ultracongeladas a -18°C"],
  },
  "26": {
    longDescription: `${QUALITY_CORN} Mini empanadas tipo cóctel de 8 cm rellenas de carne de Vacuno. Ideales para picoteo, eventos y para los más peques. ${FROZEN_DETAIL}`,
    galleryExtras: G.empanadasCongeladasTernera,
    highlights: ["17 unidades · 510 g", "Tamaño 8 cm (cóctel)", "Vacuno · sin gluten", "🧊 Ultracongeladas a -18°C"],
  },
  // === AREPAS ===
  "7": {
    longDescription: `Arepas de maíz colombianas rellenas de queso mozzarella fundente. Base de la cocina colombiana y venezolana, perfectas para desayuno, merienda o cena rápida. ${FROZEN_DETAIL}`,
    galleryExtras: G.arepa,
    highlights: ["5 unidades · 700 g", "Rellena de mozzarella", "Sin gluten", "🧊 Ultracongeladas a -18°C"],
  },
  "15": {
    longDescription: `Arepa de chócolo (maíz tierno) con queso, marca Dcarnilsa. Sabor dulce y suave, ideal para desayuno o merienda. ${FROZEN_DETAIL}`,
    galleryExtras: G.arepa,
    highlights: ["4 unidades · 500 g", "Maíz tierno + queso", "Sin gluten", "🧊 Ultracongeladas a -18°C"],
  },
  "16": {
    longDescription: `Arepa artesanal Dcarnilsa con textura firme y sabor neutro, perfecta para rellenar a tu gusto: queso, carne mechada, huevo, aguacate… ${FROZEN_DETAIL}`,
    galleryExtras: G.arepa,
    highlights: ["6 unidades · 800 g", "Para rellenar", "Sin gluten", "🧊 Ultracongeladas a -18°C"],
  },
  // === CHORIZOS ===
  "10": {
    longDescription: `Auténtico chorizo colombiano santarrosano de 7,5 cm. Pack de 10 unidades con sabor tradicional ahumado y especiado, perfecto para parrilla, plancha o como acompañamiento. ${FROZEN_DETAIL}`,
    galleryExtras: G.chorizo,
    highlights: ["10 unidades · 500 g", "Tamaño 7,5 cm", "Ahumado tradicional", "🧊 Ultracongelado a -18°C"],
  },
  "11": {
    longDescription: `Chorizo colombiano santarrosano XL de 22 cm. Tamaño grande ideal para asados, parrilladas y eventos. Sabor tradicional ahumado. ${FROZEN_DETAIL}`,
    galleryExtras: G.chorizo,
    highlights: ["5 unidades · 800–1000 g", "Tamaño XL 22 cm", "Para parrilla", "🧊 Ultracongelado a -18°C"],
  },
  // === EMBUTIDOS ===
  "12": {
    longDescription: `Salchichón cervecero colombiano D'Carnilsa de 27,5 cm. El acompañante perfecto para una cerveza fría: rebanadas en plancha o sartén. ${FROZEN_DETAIL}`,
    galleryExtras: G.embutido,
    highlights: ["1 unidad · 580 g", "27,5 cm", "Marca D'Carnilsa", "🧊 Ultracongelado a -18°C"],
  },
  "13": {
    longDescription: `Pack de 10 salchichas rancheras ahumadas D'Carnilsa de 11 cm. Sabor ahumado intenso, perfectas con arepa y hogao o en perro caliente colombiano. ${FROZEN_DETAIL}`,
    galleryExtras: G.embutido,
    highlights: ["10 unidades · 400 g", "11 cm cada una", "Ahumadas D'Carnilsa", "🧊 Ultracongeladas a -18°C"],
  },
  "14": {
    longDescription: `Salami latino estilo dominicano Rivera Super Especial. Versátil para sándwiches, frito con queso o como tapa. ${FROZEN_DETAIL}`,
    galleryExtras: G.embutido,
    highlights: ["1 unidad · 500 g", "15 cm", "Estilo dominicano", "🧊 Ultracongelado a -18°C"],
  },
  // === PANDEBONO ===
  "5": {
    longDescription: `Pandebono colombiano artesanal: bollito de almidón de yuca y queso costeño, esponjoso por dentro y dorado por fuera. SIN GLUTEN. Perfecto para el desayuno o la merienda con café o chocolate. ${FROZEN_DETAIL}`,
    galleryExtras: G.pandebono,
    highlights: ["6 unidades · 360 g", "Yuca + queso costeño", "Sin gluten", "🧊 Ultracongelado a -18°C"],
  },
  // === TEQUEÑOS ===
  "4": {
    longDescription: `Crujientes palitos venezolanos de masa rellenos de queso semiduro fundente. El snack más adictivo para fiestas y picoteo. ${FROZEN_DETAIL}`,
    galleryExtras: G.tequeno,
    highlights: ["14 unidades", "Queso fundente", "Snack venezolano", "🧊 Ultracongelados a -18°C"],
  },
  // === BUÑUELOS ===
  "6": {
    longDescription: `Buñuelos colombianos: bolitas de almidón de maíz y queso fresco, fritas hasta quedar crujientes por fuera y suaves por dentro. SIN GLUTEN. Tradición navideña colombiana. ${FROZEN_DETAIL}`,
    galleryExtras: G.bunuelo,
    highlights: ["6 unidades", "Almidón de maíz + queso", "Sin gluten", "🧊 Ultracongelados a -18°C"],
  },
  // === COMBOS FRITOS LISTOS PARA CONSUMIR ===
  "20": {
    longDescription: `${FRITO_DETAIL} Combo Uno: más 17 empanadas pequeñas (8 cm) recién fritas. ${QUALITY_CORN}`,
    galleryExtras: G.empanadasFritas,
    highlights: ["17 empanadas pequeñas", "🔥 Listas para consumir", "🚚 Domicilio incluido (Zaragoza)", "Sin gluten · 100% maíz"],
  },
  "21": {
    longDescription: `${FRITO_DETAIL} Combo Dos: más 10 empanadas grandes (13,5 cm) recién fritas. ${QUALITY_CORN}`,
    galleryExtras: G.empanadasFritas,
    highlights: ["10 empanadas grandes", "🔥 Listas para consumir", "🚚 Domicilio incluido (Zaragoza)", "Sin gluten · 100% maíz"],
  },
  "22": {
    longDescription: `${FRITO_DETAIL} Combo Tres Mixto: 10 empanadas grandes más 17 pequeñas, todas fritas. Ideal para reuniones y celebraciones. ${QUALITY_CORN}`,
    galleryExtras: G.empanadasFritas,
    highlights: ["10 grandes + 17 pequeñas", "🔥 Listas para consumir", "🚚 Domicilio incluido (Zaragoza)", "Sin gluten · 100% maíz"],
  },
  "23": {
    longDescription: `${FRITO_DETAIL} Combo Cuatro: más 51 empanadas pequeñas fritas, perfecto para fiestas, eventos y celebraciones. ${QUALITY_CORN}`,
    galleryExtras: G.empanadasFritas,
    highlights: ["51 empanadas pequeñas", "🔥 Listas para consumir", "🚚 Domicilio incluido (Zaragoza)", "Para fiestas y eventos"],
  },
  "24": {
    longDescription: `${FRITO_DETAIL} Combo Cinco: 10 empanadas grandes, salami latino, arepas de queso y salsas de ají. El combo completo para compartir.`,
    galleryExtras: G.empanadasFritas,
    highlights: ["10 grandes + salami + arepas", "🔥 Listas para consumir", "🚚 Domicilio GRATIS (Zaragoza)", "Incluye salsas de ají"],
  },
  "29": {
    longDescription: `${FRITO_DETAIL} Auténtico Combo Valluno del Valle del Cauca: 1 Champús tradicional (bebida fría de maíz, lulo, piña y panela con canela) + 2 empanadas grandes de Vacuno recién fritas + 1 chorizo santarrosano a la parrilla. Sabor 100% colombiano.`,
    galleryExtras: G.comboValluno,
    highlights: ["1 champús + 2 empanadas + chorizo", "🔥 Listo para consumir", "🚚 Domicilio incluido (Zaragoza)", "Tradición del Valle del Cauca"],
  },
  "30": {
    longDescription: `${FRITO_DETAIL} Combo Seis: más 15 empanadas grandes, chorizo XL santarrosano y 3 salsas artesanales de la casa. Nuestro bestseller para compartir.`,
    galleryExtras: G.empanadasFritas,
    highlights: ["15 grandes + chorizo XL + 3 salsas", "🔥 Listas para consumir", "🚚 Domicilio incluido (Zaragoza)", "Bestseller"],
  },
  // === HOJALDRES ===
  "27": {
    longDescription: `Pastel Gloria D'Carnilsa: hojaldre tradicional colombiano relleno, suave por dentro y dorado por fuera. Perfecto para el desayuno o la merienda. ${FROZEN_DETAIL}`,
    galleryExtras: G.hojaldre,
    highlights: ["6 unidades", "Hojaldre tradicional", "Marca D'Carnilsa", "🧊 Ultracongelado a -18°C"],
  },
  "28": {
    longDescription: `Chicharrón de hojaldre D'Carnilsa relleno de dulce de guayaba. Crujiente por fuera y dulce por dentro: un clásico colombiano para acompañar el café. ${FROZEN_DETAIL}`,
    galleryExtras: G.hojaldre,
    highlights: ["1 paquete", "Relleno de guayaba", "Marca D'Carnilsa", "🧊 Ultracongelado a -18°C"],
  },
};

export function getProductExtras(product: Product): ProductExtras {
  return (
    PRODUCT_EXTRAS[product.id] ?? {
      longDescription: product.description,
      galleryExtras: [],
    }
  );
}
