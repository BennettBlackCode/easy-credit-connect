
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
    const { productId, userId } = await req.json();

    if (!productId || !userId) {
      throw new Error('Missing productId or userId');
    }

    // Get Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Get the product details
    const { data: product, error: productError } = await supabaseClient
      .from('stripe_products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      throw new Error('Product not found');
    }

    // Get or create Stripe customer
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      throw new Error('User not found');
    }

    let customerId = user.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: userId,
        },
      });
      customerId = customer.id;

      // Update user with Stripe customer ID
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', userId);

      if (updateError) {
        throw updateError;
      }
    }

    console.log('Creating checkout session for:', {
      customerId,
      priceId: product.price_id,
      productId,
      userId,
    });

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: product.price_id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${req.headers.get('origin')}/billing?success=true`,
      cancel_url: `${req.headers.get('origin')}/billing?canceled=true`,
      metadata: {
        product_id: productId,
        user_id: userId,
      },
    });

    console.log('Checkout session created:', session.id);

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error creating checkout session:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
