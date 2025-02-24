
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    console.log('Received webhook body:', body);

    const event = JSON.parse(body);
    console.log('Event type:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing session:', {
        id: session.id,
        userId: session.client_reference_id,
        productId: session.metadata?.product_id
      });

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
      );

      // First get the product details
      const { data: product, error: productError } = await supabase
        .from('stripe_products')
        .select('*')
        .eq('id', session.metadata?.product_id)
        .single();

      if (productError) {
        console.error('Error fetching product:', productError);
        throw new Error(`Product fetch error: ${productError.message}`);
      }

      if (!product) {
        throw new Error('Product not found');
      }

      console.log('Found product:', product);

      // Call increment_user_credits directly
      const { error: creditError } = await supabase.rpc(
        'increment_user_credits',
        {
          user_id: session.client_reference_id,
          amount: product.credits_included
        }
      );

      if (creditError) {
        console.error('Error incrementing credits:', creditError);
        throw new Error(`Credit increment error: ${creditError.message}`);
      }

      // Log successful credit addition
      console.log('Credits added successfully:', {
        userId: session.client_reference_id,
        creditsAdded: product.credits_included
      });

      // Add an audit log entry
      const { error: auditError } = await supabase
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

      if (auditError) {
        console.error('Error creating audit log:', auditError);
      }
    }

    // Always return a 200 response to acknowledge receipt
    return new Response(
      JSON.stringify({ received: true }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (err) {
    console.error('Webhook error:', err);
    
    // Even on error, return 200 so Stripe doesn't retry
    return new Response(
      JSON.stringify({
        error: err.message,
        received: true
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );
  }
});
