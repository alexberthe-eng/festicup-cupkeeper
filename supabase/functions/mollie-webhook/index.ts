// Edge function: mollie-webhook — handles Mollie payment status updates
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const MOLLIE_API_KEY = Deno.env.get("MOLLIE_API_KEY");
    if (!MOLLIE_API_KEY) throw new Error("MOLLIE_API_KEY not configured");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Mollie sends form-urlencoded body with `id` field
    const formData = await req.formData();
    const paymentId = formData.get("id") as string;

    if (!paymentId) {
      return new Response("Missing payment id", { status: 400 });
    }

    console.log(`Webhook received for payment: ${paymentId}`);

    // Fetch payment details from Mollie
    const mollieRes = await fetch(`https://api.mollie.com/v2/payments/${paymentId}`, {
      headers: { "Authorization": `Bearer ${MOLLIE_API_KEY}` },
    });

    if (!mollieRes.ok) {
      const errBody = await mollieRes.text();
      console.error(`Mollie fetch error [${mollieRes.status}]:`, errBody);
      return new Response("Failed to fetch payment", { status: 500 });
    }

    const payment = await mollieRes.json();
    const mollieStatus = payment.status; // paid, failed, cancelled, expired, open, pending

    // Map Mollie status to our order status
    let orderStatus = "pending";
    if (mollieStatus === "paid") orderStatus = "paid";
    else if (mollieStatus === "cancelled" || mollieStatus === "expired" || mollieStatus === "failed") orderStatus = "cancelled";

    // Update order and get the order ID
    const { data: updatedOrders, error } = await supabase
      .from("orders")
      .update({
        status: orderStatus,
        updated_at: new Date().toISOString(),
      })
      .eq("mollie_payment_id", paymentId)
      .select("id");

    if (error) {
      console.error("Order update error:", error);
      return new Response("Database update failed", { status: 500 });
    }

    console.log(`Order updated: payment=${paymentId}, status=${orderStatus}`);

    // If payment succeeded, sync order to PrestaShop
    if (orderStatus === "paid" && updatedOrders?.length > 0) {
      const orderId = updatedOrders[0].id;
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
        // Don't fail the webhook if PS sync fails — log and continue
        console.error("PrestaShop sync failed (non-blocking):", syncErr);
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error: unknown) {
    console.error("Webhook error:", error);
    return new Response("Internal error", { status: 500 });
  }
});
