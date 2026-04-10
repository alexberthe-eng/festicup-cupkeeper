// Edge function: stripe-webhook — handles Stripe payment status updates
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";
import Stripe from "https://esm.sh/stripe@17.7.0?target=deno";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

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

    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    let event: Stripe.Event;

    // If we have a webhook signing secret, verify the signature
    const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    if (STRIPE_WEBHOOK_SECRET && sig) {
      event = stripe.webhooks.constructEvent(body, sig, STRIPE_WEBHOOK_SECRET);
    } else {
      // Fallback: parse body directly (for testing or if no webhook secret configured)
      event = JSON.parse(body) as Stripe.Event;
    }

    console.log(`Stripe webhook received: ${event.type}`);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;

      if (!orderId) {
        console.error("No order_id in session metadata");
        return new Response("OK", { status: 200 });
      }

      const paymentStatus = session.payment_status; // "paid", "unpaid", "no_payment_required"
      let orderStatus = "pending";
      if (paymentStatus === "paid") orderStatus = "paid";

      const { data: updatedOrders, error } = await supabase
        .from("orders")
        .update({
          status: orderStatus,
          mollie_payment_id: session.payment_intent as string || session.id,
          updated_at: new Date().toISOString(),
        })
        .eq("id", orderId)
        .select("id");

      if (error) {
        console.error("Order update error:", error);
        return new Response("Database update failed", { status: 500 });
      }

      console.log(`Order ${orderId} updated to ${orderStatus}`);

      // If payment succeeded, sync order to PrestaShop
      if (orderStatus === "paid" && updatedOrders?.length > 0) {
        console.log(`Triggering PrestaShop sync for order ${orderId}...`);
        try {
          const syncRes = await fetch(`${SUPABASE_URL}/functions/v1/sync-order-to-prestashop`, {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ orderId }),
          });
          const syncData = await syncRes.json();
          console.log(`PrestaShop sync result:`, syncData);
        } catch (syncErr) {
          console.error("PrestaShop sync failed (non-blocking):", syncErr);
        }
      }
    } else if (event.type === "checkout.session.expired") {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.order_id;
      if (orderId) {
        await supabase
          .from("orders")
          .update({ status: "cancelled", updated_at: new Date().toISOString() })
          .eq("id", orderId);
        console.log(`Order ${orderId} cancelled (session expired)`);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return new Response("Internal error", { status: 500 });
  }
});
