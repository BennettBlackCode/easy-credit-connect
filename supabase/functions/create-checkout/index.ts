
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  apiVersion: '2023-10-16'
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

const handler = async (req: Request) => {
  try {
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders
      });
    }

    const body = await req.text();
    const { productId, userId } = JSON.parse(body);

    if (!productId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing productId or userId' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    // Get product details
    const { data: product, error: productError } = await supabaseClient
      .from('stripe_products')
      .select('stripe_price_id, name')
      .eq('id', productId)
      .single();

    if (productError || !product || !product.stripe_price_id) {
      return new Response(JSON.stringify({ error: 'Product not found or invalid price ID' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Get user's email
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !userData?.email) {
      throw new Error('User not found or email missing');
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      customer_email: userData.email,
      line_items: [{ price: product.stripe_price_id, quantity: 1 }],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/billing?success=true&product=${productId}`,
      cancel_url: `${req.headers.get('origin')}/billing?canceled=true`,
      metadata: { user_id: userId, product_id: productId },
      allow_promotion_codes: true
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error('Checkout error:', err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: corsHeaders
    });
  }
};

Deno.serve(handler);
