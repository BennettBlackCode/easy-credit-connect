
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";
import Stripe from "https://esm.sh/stripe@12.1.1?target=deno";

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
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
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      throw new Error('No Stripe signature found');
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
      console.log('Processing session:', {
        id: session.id,
        userId: session.client_reference_id,
        metadata: session.metadata
      });

      // Get product details
      const { data: product, error: productError } = await supabase
        .from('stripe_products')
        .select('*')
        .eq('id', session.metadata?.product_id)
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
          user_id: session.client_reference_id,
          amount: product.credits_included
        }
      );

      if (creditError) {
        console.error('Credit increment error:', creditError);
        throw new Error(`Failed to add credits: ${creditError.message}`);
      }

      console.log('Credits added:', {
        userId: session.client_reference_id,
        amount: product.credits_included
      });

      // Log the transaction
      await supabase
        .from('audit_logs')
        .insert({
          user_id: session.client_reference_id,
          action_type: 'credit_purchase',
          details: {
            session_id: session.id,
            product_id: product.id,
            credits_added: product.credits_included,
            amount_paid: session.amount_total
          }
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
