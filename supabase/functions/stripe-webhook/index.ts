
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: corsHeaders 
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const body = await req.text();
    const event = JSON.parse(body);
    console.log('Processing event:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Processing completed session:', session.id);

      // Get user and product information
      const userId = session.client_reference_id;
      const productId = session.metadata?.product_id;

      // Get product details from our database
      const { data: product, error: productError } = await supabase
        .from('stripe_products')
        .select('name, credits_included')
        .eq('id', productId)
        .single();

      if (productError || !product) {
        throw new Error(`Product not found: ${productError?.message}`);
      }

      // Use our existing increment_user_credits function
      const { error: creditError } = await supabase.rpc('increment_user_credits', {
        user_id: userId,
        amount: product.credits_included
      });

      if (creditError) {
        throw new Error(`Failed to increment credits: ${creditError.message}`);
      }

      console.log('Successfully added credits:', {
        userId,
        product: product.name,
        credits: product.credits_included
      });
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
        status: 200, // Always return 200 to acknowledge receipt
      }
    );
  }
});
