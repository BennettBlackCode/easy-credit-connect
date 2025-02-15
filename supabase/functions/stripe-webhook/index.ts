
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the request body
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;

    let event;
    const endpointSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret!);
    } catch (err) {
      console.error(`⚠️  Webhook signature verification failed.`, err.message);
      return new Response(JSON.stringify({ error: err.message }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Store the event in the webhook_events table
    const { error: webhookError } = await supabaseClient
      .from('webhook_events')
      .insert({
        stripe_event_id: event.id,
        type: event.type,
        data: event.data,
      });

    if (webhookError) {
      console.error('Error storing webhook event:', webhookError);
      throw webhookError;
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        
        // Get the product details from metadata
        const productId = session.metadata?.product_id;
        const userId = session.metadata?.user_id;

        if (!productId || !userId) {
          throw new Error('Missing product_id or user_id in session metadata');
        }

        // Get the product details
        const { data: product, error: productError } = await supabaseClient
          .from('stripe_products')
          .select('credits')
          .eq('id', productId)
          .single();

        if (productError) {
          throw productError;
        }

        // Create a transaction record
        const { error: transactionError } = await supabaseClient
          .from('transactions')
          .insert({
            user_id: userId,
            amount: product.credits,
            type: 'purchase',
            status: 'completed',
            stripe_payment_id: session.payment_intent,
            metadata: session,
          });

        if (transactionError) {
          throw transactionError;
        }

        // Update user credits - adding to existing credits for the current month
        const { error: updateError } = await supabaseClient.rpc(
          'increment_user_credits',
          { user_id: userId, amount: product.credits }
        );

        if (updateError) {
          throw updateError;
        }

        console.log(`Successfully added ${product.credits} credits to user ${userId}`);
        break;
      }
      // Add other event types as needed
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
