
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

    // Get user details and stripe customer ID in a single query
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('stripe_customer_id, email')
      .eq('id', userId)
      .maybeSingle();

    if (userError) {
      console.error('User lookup error:', userError);
      throw new Error('Error looking up user');
    }

    if (!userData) {
      // If user doesn't exist in public.users table, get their email from auth.users
      const { data: { user }, error: authError } = await supabaseClient.auth.admin.getUserById(userId);
      
      if (authError || !user?.email) {
        throw new Error('User not found');
      }

      // Create new user record
      const { error: insertError } = await supabaseClient
        .from('users')
        .insert([{ id: userId, email: user.email }]);

      if (insertError) {
        throw new Error('Failed to create user record');
      }

      userData = { email: user.email, stripe_customer_id: null };
    }

    // Create or retrieve Stripe customer
    let stripeCustomerId = userData.stripe_customer_id;

    if (!stripeCustomerId) {
      console.log('Creating new Stripe customer for:', userData.email);
      const customer = await stripe.customers.create({
        email: userData.email,
        metadata: {
          supabase_user_id: userId
        }
      });
      stripeCustomerId = customer.id;

      // Update user with new Stripe customer ID
      await supabaseClient
        .from('users')
        .update({ stripe_customer_id: stripeCustomerId })
        .eq('id', userId);
    }

    console.log('Creating checkout session with price:', product.stripe_price_id);

    // Create Checkout Session with subscription mode
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: product.stripe_price_id,
          quantity: 1,
        },
      ],
      mode: 'subscription', // Changed from 'payment' to 'subscription'
      success_url: `${req.headers.get('origin')}/billing?success=true`,
      cancel_url: `${req.headers.get('origin')}/billing?canceled=true`,
      metadata: {
        product_id: productId,
        user_id: userId,
      },
      client_reference_id: userId,
      allow_promotion_codes: true,
    });

    console.log('Checkout session created:', {
      sessionId: session.id,
      customerId: stripeCustomerId,
      productId: productId,
      stripeProductId: product.stripe_product_id,
      stripePriceId: product.stripe_price_id
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
