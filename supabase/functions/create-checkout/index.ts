
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
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { productId, userId } = await req.json();
    console.log('Creating checkout session for:', { productId, userId });

    if (!productId || !userId) {
      throw new Error('Missing required fields: productId or userId');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    // Get product details from Supabase
    const { data: product, error: productError } = await supabaseClient
      .from('stripe_products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError || !product) {
      console.error('Product lookup error:', productError);
      throw new Error('Product not found');
    }

    console.log('Found product:', {
      id: product.id,
      name: product.name,
      stripe_price_id: product.stripe_price_id
    });

    // Get user details with their status
    const { data: user, error: userError } = await supabaseClient
      .from('users')
      .select('email, status, stripe_customer_id')
      .eq('id', userId)
      .single();

    if (userError || !user) {
      console.error('User lookup error:', userError);
      throw new Error('User not found');
    }

    console.log('User details:', {
      email: user.email,
      status: user.status,
      hasStripeCustomerId: !!user.stripe_customer_id
    });

    let stripeCustomerId = user.stripe_customer_id;

    // If user doesn't have a Stripe customer ID, create one
    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_id: userId
        }
      });
      stripeCustomerId = customer.id;

      // Update user with new Stripe customer ID
      const { error: updateError } = await supabaseClient
        .from('users')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating user with Stripe customer ID:', updateError);
      }
    }

    // Create Checkout Session
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: product.stripe_price_id,
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
      client_reference_id: userId,
      allow_promotion_codes: true,
    });

    console.log('Checkout session created successfully:', {
      sessionId: session.id,
      url: session.url
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Checkout session creation failed:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
