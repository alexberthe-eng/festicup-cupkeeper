// Edge function: create-payment — creates order + Mollie payment
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

interface CartItem {
  productId: string;
  productName: string;
  productSlug: string;
  qty: number;
  mode: "achat" | "location";
  unitPriceHT: number;
  color: string;
  customText: string;
  withLogo: boolean;
}

interface CheckoutBody {
  items: CartItem[];
  customer: {
    email: string;
    name: string;
    phone?: string;
    company?: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };
  totalHT: number;
  totalTTC: number;
  userId?: string | null;
  redirectUrl: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const MOLLIE_API_KEY = Deno.env.get("MOLLIE_API_KEY");
    if (!MOLLIE_API_KEY) {
      throw new Error("MOLLIE_API_KEY not configured");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body: CheckoutBody = await req.json();

    // Validate
    if (!body.items?.length) throw new Error("Cart is empty");
    if (!body.customer?.email) throw new Error("Email is required");
    if (!body.customer?.name) throw new Error("Name is required");
    if (!body.customer?.address?.street) throw new Error("Address is required");

    // Create order in database
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        items: body.items,
        customer_email: body.customer.email,
        customer_name: body.customer.name,
        customer_phone: body.customer.phone || null,
        customer_company: body.customer.company || null,
        customer_address: body.customer.address,
        total_ht: body.totalHT,
        total_ttc: body.totalTTC,
        status: "pending",
        user_id: body.userId || null,
      })
      .select("id, order_number")
      .single();

    if (orderError) {
      console.error("Order insert error:", orderError);
      throw new Error(`Failed to create order: ${orderError.message}`);
    }

    // Build line items description
    const description = body.items
      .map((i) => `${i.productName} x${i.qty}`)
      .join(", ");

    // Determine webhook URL
    const webhookUrl = `${SUPABASE_URL}/functions/v1/mollie-webhook`;

    // Create Mollie payment
    const mollieRes = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MOLLIE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: {
          currency: "EUR",
          value: body.totalTTC.toFixed(2),
        },
        description: `Festicup ${order.order_number} — ${description.substring(0, 120)}`,
        redirectUrl: `${body.redirectUrl}?order=${order.id}`,
        webhookUrl,
        metadata: {
          order_id: order.id,
          order_number: order.order_number,
        },
        methods: ["bancontact", "creditcard", "ideal", "paypal"],
      }),
    });

    if (!mollieRes.ok) {
      const errBody = await mollieRes.text();
      console.error("Mollie error:", errBody);
      throw new Error(`Mollie payment creation failed [${mollieRes.status}]: ${errBody}`);
    }

    const molliePayment = await mollieRes.json();

    // Update order with Mollie payment ID
    await supabase
      .from("orders")
      .update({
        mollie_payment_id: molliePayment.id,
        mollie_checkout_url: molliePayment._links?.checkout?.href || null,
      })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        orderId: order.id,
        orderNumber: order.order_number,
        checkoutUrl: molliePayment._links?.checkout?.href,
        paymentId: molliePayment.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error("Create payment error:", error);
    const msg = error instanceof Error ? error.message : "Unknown error";
    return new Response(JSON.stringify({ error: msg }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
