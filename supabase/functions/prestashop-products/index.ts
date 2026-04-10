// PrestaShop products edge function v5 — with combinations (sizes/colors) + price tiers
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

/** Fetch all product option values (colors, sizes, etc.) and build a lookup */
async function fetchOptionValues(baseUrl: string, apiKey: string, langId: string) {
  const lookup: Record<string, { name: string; group: string }> = {};

  try {
    // Fetch option value names
    const valuesData = await fetchPS(baseUrl, apiKey, "product_option_values", {
      display: "[id,name,id_attribute_group]",
      language: langId,
    });

    const values = valuesData?.product_option_values || [];

    // Fetch option group names (e.g. "Couleur", "Taille", "Contenance")
    const groupsData = await fetchPS(baseUrl, apiKey, "product_options", {
      display: "[id,name]",
      language: langId,
    });
    const groups = groupsData?.product_options || [];
    const groupMap: Record<string, string> = {};
    for (const g of groups) {
      groupMap[String(g.id)] = extractLang(g.name, langId);
    }

    for (const v of values) {
      lookup[String(v.id)] = {
        name: extractLang(v.name, langId),
        group: groupMap[String(v.id_attribute_group)] || "",
      };
    }
  } catch (e) {
    console.warn("Could not fetch option values:", e);
  }

  return lookup;
}

interface Combination {
  id: string;
  reference: string;
  price: number; // impact on base price
  quantity: number;
  attributes: { group: string; name: string }[];
}

/** Fetch combinations for a specific product */
async function fetchCombinations(
  baseUrl: string,
  apiKey: string,
  productId: string,
  optionLookup: Record<string, { name: string; group: string }>
): Promise<Combination[]> {
  try {
    const data = await fetchPS(baseUrl, apiKey, "combinations", {
      display: "[id,id_product,reference,price,minimal_quantity,associations]",
      "filter[id_product]": productId,
    });

    const combos = data?.combinations || [];

    return combos.map((c: any) => {
      // Extract attribute IDs from associations
      const attrIds: string[] = [];
      const assoc = c.associations?.product_option_values;
      if (Array.isArray(assoc)) {
        for (const a of assoc) {
          attrIds.push(String(a.id));
        }
      }

      const attributes = attrIds
        .map((id) => optionLookup[id])
        .filter(Boolean)
        .map((ov) => ({ group: ov.group, name: ov.name }));

      return {
        id: String(c.id),
        reference: c.reference || "",
        price: parseFloat(c.price) || 0, // price impact (can be positive or negative)
        quantity: parseInt(c.quantity) || 0,
        attributes,
      };
    });
  } catch (e) {
    console.warn(`Could not fetch combinations for product ${productId}:`, e);
    return [];
  }
}

async function getProducts(baseUrl: string, apiKey: string, langId: string) {
  // Fetch option values lookup (for colors/sizes)
  const optionLookup = await fetchOptionValues(baseUrl, apiKey, langId);

  // Fetch products
  const data = await fetchPS(baseUrl, apiKey, "products", {
    display: "[id,name,description_short,price,reference,active,id_category_default,id_default_image,link_rewrite,minimal_quantity]",
    "filter[active]": "1",
    language: langId,
  });

  const products = data.products || [];

  const enriched = await Promise.all(
    products
      .filter((p: any) => p.id_category_default !== "2")
      .map(async (p: any) => {
        const imgId = p.id_default_image;
        const imageUrl = imgId && imgId !== "0" && imgId !== ""
          ? `${baseUrl}/api/images/products/${p.id}/${imgId}?ws_key=${apiKey}`
          : "";

        const name = extractLang(p.name, langId);
        const shortDesc = extractLang(p.description_short, langId)?.replace(/<[^>]*>/g, "").trim() || "";
        const slug = extractLang(p.link_rewrite, langId) || `product-${p.id}`;

        const priceHT = parseFloat(p.price) || 0;
        const categoryId = String(p.id_category_default);
        const { gamme, mode } = mapCategory(categoryId);
        const finalMode = priceHT === 0 ? "location" : mode;

        // Fetch combinations for this product
        const combinations = await fetchCombinations(baseUrl, apiKey, String(p.id), optionLookup);

        // Extract unique colors and sizes from combinations
        const colors: string[] = [];
        const sizes: string[] = [];
        for (const combo of combinations) {
          for (const attr of combo.attributes) {
            const groupLower = attr.group.toLowerCase();
            if (groupLower.includes("couleur") || groupLower.includes("color") || groupLower.includes("kleur")) {
              if (!colors.includes(attr.name)) colors.push(attr.name);
            }
            if (groupLower.includes("taille") || groupLower.includes("size") || groupLower.includes("contenance") || groupLower.includes("maat")) {
              if (!sizes.includes(attr.name)) sizes.push(attr.name);
            }
          }
        }

        // Build price tiers from combinations (different sizes may have different price impacts)
        const priceTiers = combinations
          .filter((c) => c.price !== 0 || combinations.length === 1)
          .map((c) => ({
            combinationId: c.id,
            reference: c.reference,
            priceHT: priceHT + c.price, // base + impact
            attributes: c.attributes,
            stock: c.quantity,
          }));

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
          combinations: combinations.length > 0 ? combinations : undefined,
          colors: colors.length > 0 ? colors : undefined,
          sizes: sizes.length > 0 ? sizes : undefined,
          priceTiers: priceTiers.length > 0 ? priceTiers : undefined,
        };
      })
  );

  return enriched;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const PRESTASHOP_API_KEY = Deno.env.get("PRESTASHOP_API_KEY");
  const PRESTASHOP_URL = Deno.env.get("PRESTASHOP_URL");

  if (!PRESTASHOP_API_KEY || !PRESTASHOP_URL) {
    return new Response(JSON.stringify({ error: "PRESTASHOP_API_KEY or PRESTASHOP_URL not configured" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const baseUrl = PRESTASHOP_URL.replace(/\/$/, "");

  // Accept lang param (default: 1 = French)
  const url = new URL(req.url);
  const langId = url.searchParams.get("lang") || "1";

  try {
    const products = await getProducts(baseUrl, PRESTASHOP_API_KEY, langId);
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
