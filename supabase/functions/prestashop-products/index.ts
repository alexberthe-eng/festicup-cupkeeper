// PrestaShop products edge function
import { corsHeaders } from "@supabase/supabase-js/cors";

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

function extractLang(field: any): string {
  if (typeof field === "string") return field;
  if (Array.isArray(field)) {
    const fr = field.find((l: any) => l.attrs?.id === "2" || l.id === "2");
    return fr?.value || field[0]?.value || "";
  }
  if (field?.language) {
    return extractLang(field.language);
  }
  return field?.value || String(field || "");
}

async function getProducts(baseUrl: string, apiKey: string) {
  const data = await fetchPS(baseUrl, apiKey, "products", {
    "display": "[id,name,description_short,price,reference,active,id_category_default,associations]",
    "filter[active]": "1",
  });

  const products = data.products || [];

  const enriched = await Promise.all(
    products.map(async (p: any) => {
      let imageUrl = "";
      try {
        const imgData = await fetchPS(baseUrl, apiKey, `images/products/${p.id}`, {});
        if (imgData?.image?.declination) {
          const firstImg = Array.isArray(imgData.image.declination)
            ? imgData.image.declination[0]
            : imgData.image.declination;
          const imgId = firstImg?.["@attributes"]?.id || firstImg?.id;
          if (imgId) {
            imageUrl = `${baseUrl}/api/images/products/${p.id}/${imgId}?ws_key=${apiKey}`;
          }
        }
      } catch {
        // No image available
      }

      const name = extractLang(p.name);
      const shortDesc = extractLang(p.description_short)?.replace(/<[^>]*>/g, "") || "";

      return {
        id: String(p.id),
        name,
        shortDesc,
        priceHT: parseFloat(p.price) || 0,
        reference: p.reference || "",
        categoryId: p.id_category_default,
        image: imageUrl,
        active: p.active === "1",
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
    return new Response(JSON.stringify({ products }), {
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
