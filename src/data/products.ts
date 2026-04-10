export type PriceTier = {
  minQty: number;
  maxQty: number | null;
  priceHT: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  gamme: "ecocup" | "prestige";
  mode: "achat" | "location" | "both";
  capacity: string;
  image: string;
  badge?: string;
  priceTiers: PriceTier[];
  locationPriceHT?: number;
  minQty: number;
  customizable: boolean;
  colors: string[];
};

export const products: Product[] = [
  // ECOCUP
  {
    id: "eco-25cl",
    slug: "gobelet-ecocup-25cl",
    name: "Gobelet Ecocup 25cl",
    shortDesc: "Le classique des festivals — réutilisable et personnalisable",
    gamme: "ecocup",
    mode: "both",
    capacity: "25cl",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    badge: "Best-seller",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 1.20 },
      { minQty: 100, maxQty: 499, priceHT: 0.96 },
      { minQty: 500, maxQty: 999, priceHT: 0.84 },
      { minQty: 1000, maxQty: null, priceHT: 0.76 },
    ],
    locationPriceHT: 0.15,
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF", "#000000", "#C9A84C", "#1E3A5F"],
  },
  {
    id: "eco-33cl",
    slug: "gobelet-ecocup-33cl",
    name: "Gobelet Ecocup 33cl",
    shortDesc: "Format bière — idéal pour les événements festifs",
    gamme: "ecocup",
    mode: "both",
    capacity: "33cl",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 1.35 },
      { minQty: 100, maxQty: 499, priceHT: 1.08 },
      { minQty: 500, maxQty: 999, priceHT: 0.95 },
      { minQty: 1000, maxQty: null, priceHT: 0.85 },
    ],
    locationPriceHT: 0.18,
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF", "#000000", "#E74C3C"],
  },
  {
    id: "eco-50cl",
    slug: "gobelet-ecocup-50cl",
    name: "Gobelet Ecocup 50cl",
    shortDesc: "Grand format — pour les grandes soifs",
    gamme: "ecocup",
    mode: "both",
    capacity: "50cl",
    image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=600&q=80",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 1.55 },
      { minQty: 100, maxQty: 499, priceHT: 1.24 },
      { minQty: 500, maxQty: 999, priceHT: 1.10 },
      { minQty: 1000, maxQty: null, priceHT: 0.98 },
    ],
    locationPriceHT: 0.22,
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF", "#000000"],
  },
  {
    id: "eco-shooter",
    slug: "shooter-ecocup-4cl",
    name: "Shooter Ecocup 4cl",
    shortDesc: "Mini format shooter — parfait pour les animations",
    gamme: "ecocup",
    mode: "achat",
    capacity: "4cl",
    image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=600&q=80",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 0.85 },
      { minQty: 100, maxQty: 499, priceHT: 0.68 },
      { minQty: 500, maxQty: null, priceHT: 0.55 },
    ],
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF", "#000000", "#C9A84C"],
  },
  {
    id: "eco-15cl",
    slug: "gobelet-ecocup-15cl",
    name: "Gobelet Ecocup 15cl",
    shortDesc: "Format vin — sobre et élégant",
    gamme: "ecocup",
    mode: "both",
    capacity: "15cl",
    image: "https://images.unsplash.com/photo-1474722883778-792e7990302f?auto=format&fit=crop&w=600&q=80",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 1.10 },
      { minQty: 100, maxQty: 499, priceHT: 0.88 },
      { minQty: 500, maxQty: null, priceHT: 0.76 },
    ],
    locationPriceHT: 0.14,
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF", "#000000"],
  },

  // PRESTIGE
  {
    id: "pres-flute",
    slug: "flute-prestige-15cl",
    name: "Flûte Prestige 15cl",
    shortDesc: "Flûte à champagne incassable — élégance absolue",
    gamme: "prestige",
    mode: "both",
    capacity: "15cl",
    image: "https://images.unsplash.com/photo-1470337458703-46ad1756a187?auto=format&fit=crop&w=600&q=80",
    badge: "Nouveauté",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 3.95 },
      { minQty: 100, maxQty: 499, priceHT: 3.40 },
      { minQty: 500, maxQty: null, priceHT: 2.95 },
    ],
    locationPriceHT: 0.45,
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF", "#C9A84C"],
  },
  {
    id: "pres-wine",
    slug: "verre-vin-prestige-25cl",
    name: "Verre à vin Prestige 25cl",
    shortDesc: "Verre à vin incassable — pour les réceptions haut de gamme",
    gamme: "prestige",
    mode: "both",
    capacity: "25cl",
    image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 4.50 },
      { minQty: 100, maxQty: 499, priceHT: 3.85 },
      { minQty: 500, maxQty: null, priceHT: 3.20 },
    ],
    locationPriceHT: 0.55,
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF"],
  },
  {
    id: "pres-tumbler",
    slug: "tumbler-prestige-30cl",
    name: "Tumbler Prestige 30cl",
    shortDesc: "Verre cocktail premium — pour des événements d'exception",
    gamme: "prestige",
    mode: "both",
    capacity: "30cl",
    image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=600&q=80",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 4.20 },
      { minQty: 100, maxQty: 499, priceHT: 3.60 },
      { minQty: 500, maxQty: null, priceHT: 2.95 },
    ],
    locationPriceHT: 0.50,
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF", "#000000", "#C9A84C"],
  },
  {
    id: "pres-coupe",
    slug: "coupe-prestige-20cl",
    name: "Coupe Prestige 20cl",
    shortDesc: "Coupe à champagne — style vintage premium",
    gamme: "prestige",
    mode: "both",
    capacity: "20cl",
    image: "https://images.unsplash.com/photo-1482275548304-a58859dc31b7?auto=format&fit=crop&w=600&q=80",
    badge: "Premium",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 4.80 },
      { minQty: 100, maxQty: 499, priceHT: 4.10 },
      { minQty: 500, maxQty: null, priceHT: 3.45 },
    ],
    locationPriceHT: 0.60,
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF", "#C9A84C"],
  },
  {
    id: "pres-beer",
    slug: "verre-biere-prestige-50cl",
    name: "Verre à bière Prestige 50cl",
    shortDesc: "Pinte premium incassable — pour les événements brassicoles",
    gamme: "prestige",
    mode: "achat",
    capacity: "50cl",
    image: "https://images.unsplash.com/photo-1535958636474-b021ee887b13?auto=format&fit=crop&w=600&q=80",
    priceTiers: [
      { minQty: 25, maxQty: 99, priceHT: 5.20 },
      { minQty: 100, maxQty: 499, priceHT: 4.50 },
      { minQty: 500, maxQty: null, priceHT: 3.80 },
    ],
    minQty: 25,
    customizable: true,
    colors: ["#FFFFFF", "#000000"],
  },
];

export const TVA_RATE = 0.21;

export function getBasePrice(product: Product): number {
  return product.priceTiers[0].priceHT;
}

export function getBestPrice(product: Product): number {
  return product.priceTiers[product.priceTiers.length - 1].priceHT;
}

export function formatPrice(price: number): string {
  return price.toFixed(2).replace(".", ",") + "€";
}

export function getPriceTTC(priceHT: number): number {
  return priceHT * (1 + TVA_RATE);
}
