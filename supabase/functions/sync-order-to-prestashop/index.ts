// Edge function: push a Lovable order to PrestaShop back-office
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Country ISO → PrestaShop country id mapping
const COUNTRY_MAP: Record<string, string> = {
  BE: "3", FR: "8", NL: "13", LU: "12", DE: "1",
};

const DEFAULT_CARRIER_ID = "9"; // DPD Classic
const DEFAULT_LANG_ID = "1";
const DEFAULT_CURRENCY_ID = "1";
const DEFAULT_SHOP_ID = "1";

/* ── PrestaShop API helpers ──────────────────────────────── */

async function psGet(baseUrl: string, apiKey: string, resource: string, params: Record<string, string> = {}) {
  const url = new URL(`${baseUrl}/api/${resource}`);
  url.searchParams.set("output_format", "JSON");
  for (const [k, v] of Object.entries(params)) url.searchParams.set(k, v);
  const res = await fetch(url.toString(), {
    headers: { Authorization: `Basic ${btoa(`${apiKey}:`)}` },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`PS GET ${resource} [${res.status}]: ${body}`);
  }
  return res.json();
}

async function psPost(baseUrl: string, apiKey: string, resource: string, xml: string) {
  const res = await fetch(`${baseUrl}/api/${resource}`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(`${apiKey}:`)}`,
      "Content-Type": "application/xml",
    },
    body: xml,
  });
  const body = await res.text();
  if (!res.ok) {
    throw new Error(`PS POST ${resource} [${res.status}]: ${body}`);
  }
  // Parse response to extract created ID
  const idMatch = body.match(/<id>(?:<!\[CDATA\[)?(\d+)(?:\]\]>)?<\/id>/);
  return { raw: body, id: idMatch ? idMatch[1] : null };
}

/* ── Find or create PrestaShop customer ──────────────────── */

async function findOrCreateCustomer(
  baseUrl: string,
  apiKey: string,
  email: string,
  name: string
): Promise<string> {
  // Search existing customer by email
  try {
    const data = await psGet(baseUrl, apiKey, "customers", {
      "display": "[id]",
      "filter[email]": email,
    });
    const customers = data?.customers || [];
    if (customers.length > 0) return String(customers[0].id);
  } catch { /* not found, create */ }

  // Split name
  const parts = name.trim().split(/\s+/);
  const firstname = parts[0] || "Client";
  const lastname = parts.slice(1).join(" ") || "Lovable";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <customer>
    <id_default_group>3</id_default_group>
    <id_lang>${DEFAULT_LANG_ID}</id_lang>
    <id_shop>${DEFAULT_SHOP_ID}</id_shop>
    <id_shop_group>1</id_shop_group>
    <id_gender>0</id_gender>
    <id_risk>1</id_risk>
    <passwd>Lovable2025!</passwd>
    <lastname>${escXml(lastname)}</lastname>
    <firstname>${escXml(firstname)}</firstname>
    <email>${escXml(email)}</email>
    <active>1</active>
    <newsletter>0</newsletter>
    <optin>0</optin>
    <website></website>
    <company></company>
    <siret></siret>
    <ape></ape>
    <outstanding_allow_amount>0</outstanding_allow_amount>
    <show_public_prices>0</show_public_prices>
    <max_payment_days>0</max_payment_days>
    <secure_key></secure_key>
    <note></note>
    <is_guest>0</is_guest>
    <deleted>0</deleted>
    <groups>
      <group><id>3</id></group>
    </groups>
  </customer>
</prestashop>`;

  const { id } = await psPost(baseUrl, apiKey, "customers", xml);
  if (!id) throw new Error("Failed to create PS customer");
  return id;
}

/* ── Create PrestaShop address ───────────────────────────── */

async function createAddress(
  baseUrl: string,
  apiKey: string,
  customerId: string,
  address: { street: string; city: string; postalCode: string; country: string },
  name: string,
  phone?: string | null
): Promise<string> {
  const parts = name.trim().split(/\s+/);
  const firstname = parts[0] || "Client";
  const lastname = parts.slice(1).join(" ") || "Lovable";
  const countryId = COUNTRY_MAP[address.country?.toUpperCase()] || "3";

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <address>
    <id_customer>${customerId}</id_customer>
    <id_country>${countryId}</id_country>
    <id_state>0</id_state>
    <id_manufacturer>0</id_manufacturer>
    <id_supplier>0</id_supplier>
    <id_warehouse>0</id_warehouse>
    <alias>Lovable</alias>
    <company></company>
    <lastname>${escXml(lastname)}</lastname>
    <firstname>${escXml(firstname)}</firstname>
    <address1>${escXml(address.street)}</address1>
    <address2></address2>
    <postcode>${escXml(address.postalCode)}</postcode>
    <city>${escXml(address.city)}</city>
    <other></other>
    <phone>${escXml(phone || "")}</phone>
    <phone_mobile></phone_mobile>
    <vat_number></vat_number>
    <dni></dni>
    <active>1</active>
    <deleted>0</deleted>
  </address>
</prestashop>`;

  const { id } = await psPost(baseUrl, apiKey, "addresses", xml);
  if (!id) throw new Error("Failed to create PS address");
  return id;
}

/* ── Create PrestaShop cart ──────────────────────────────── */

async function createCart(
  baseUrl: string,
  apiKey: string,
  customerId: string,
  addressId: string,
  items: any[]
): Promise<string> {
  const cartRows = items
    .filter((i: any) => i.productId)
    .map(
      (i: any) =>
        `<cart_row><id_product>${i.productId}</id_product><id_product_attribute>0</id_product_attribute><id_address_delivery>${addressId}</id_address_delivery><quantity>${i.qty || 1}</quantity></cart_row>`
    )
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <cart>
    <id_currency>${DEFAULT_CURRENCY_ID}</id_currency>
    <id_lang>${DEFAULT_LANG_ID}</id_lang>
    <id_customer>${customerId}</id_customer>
    <id_address_delivery>${addressId}</id_address_delivery>
    <id_address_invoice>${addressId}</id_address_invoice>
    <id_carrier>${DEFAULT_CARRIER_ID}</id_carrier>
    <id_shop>${DEFAULT_SHOP_ID}</id_shop>
    <id_shop_group>1</id_shop_group>
    <id_guest>0</id_guest>
    <recyclable>0</recyclable>
    <gift>0</gift>
    <gift_message></gift_message>
    <mobile_theme>0</mobile_theme>
    <delivery_option></delivery_option>
    <secure_key></secure_key>
    <allow_seperated_package>0</allow_seperated_package>
    <associations>
      <cart_rows>
        ${cartRows}
      </cart_rows>
    </associations>
  </cart>
</prestashop>`;

  const { id } = await psPost(baseUrl, apiKey, "carts", xml);
  if (!id) throw new Error("Failed to create PS cart");
  return id;
}

/* ── Create PrestaShop order ─────────────────────────────── */

async function createOrder(
  baseUrl: string,
  apiKey: string,
  cartId: string,
  customerId: string,
  addressId: string,
  totalPaid: number,
  orderNumber: string
): Promise<string> {
  // State 2 = "Paiement accepté"
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<prestashop xmlns:xlink="http://www.w3.org/1999/xlink">
  <order>
    <id_address_delivery>${addressId}</id_address_delivery>
    <id_address_invoice>${addressId}</id_address_invoice>
    <id_cart>${cartId}</id_cart>
    <id_currency>${DEFAULT_CURRENCY_ID}</id_currency>
    <id_lang>${DEFAULT_LANG_ID}</id_lang>
    <id_customer>${customerId}</id_customer>
    <id_carrier>${DEFAULT_CARRIER_ID}</id_carrier>
    <id_shop>${DEFAULT_SHOP_ID}</id_shop>
    <id_shop_group>1</id_shop_group>
    <current_state>2</current_state>
    <module>mollie</module>
    <payment>Mollie (via Lovable)</payment>
    <total_paid>${totalPaid.toFixed(6)}</total_paid>
    <total_paid_tax_incl>${totalPaid.toFixed(6)}</total_paid_tax_incl>
    <total_paid_tax_excl>${(totalPaid / 1.21).toFixed(6)}</total_paid_tax_excl>
    <total_paid_real>${totalPaid.toFixed(6)}</total_paid_real>
    <total_products>${(totalPaid / 1.21).toFixed(6)}</total_products>
    <total_products_wt>${totalPaid.toFixed(6)}</total_products_wt>
    <total_shipping>0.000000</total_shipping>
    <total_shipping_tax_incl>0.000000</total_shipping_tax_incl>
    <total_shipping_tax_excl>0.000000</total_shipping_tax_excl>
    <total_wrapping>0.000000</total_wrapping>
    <total_wrapping_tax_incl>0.000000</total_wrapping_tax_incl>
    <total_wrapping_tax_excl>0.000000</total_wrapping_tax_excl>
    <total_discounts>0.000000</total_discounts>
    <total_discounts_tax_incl>0.000000</total_discounts_tax_incl>
    <total_discounts_tax_excl>0.000000</total_discounts_tax_excl>
    <conversion_rate>1.000000</conversion_rate>
    <round_mode>0</round_mode>
    <round_type>0</round_type>
    <invoice_number>0</invoice_number>
    <delivery_number>0</delivery_number>
    <shipping_number></shipping_number>
    <note>Commande Lovable ${escXml(orderNumber)}</note>
    <valid>1</valid>
    <recyclable>0</recyclable>
    <gift>0</gift>
    <gift_message></gift_message>
    <mobile_theme>0</mobile_theme>
    <secure_key></secure_key>
    <reference></reference>
  </order>
</prestashop>`;

  const { id } = await psPost(baseUrl, apiKey, "orders", xml);
  if (!id) throw new Error("Failed to create PS order");
  return id;
}

/* ── Utility ─────────────────────────────────────────────── */

function escXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/* ── Main handler ────────────────────────────────────────── */

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const PRESTASHOP_API_KEY = Deno.env.get("PRESTASHOP_API_KEY");
  const PRESTASHOP_URL = Deno.env.get("PRESTASHOP_URL");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!PRESTASHOP_API_KEY || !PRESTASHOP_URL || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return new Response(JSON.stringify({ error: "Missing env vars" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const baseUrl = PRESTASHOP_URL.replace(/\/$/, "");
  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    const { orderId } = await req.json();
    if (!orderId) throw new Error("orderId is required");

    // Fetch order from Supabase
    const { data: order, error: fetchErr } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (fetchErr || !order) throw new Error(`Order not found: ${fetchErr?.message}`);

    // Skip if already synced
    if (order.prestashop_order_id) {
      return new Response(
        JSON.stringify({ message: "Already synced", prestashop_order_id: order.prestashop_order_id }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const address = (order.customer_address as any) || {};
    const items = Array.isArray(order.items) ? order.items : [];

    // 1. Find or create customer in PrestaShop
    console.log(`[sync-ps] Finding/creating customer: ${order.customer_email}`);
    const psCustomerId = await findOrCreateCustomer(
      baseUrl, PRESTASHOP_API_KEY, order.customer_email, order.customer_name
    );

    // 2. Create address
    console.log(`[sync-ps] Creating address for customer ${psCustomerId}`);
    const psAddressId = await createAddress(
      baseUrl, PRESTASHOP_API_KEY, psCustomerId, address, order.customer_name, order.customer_phone
    );

    // 3. Create cart
    console.log(`[sync-ps] Creating cart with ${items.length} items`);
    const psCartId = await createCart(
      baseUrl, PRESTASHOP_API_KEY, psCustomerId, psAddressId, items
    );

    // 4. Create order
    console.log(`[sync-ps] Creating order from cart ${psCartId}`);
    const psOrderId = await createOrder(
      baseUrl, PRESTASHOP_API_KEY, psCartId, psCustomerId, psAddressId,
      Number(order.total_ttc), order.order_number
    );

    // 5. Update Supabase order with PS order ID
    await supabase
      .from("orders")
      .update({ prestashop_order_id: parseInt(psOrderId) })
      .eq("id", orderId);

    console.log(`[sync-ps] ✅ Order ${order.order_number} → PS order #${psOrderId}`);

    return new Response(
      JSON.stringify({
        success: true,
        prestashop_order_id: psOrderId,
        prestashop_customer_id: psCustomerId,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error: unknown) {
    console.error("[sync-ps] Error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
