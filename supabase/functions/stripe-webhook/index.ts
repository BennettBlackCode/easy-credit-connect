
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const stripe = await import("https://esm.sh/stripe@13.6.0?target=deno");
const Stripe = stripe.default;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      } 
    });
  }

  try {
    console.log('Request received:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
    });

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get the raw body first
    const rawBody = await req.text();
    console.log('Raw body received:', rawBody);

    let event;
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
    const signature = req.headers.get("stripe-signature");

    try {
      const stripeClient = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
        apiVersion: '2023-10-16',
        httpClient: Stripe.createFetchHttpClient(),
      });

      if (signature && webhookSecret) {
        event = stripeClient.webhooks.constructEvent(rawBody, signature, webhookSecret);
      } else {
        // If we don't have a signature, try to parse the body directly
        // This is less secure but helps with debugging
        event = JSON.parse(rawBody);
        console.log('Warning: Processing unsigned event:', event);
      }
    } catch (err) {
      console.error('Error parsing webhook:', err);
      throw err;
    }

    console.log('Processing event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing completed checkout session:', session.id);

      // Get promotion code if present
      const promotionCode = session.total_details?.breakdown?.discounts?.[0]?.discount?.promotion_code;
      
      try {
        // Call the handle_stripe_purchase function directly
        const { error: purchaseError } = await supabase.rpc('handle_stripe_purchase', {
          _user_id: session.client_reference_id,
          _product_name: session.metadata?.product_name || 'Starter Plan', // Make sure this matches your product name
          _stripe_session_id: session.id,
          _promotion_code: promotionCode
        });

        if (purchaseError) {
          console.error('Error handling purchase:', purchaseError);
          throw purchaseError;
        }

        console.log('Successfully processed purchase');
      } catch (error) {
        console.error('Error in purchase processing:', error);
        throw error;
      }
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: err.message }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200, // Return 200 even on error to prevent retries
      }
    );
  }
});
