import { createClient } from '@supabase/supabase-js';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Content-Type': 'application/json'
};

// Function to create a checkout session using fetch
const createCheckoutSession = async (params: Record<string, string>) => {
  const url = 'https://api.stripe.com/v1/checkout/sessions';
  const headers = {
    'Authorization': `Bearer ${process.env.STRIPE_SECRET_KEY}`,
    'Content-Type': 'application/x-www-form-urlencoded',
  };
  const body = new URLSearchParams(params).toString();
  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  });
  if (!response.ok) {
    throw new Error(`Stripe API error: ${await response.text()}`);
  }
  return await response.json();
};

// Handler function
const handler = async (req: Request): Promise<Response> => {
  try {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, { 
        status: 200, 
        headers: corsHeaders 
      });
    }

    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: corsHeaders
      });
    }

    // Parse request body
    const body = await req.text();
    const { productId, userId } = JSON.parse(body);

    if (!productId || !userId) {
      return new Response(JSON.stringify({ error: 'Missing productId or userId' }), {
        status: 400,
        headers: corsHeaders
      });
    }

    // Initialize Supabase client
    const supabaseClient = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get product details from Supabase
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

    // Get user's email from Supabase
    const { data: userData, error: userError } = await supabaseClient
      .from('users')
      .select('email')
      .eq('id', userId)
      .single();

    if (userError || !userData?.email) {
      throw new Error('User not found or email missing');
    }

    // Create Stripe checkout session using fetch
    const params: Record<string, string> = {
      'customer_email': userData.email,
      'mode': 'subscription',
      'success_url': `${req.headers.get('origin')}/billing?success=true&product=${productId}`,
      'cancel_url': `${req.headers.get('origin')}/billing?canceled=true`,
      'allow_promotion_codes': 'true',
      'line_items[0][price]': product.stripe_price_id,
      'line_items[0][quantity]': '1',
      'metadata[user_id]': userId,
      'metadata[product_id]': productId,
    };
    const session = await createCheckoutSession(params);

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: corsHeaders
    });
  } catch (err) {
    console.error('Checkout error:', (err as Error).message);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: corsHeaders
    });
  }
};

// Serve with Deno.serve
Deno.serve(handler);
