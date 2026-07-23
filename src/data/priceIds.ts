// Map product.id (from src/data/products.ts) -> Stripe priceId (lookup_key)
// Created via payments--batch_create_product. Stable across sandbox & live.
export const PRICE_ID_BY_PRODUCT_ID: Record<string, string> = {
  "1": "prod_1_price",
  "2": "prod_2_price",
  "4": "prod_4_price",
  "5": "prod_5_price",
  "6": "prod_6_price",
  "7": "prod_7_price",
  "8": "prod_8_price",
  "10": "prod_10_price",
  "11": "prod_11_price",
  "12": "prod_12_price",
  "13": "prod_13_price",
  "14": "prod_14_price",
  "15": "prod_15_price",
  "16": "prod_16_price",
  "20": "prod_20_price",
  "21": "prod_21_price",
  "22": "prod_22_price",
  "23": "prod_23_price",
  "24": "prod_24_price",
  "25": "prod_25_price",
  "26": "prod_26_price",
  "27": "prod_27_price",
  "28": "prod_28_price",
  "29": "prod_29_price",
  "30": "prod_30_price",
  "31": "prod_31_price",
  "32": "prod_32_price",
  "40": "prod_40_price",
  "41": "prod_41_price",
  "42": "prod_42_price",
  "43": "prod_43_price",
};

export const SOCIO_PRICE_ID = "socio_anual_59";

// Product IDs that are "Productos Fritos Listos para Consumir"
// (need scheduling, only Zaragoza, restaurant hours)
export const FRITOS_PRODUCT_IDS = new Set(["20", "21", "22", "23", "24", "29", "30", "31", "32", "40", "41", "42", "43"]);

// Solo los combos grandes llevan el domicilio incluido en el precio.
// Las tarrinas de salsa (40-43) y el chorizo extra (31) son complementos
// de bajo importe y NO incluyen envío, así que sí cuentan para el mínimo.
export const SHIPPING_INCLUDED_PRODUCT_IDS = new Set(["20", "21", "22", "23", "24", "29", "30", "32"]);

// Envío a domicilio: 3,50€ si el subtotal de productos que NO llevan envío
// incluido es < 29€.
export const SHIPPING_FEE_EUR = 3.5;
export const FREE_SHIPPING_THRESHOLD_EUR = 29;

export function computeShippingFeeEUR(
  items: { productId: string; price: number; quantity: number }[],
  deliveryMethod: "recogida" | "domicilio",
): number {
  if (deliveryMethod !== "domicilio") return 0;
  const hasShippingIncludedCombo = items.some((i) => SHIPPING_INCLUDED_PRODUCT_IDS.has(i.productId));
  const billableSubtotal = items.reduce((sum, i) => {
    if (SHIPPING_INCLUDED_PRODUCT_IDS.has(i.productId)) return sum;
    return sum + i.price * i.quantity;
  }, 0);
  if (billableSubtotal <= 0) return 0; // solo combos con envío incluido
  if (hasShippingIncludedCombo) return 0; // el combo ya cubre el envío
  if (billableSubtotal >= FREE_SHIPPING_THRESHOLD_EUR) return 0;
  return SHIPPING_FEE_EUR;
}

// Extras that MUST be bought together with a combo (cannot be sold alone).
export const REQUIRES_COMBO_PRODUCT_IDS = new Set(["31"]);

export function isExtraRequiresCombo(productId: string): boolean {
  return REQUIRES_COMBO_PRODUCT_IDS.has(productId);
}

export function getPriceId(productId: string): string | null {
  return PRICE_ID_BY_PRODUCT_ID[productId] ?? null;
}

export function isProductFrito(productId: string): boolean {
  return FRITOS_PRODUCT_IDS.has(productId);
}
