import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type Product, products as mockProducts, formatPrice } from "@/data/products";

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
}

/** Convert a PrestaShop product into the local Product shape */
function toLocalProduct(ps: PrestashopProduct): Product {
  return {
    id: ps.id,
    slug: ps.slug,
    name: ps.name,
    shortDesc: ps.shortDesc,
    gamme: ps.gamme as "ecocup" | "prestige",
    mode: ps.mode as "achat" | "location" | "both",
    capacity: extractCapacity(ps.name),
    image: ps.image,
    priceTiers: ps.priceHT > 0
      ? [{ minQty: 1, maxQty: null, priceHT: ps.priceHT }]
      : [],
    locationPriceHT: ps.mode === "location" || ps.mode === "both" ? 0.15 : undefined,
    minQty: ps.minQty || 25,
    customizable: true,
    colors: ["#FFFFFF", "#000000"],
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

async function fetchPrestashopProducts(): Promise<PrestashopProduct[]> {
  const { data, error } = await supabase.functions.invoke("prestashop-products");
  if (error) throw new Error(error.message);
  return data?.products || [];
}

export function usePrestashopProducts() {
  return useQuery({
    queryKey: ["prestashop-products"],
    queryFn: fetchPrestashopProducts,
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
