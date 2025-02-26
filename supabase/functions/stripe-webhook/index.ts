import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';
import * as stripe from 'https://esm.sh/stripe';

type StripeEvent = {
  type: string;
  data: { object: any };
};

type ProductMapping = {
  [productId: string]: { credits: number };
};

const PRODUCT_MAPPING: ProductMapping = {
  '3f400036-bc93-4ca3-81ac-3d195f97e7c6': { credits: 3 },
  'd1864f1e-3871-4b74-9b3b-b85f042d4c19': { credits: 5 }
};

const stripeClient = stripe.Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

const RATE_LIMIT_WINDOW = 60000;
const MAX_REQUESTS_PER_WINDOW = 30;
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

let supabaseClient = null;
const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) throw new Error('Missing Supabase credentials');
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseClient;
};

const verifyWebhookSignature = (payload, signature, secret, timestamp) => {
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = createHmac('sha256', secret).update(signedPayload).digest('hex');
  let result = 0;
  for (let i = 0; i < expectedSig.length; i++) result |= expectedSig.charCodeAt(i) ^ signature.charCodeAt(i);
  return result === 0;
};

const checkRateLimit = (ip) => {
  const now = Date.now();
  const record = ipRequestCounts.get(ip);
  if (!record) {
    ipRequestCounts.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }
  if (now > record.resetTime) {
    record.count = 1;
    record.resetTime = now + RATE_LIMIT_WINDOW;
    return true;
  }
  if (record.count >= MAX_REQUESTS_PER_WINDOW) return false;
  record.count += 1;
  return true;
};

const processCheckoutSession = async (supabase, session) => {
  console.info('Entering processCheckoutSession');
  const userId = session.metadata?.user_id;
  const productId = session.metadata?.product_id;

  console.info(`Metadata: user_id="${userId}", product_id="${productId}"`);

  if (!userId || !productId) {
    throw new Error(`Missing required metadata: user_id=${userId}, product_id=${productId}`);
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    throw new Error(`Invalid user_id (${userId}): ${userError?.message || 'User not found'}`);
  }

  const productConfig = PRODUCT_MAPPING[productId];
  if (!productConfig) {
    throw new Error(`Unknown product ID: ${productId}`);
  }

  const credits = productConfig.credits;
  const rpcParams = { p_user_id: userId, p_credit_amount: credits };

  console.log(`Calling handle_stripe_purchase_new with: ${JSON.stringify(rpcParams)}`);
  
  try {
    const { data, error: txError } = await supabase.rpc('handle_stripe_purchase_new', rpcParams);
    
    if (txError) {
      console.error(`RPC error: ${JSON.stringify(txError)}`);
      throw new Error(`Transaction failed: ${txError.message || JSON.stringify(txError)}`);
    }
    
    if (!data) {
      console.error(`RPC returned no data`);
      throw new Error('Transaction failed: No response data from database');
    }
    
    console.log(`RPC success: ${JSON.stringify(data)}`);
    return { userId, productId, credits };
  } catch (error) {
    console.error(`Credit transaction error: ${error.message || 'Unknown error'}`);
    throw new Error(`Failed to add credits: ${error.message || 'Unknown database error'}`);
  }
};

const processInvoicePaid = async (supabase, invoice) => {
  const subscriptionId = invoice.subscription;
  const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.user_id;
  const productId = subscription.metadata.product_id;

  console.info(`Processing invoice.paid for subscriptionId="${subscriptionId}"`);

  if (!userId || !productId) {
    throw new Error(`Missing metadata: user_id=${userId}, product_id=${productId}`);
  }

  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  if (userError || !userData) {
    throw new Error(`Invalid user_id (${userId}): ${userError?.message || 'User not found'}`);
  }

  const productConfig = PRODUCT_MAPPING[productId];
  if (!productConfig) {
    throw new Error(`Unknown product ID: ${productId}`);
  }

  const credits = productConfig.credits;
  const rpcParams = { p_user_id: userId, p_credit_amount: credits };

  console.log(`Calling handle_stripe_purchase_new with: ${JSON.stringify(rpcParams)}`);
  
  try {
    const { data, error: txError } = await supabase.rpc('handle_stripe_purchase_new', rpcParams);
    
    if (txError) {
      console.error(`RPC error: ${JSON.stringify(txError)}`);
      throw new Error(`Transaction failed: ${txError.message || JSON.stringify(txError)}`);
    }
    
    if (!data) {
      console.error(`RPC returned no data`);
      throw new Error('Transaction failed: No response data from database');
    }
    
    console.log(`RPC success: ${JSON.stringify(data)}`);
    return { userId, productId, credits };
  } catch (error) {
    console.error(`Credit transaction error: ${error.message || 'Unknown error'}`);
    throw new Error(`Failed to add credits: ${error.message || 'Unknown database error'}`);
  }
};

const handler = async (req) => {
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';

  console.log(`[${requestId}] Request received from ${clientIp}`);

  try {
    if (!checkRateLimit(clientIp)) {
      console.warn(`[${requestId}] Rate limit exceeded for IP: ${clientIp}`);
      return new Response(JSON.stringify({ error: 'Too many requests' }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '60' },
      });
    }

    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const body = await req.text();
    if (!body) throw new Error('Empty request body');

    const sigHeader = req.headers.get('stripe-signature');
    if (!sigHeader) throw new Error('Missing stripe-signature header');

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) throw new Error('STRIPE_WEBHOOK_SECRET not configured');

    const components = sigHeader.split(',');
    const timestamp = components.find(part => part.startsWith('t='))?.replace('t=', '');
    const signature = components.find(part => part.startsWith('v1='))?.replace('v1=', '');

    if (!timestamp || !signature) throw new Error('Invalid signature format');

    if (!verifyWebhookSignature(body, signature, webhookSecret, timestamp)) {
      console.warn(`[${requestId}] Signature verification failed`);
      throw new Error('Invalid signature');
    }

    let event: StripeEvent;
    try {
      event = JSON.parse(body);
      if (!event.type || !event.data || !event.data.object) throw new Error('Malformed event structure');
    } catch (e) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }

    console.log(`[${requestId}] Event verified: ${event.type}`);
    const supabase = getSupabaseClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const result = await processCheckoutSession(supabase, event.data.object);
        console.log(`[${requestId}] Checkout completed for user ${result.userId}, added ${result.credits} credits`);
        break;
      }
      case 'invoice.paid': {
        const result = await processInvoicePaid(supabase, event.data.object);
        console.log(`[${requestId}] Subscription renewed for user ${result.userId}, added ${result.credits} credits`);
        break;
      }
      case 'product.created':
      case 'product.updated': {
        const product = event.data.object;
        console.log(`[${requestId}] Product ${event.type}: ${product.id} (${product.name})`);
        const { error } = await supabase.from('stripe_products').insert({
          id: product.id,
          name: product.name,
          active: product.active,
          description: product.description,
          updated_at: new Date().toISOString(),
        });
        if (error) throw new Error(`Failed to sync product: ${error.message}`);
        break;
      }
      case 'price.created':
      case 'price.updated': {
        const price = event.data.object;
        console.log(`[${requestId}] Price ${event.type}: ${price.id}`);
        const { error } = await supabase.from('stripe_prices').insert({
          id: price.id,
          product_id: price.product,
          active: price.active,
          currency: price.currency,
          unit_amount: price.unit_amount,
          type: price.type,
          recurring_interval: price.recurring?.interval || null,
          updated_at: new Date().toISOString(),
        });
        if (error) throw new Error(`Failed to sync price: ${error.message}`);
        break;
      }
      default:
        console.log(`[${requestId}] Unhandled event type: ${event.type}`);
    }

    const processingTime = Date.now() - startTime;
    console.log(`[${requestId}] Request completed in ${processingTime}ms`);

    return new Response(JSON.stringify({ success: true, message: 'Webhook processed successfully', requestId }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const errorMessage = err.message;
    const processingTime = Date.now() - startTime;
    console.error(`[${requestId}] Error (${processingTime}ms): ${errorMessage}`);
    const publicErrorMessage = errorMessage.includes('Invalid signature') || errorMessage.includes('Missing stripe-signature') 
      ? errorMessage 
      : 'An error occurred processing the webhook';
    return new Response(JSON.stringify({ error: publicErrorMessage, requestId }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

Deno.serve(handler);
