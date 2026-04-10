import { useQuery } from "@tanstack/react-query";
import { type Product, products as mockProducts } from "@/data/products";
import { useI18n } from "@/contexts/I18nContext";

export interface PrestashopCombination {
  id: string;
  reference: string;
  price: number;
  quantity: number;
  attributes: { group: string; name: string }[];
}

export interface PrestashopProduct {
  id: string;
  slug: string;
  name: string;
  shortDesc: string;
  priceHT: number;
  reference: string;
  categoryId: string;
  gamme: string;
  mode: string;
  image: string;
  active: boolean;
  minQty: number;
  combinations?: PrestashopCombination[];
  colors?: string[];
  sizes?: string[];
  priceTiers?: {
    combinationId: string;
    reference: string;
    priceHT: number;
    attributes: { group: string; name: string }[];
    stock: number;
  }[];
}

// Map color names to hex (common French/Dutch/English color names)
const colorNameToHex: Record<string, string> = {
  blanc: "#FFFFFF", white: "#FFFFFF", wit: "#FFFFFF",
  noir: "#000000", black: "#000000", zwart: "#000000",
  rouge: "#E74C3C", red: "#E74C3C", rood: "#E74C3C",
  bleu: "#3498DB", blue: "#3498DB", blauw: "#3498DB",
  vert: "#2ECC71", green: "#2ECC71", groen: "#2ECC71",
  jaune: "#F1C40F", yellow: "#F1C40F", geel: "#F1C40F",
  orange: "#E67E22",
  rose: "#E91E90", pink: "#E91E90", roze: "#E91E90",
  gris: "#95A5A6", grey: "#95A5A6", gray: "#95A5A6", grijs: "#95A5A6",
  or: "#C9A84C", gold: "#C9A84C", goud: "#C9A84C",
  argent: "#C0C0C0", silver: "#C0C0C0", zilver: "#C0C0C0",
  transparent: "#F0F0F0",
};

function colorToHex(name: string): string {
  const key = name.toLowerCase().trim();
  return colorNameToHex[key] || "#CCCCCC";
}

/** Convert a PrestaShop product into the local Product shape */
function toLocalProduct(ps: PrestashopProduct): Product {
  // Build price tiers from combinations or fallback to single price
  let priceTiers: Product["priceTiers"] = [];
  if (ps.priceTiers && ps.priceTiers.length > 0) {
    // Use unique prices from combinations as tiers
    const uniquePrices = [...new Set(ps.priceTiers.map((t) => t.priceHT))].sort((a, b) => b - a);
    priceTiers = uniquePrices.map((price, i) => ({
      minQty: i === 0 ? 1 : (i * 100),
      maxQty: i < uniquePrices.length - 1 ? ((i + 1) * 100 - 1) : null,
      priceHT: price,
    }));
  } else if (ps.priceHT > 0) {
    priceTiers = [{ minQty: 1, maxQty: null, priceHT: ps.priceHT }];
  }

  // Map color names to hex
  const colors = ps.colors && ps.colors.length > 0
    ? ps.colors.map(colorToHex)
    : ["#FFFFFF", "#000000"];

  return {
    id: ps.id,
    slug: ps.slug,
    name: ps.name,
    shortDesc: ps.shortDesc,
    gamme: ps.gamme as "ecocup" | "prestige",
    mode: ps.mode as "achat" | "location" | "both",
    capacity: ps.sizes?.[0] || extractCapacity(ps.name),
    image: ps.image,
    priceTiers,
    locationPriceHT: ps.mode === "location" || ps.mode === "both" ? 0.15 : undefined,
    minQty: ps.minQty || 25,
    customizable: true,
    colors,
  };
}

/** Extract capacity from product name (e.g. "25 cl", "1,5 L") */
function extractCapacity(name: string): string {
  const match = name.match(/(\d+[,.]?\d*)\s*(cl|l|ml)/i);
  if (!match) return "";
  const value = match[1].replace(",", ".");
  const unit = match[2].toLowerCase();
  if (unit === "l") return `${value}L`;
  return `${Math.round(parseFloat(value))}${unit}`;
}

async function fetchPrestashopProducts(langId: string): Promise<PrestashopProduct[]> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

  const url = `${supabaseUrl}/functions/v1/prestashop-products?lang=${langId}`;
  const res = await fetch(url, {
    headers: {
      "apikey": anonKey,
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText);
  }

  const json = await res.json();
  return json?.products || [];
}

export function usePrestashopProducts() {
  const { psLangId } = useI18n();

  return useQuery({
    queryKey: ["prestashop-products", psLangId],
    queryFn: () => fetchPrestashopProducts(psLangId),
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });
}

/** Hook that returns Product[] — live data if available, mock fallback */
export function useCatalogProducts() {
  const { data: psProducts, isLoading, isError } = usePrestashopProducts();

  if (isLoading) return { products: mockProducts, isLoading: true, isLive: false };
  if (isError || !psProducts?.length) return { products: mockProducts, isLoading: false, isLive: false };

  const liveProducts = psProducts.map(toLocalProduct);
  return { products: liveProducts, isLoading: false, isLive: true };
}
