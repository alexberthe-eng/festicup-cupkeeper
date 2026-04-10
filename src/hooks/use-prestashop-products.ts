import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/data/products";

export interface PrestashopProduct {
  id: string;
  name: string;
  shortDesc: string;
  priceHT: number;
  reference: string;
  categoryId: string;
  image: string;
  active: boolean;
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
    staleTime: 5 * 60 * 1000, // 5 min cache
    retry: 1,
  });
}
