
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const signature = req.headers.get('stripe-signature');
    const body = await req.text();
    
    if (!signature) {
      throw new Error('No stripe signature found');
    }

    console.log('Webhook received - Signature:', signature);

    // Verify the event
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
      );
      console.log('Event verified:', event.type);
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return new Response(
        JSON.stringify({ error: 'Webhook signature verification failed' }), 
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') || '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
    );

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      const userId = session.metadata.user_id;
      
      console.log('Processing session:', {
        id: session.id,
        userId: userId,
        metadata: session.metadata
      });

      // Get product details
      const { data: product, error: productError } = await supabase
        .from('stripe_products')
        .select('*')
        .eq('id', session.metadata.product_id)
        .single();

      if (productError || !product) {
        console.error('Product fetch error:', productError);
        throw new Error('Product not found');
      }

      console.log('Found product:', product);

      // Add credits
      const { error: creditError } = await supabase.rpc(
        'increment_user_credits',
        {
          user_id: userId,
          amount: product.credits_included
        }
      );

      if (creditError) {
        console.error('Credit increment error:', creditError);
        throw new Error(`Failed to add credits: ${creditError.message}`);
      }

      console.log('Credits added:', {
        userId: userId,
        amount: product.credits_included
      });

      // Log the transaction
      await supabase
        .from('credit_transactions')
        .insert({
          user_id: userId,
          credit_amount: product.credits_included,
          transaction_type: 'stripe_purchase',
          description: `Purchase of ${product.name}`,
          stripe_session_id: session.id
        });

      console.log('Transaction logged successfully');
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });

  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(
      JSON.stringify({ error: err.message }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400
      }
    );
  }
});
