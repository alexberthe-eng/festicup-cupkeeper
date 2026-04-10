// PrestaShop products edge function v4 — with French language + category enrichment
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function fetchPS(baseUrl: string, apiKey: string, resource: string, params: Record<string, string> = {}) {
  const url = new URL(`${baseUrl}/api/${resource}`);
  url.searchParams.set("output_format", "JSON");
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }

  const auth = btoa(`${apiKey}:`);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${auth}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PrestaShop API error [${res.status}]: ${body}`);
  }

  return res.json();
}

function extractLang(field: any, langId = "1"): string {
  if (typeof field === "string") return field;
  if (Array.isArray(field)) {
    const target = field.find((l: any) => String(l.id) === langId || String(l.attrs?.id) === langId);
    return target?.value || field[0]?.value || "";
  }
  if (field?.language) {
    return extractLang(field.language, langId);
  }
  return field?.value || String(field || "");
}

// Category mapping for Festicup PrestaShop
// 12 = Location (rental-only), 13 = Premium wine/champagne, 14 = Ecocup, 15 = Cocktail/beer premium, 16 = Accessories
function mapCategory(categoryId: string): { gamme: string; mode: string } {
  switch (categoryId) {
    case "12": return { gamme: "ecocup", mode: "location" };
    case "14": return { gamme: "ecocup", mode: "both" };
    case "13": return { gamme: "prestige", mode: "both" };
    case "15": return { gamme: "prestige", mode: "both" };
    case "16": return { gamme: "prestige", mode: "achat" };
    default: return { gamme: "ecocup", mode: "achat" };
  }
}

async function getProducts(baseUrl: string, apiKey: string) {
  // Fetch products — use language=1 for French
  const data = await fetchPS(baseUrl, apiKey, "products", {
    "display": "[id,name,description_short,price,reference,active,id_category_default,id_default_image,link_rewrite,minimal_quantity]",
    "filter[active]": "1",
    "language": "1",
  });

  const products = data.products || [];

  const enriched = products
    .filter((p: any) => p.id_category_default !== "2") // Exclude misc/internal category
    .map((p: any) => {
      const imgId = p.id_default_image;
      const imageUrl = imgId && imgId !== "0" && imgId !== ""
        ? `${baseUrl}/api/images/products/${p.id}/${imgId}?ws_key=${apiKey}`
        : "";

      const name = extractLang(p.name, "1");
      const shortDesc = extractLang(p.description_short, "1")?.replace(/<[^>]*>/g, "").trim() || "";
      const slug = extractLang(p.link_rewrite, "1") || `product-${p.id}`;

      const priceHT = parseFloat(p.price) || 0;
      const categoryId = String(p.id_category_default);
      const { gamme, mode } = mapCategory(categoryId);

      // Rental-only products (category 12) have price=0, so mode is "location"
      const finalMode = priceHT === 0 ? "location" : mode;

      return {
        id: String(p.id),
        slug,
        name,
        shortDesc,
        priceHT,
        reference: p.reference || "",
        categoryId,
        gamme,
        mode: finalMode,
        image: imageUrl,
        active: true,
        minQty: parseInt(p.minimal_quantity) || 1,
      };
    });

  return enriched;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const PRESTASHOP_API_KEY = Deno.env.get("PRESTASHOP_API_KEY");
  const PRESTASHOP_URL = Deno.env.get("PRESTASHOP_URL");

  if (!PRESTASHOP_API_KEY) {
    return new Response(JSON.stringify({ error: "PRESTASHOP_API_KEY is not configured" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
  if (!PRESTASHOP_URL) {
    return new Response(JSON.stringify({ error: "PRESTASHOP_URL is not configured" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const baseUrl = PRESTASHOP_URL.replace(/\/$/, "");

  try {
    const products = await getProducts(baseUrl, PRESTASHOP_API_KEY);
    return new Response(JSON.stringify({ products, count: products.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: unknown) {
    console.error("PrestaShop fetch error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
