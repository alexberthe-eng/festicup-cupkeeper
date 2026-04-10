// Edge function to sync PrestaShop orders into Supabase orders table
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// PrestaShop order state mapping
const PS_STATE_MAP: Record<string, string> = {
  "1": "pending",       // Awaiting check payment
  "2": "pending",       // Payment accepted (awaiting)
  "3": "processing",    // Processing in progress
  "4": "shipped",       // Shipped
  "5": "delivered",     // Delivered
  "6": "cancelled",     // Canceled
  "7": "refunded",      // Refunded
  "8": "error",         // Payment error
  "9": "pending",       // On backorder (not paid)
  "10": "pending",      // Awaiting bank wire
  "11": "pending",      // Remote payment accepted
  "12": "pending",      // On backorder (paid)
};

async function fetchPS(baseUrl: string, apiKey: string, resource: string, params: Record<string, string> = {}) {
  const url = new URL(`${baseUrl}/api/${resource}`);
  url.searchParams.set("output_format", "JSON");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${btoa(`${apiKey}:`)}` },
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PrestaShop API [${res.status}]: ${body}`);
  }
  return res.json();
}

async function fetchCustomer(baseUrl: string, apiKey: string, customerId: string) {
  try {
    const data = await fetchPS(baseUrl, apiKey, `customers/${customerId}`);
    const c = data?.customer;
    if (!c) return null;
    return {
      email: c.email || "",
      name: `${c.firstname || ""} ${c.lastname || ""}`.trim(),
      company: c.company || null,
    };
  } catch {
    return null;
  }
}

async function fetchAddress(baseUrl: string, apiKey: string, addressId: string) {
  try {
    const data = await fetchPS(baseUrl, apiKey, `addresses/${addressId}`);
    const a = data?.address;
    if (!a) return null;
    return {
      street: `${a.address1 || ""}${a.address2 ? ", " + a.address2 : ""}`,
      city: a.city || "",
      postalCode: a.postcode || "",
      country: a.id_country || "",
      phone: a.phone || a.phone_mobile || null,
    };
  } catch {
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const PRESTASHOP_API_KEY = Deno.env.get("PRESTASHOP_API_KEY");
  const PRESTASHOP_URL = Deno.env.get("PRESTASHOP_URL");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!PRESTASHOP_API_KEY || !PRESTASHOP_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Missing environment variables" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }

  const baseUrl = PRESTASHOP_URL.replace(/\/$/, "");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    // Parse optional params
    const url = new URL(req.url);
    const limitParam = url.searchParams.get("limit") || "50";
    const sinceParam = url.searchParams.get("since"); // ISO date string

    // Fetch orders from PrestaShop
    const psParams: Record<string, string> = {
      display: "full",
      limit: limitParam,
      sort: "[id_DESC]",
    };
    if (sinceParam) {
      psParams["filter[date_add]"] = `>[${sinceParam}]`;
    }

    const data = await fetchPS(baseUrl, PRESTASHOP_API_KEY, "orders", psParams);
    const psOrders = data?.orders || [];

    if (psOrders.length === 0) {
      return new Response(JSON.stringify({ synced: 0, message: "No orders to sync" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Check which PS order IDs already exist
    const psIds = psOrders.map((o: any) => parseInt(o.id));
    const { data: existing } = await supabase
      .from("orders")
      .select("prestashop_order_id")
      .in("prestashop_order_id", psIds);

    const existingIds = new Set((existing || []).map((e: any) => e.prestashop_order_id));

    let synced = 0;
    let skipped = 0;
    const errors: string[] = [];

    for (const order of psOrders) {
      const psId = parseInt(order.id);

      if (existingIds.has(psId)) {
        skipped++;
        continue;
      }

      // Fetch customer & address info
      const customer = await fetchCustomer(baseUrl, PRESTASHOP_API_KEY, String(order.id_customer));
      const address = await fetchAddress(baseUrl, PRESTASHOP_API_KEY, String(order.id_address_delivery));

      // Map order rows to items
      const orderRows = order.associations?.order_rows || [];
      const items = orderRows.map((r: any) => ({
        productId: r.product_id,
        productName: r.product_name,
        qty: parseInt(r.product_quantity) || 1,
        unitPriceHT: parseFloat(r.unit_price_tax_excl) || parseFloat(r.product_price) || 0,
        mode: "achat",
        color: "",
        withLogo: false,
        customText: "",
        productSlug: "",
        productReference: r.product_reference || "",
      }));

      const status = PS_STATE_MAP[String(order.current_state)] || "pending";

      const record = {
        prestashop_order_id: psId,
        order_number: `PS-${order.reference || psId}`,
        items,
        customer_email: customer?.email || "unknown@prestashop.local",
        customer_name: customer?.name || "Client PrestaShop",
        customer_phone: address?.phone || null,
        customer_company: customer?.company || null,
        customer_address: address ? {
          street: address.street,
          city: address.city,
          postalCode: address.postalCode,
          country: address.country,
        } : null,
        total_ht: parseFloat(order.total_paid_tax_excl) || 0,
        total_ttc: parseFloat(order.total_paid_tax_incl) || 0,
        status,
        notes: order.note || null,
        created_at: order.date_add ? new Date(order.date_add).toISOString() : new Date().toISOString(),
      };

      const { error } = await supabase.from("orders").insert(record);

      if (error) {
        errors.push(`Order PS-${psId}: ${error.message}`);
      } else {
        synced++;
      }
    }

    return new Response(
      JSON.stringify({
        synced,
        skipped,
        total: psOrders.length,
        errors: errors.length > 0 ? errors : undefined,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Sync error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
