
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, userId } = await req.json();
    if (!productId || !userId) {
      throw new Error('Missing productId or userId');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Get product details
    const { data: product, error: productError } = await supabaseClient
      .from('stripe_products')
      .select('stripe_price_id, name')
      .eq('id', productId)
      .single();

    if (productError || !product || !product.stripe_price_id) {
      throw new Error('Product not found or invalid price ID');
    }

    // Get user details
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('email, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError) {
      throw new Error('User not found');
    }

    let customerId = user?.stripe_customer_id;

    // If no customer ID exists, create one
    if (!customerId) {
      const customer = await stripe.customers.create({
        metadata: {
          supabase_user_id: userId
        }
      });
      customerId = customer.id;

      // Update user with new customer ID
      await supabaseClient
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/billing?success=true&product=${productId}`,
      cancel_url: `${req.headers.get('origin')}/billing?canceled=true`,
      metadata: { user_id: userId, product_id: productId },
      client_reference_id: userId
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
