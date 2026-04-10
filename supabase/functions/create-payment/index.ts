// Edge function: create-payment — creates order + Stripe Checkout Session
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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
    const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");
    if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const stripe = new Stripe(STRIPE_SECRET_KEY, { apiVersion: "2024-12-18.acacia" });

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

    // Build Stripe line items
    const lineItems = body.items.map((item) => ({
      price_data: {
        currency: "eur",
        product_data: {
          name: item.productName,
          metadata: { productId: item.productId, mode: item.mode },
        },
        // Stripe expects amounts in cents, unit_amount is price TTC per unit
        unit_amount: Math.round(item.unitPriceHT * 1.21 * 100),
      },
      quantity: item.qty,
    }));

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card", "bancontact", "ideal"],
      mode: "payment",
      customer_email: body.customer.email,
      line_items: lineItems,
      metadata: {
        order_id: order.id,
        order_number: order.order_number,
      },
      success_url: `${body.redirectUrl}?order=${order.id}`,
      cancel_url: `${body.redirectUrl}?order=${order.id}`,
    });

    // Update order with Stripe session ID
    await supabase
      .from("orders")
      .update({
        mollie_payment_id: session.id,
        mollie_checkout_url: session.url || null,
      })
      .eq("id", order.id);

    return new Response(
      JSON.stringify({
        orderId: order.id,
        orderNumber: order.order_number,
        checkoutUrl: session.url,
        sessionId: session.id,
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
