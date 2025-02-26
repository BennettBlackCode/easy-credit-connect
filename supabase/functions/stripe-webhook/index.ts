import { createClient } from '@supabase/supabase-js';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';
import * as stripe from 'https://esm.sh/stripe';

// Type definitions
type StripeEvent = {
  type: string;
  data: {
    object: any;
  };
};

type ProductMapping = {
  [productId: string]: {
    credits: number;
    subscriptionType: string;
  };
};

// Valid subscription types from your enum
const VALID_SUBSCRIPTION_TYPES = ['free', 'starter', 'growth', 'unlimited', 'owner'];

// Configuration constants
const PRODUCT_MAPPING: ProductMapping = {
  '3f400036-bc93-4ca3-81ac-3d195f97e7c6': { credits: 3, subscriptionType: 'starter' },
  'd1864f1e-3871-4b74-9b3b-b85f042d4c19': { credits: 5, subscriptionType: 'growth' },
  // Add more product IDs as needed
};

const stripeClient = stripe.Stripe(Deno.env.get('STRIPE_SECRET_KEY'));

// Rate limiting setup
const RATE_LIMIT_WINDOW = 60000; // 1 minute in milliseconds
const MAX_REQUESTS_PER_WINDOW = 30;
const ipRequestCounts = new Map<string, { count: number; resetTime: number }>();

// Supabase client factory
let supabaseClient: any = null;
const getSupabaseClient = () => {
  if (!supabaseClient) {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase credentials in environment variables');
    }
    supabaseClient = createClient(supabaseUrl, supabaseServiceKey);
  }
  return supabaseClient;
};

// Verify webhook signature
const verifyWebhookSignature = (payload: string, signature: string, secret: string, timestamp: string) => {
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = createHmac('sha256', secret).update(signedPayload).digest('hex');
  let result = 0;
  for (let i = 0; i < expectedSig.length; i++) {
    result |= expectedSig.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return result === 0;
};

// Map subscription type to valid enum values
const mapSubscriptionType = (type: string): string => {
  if (!type) return 'free';
  
  // Remove " pack" suffix and trim any whitespace
  const cleanedType = type.replace(/\s*pack$/i, '').trim().toLowerCase();
  
  // Check if the cleaned type is valid
  if (VALID_SUBSCRIPTION_TYPES.includes(cleanedType)) {
    return cleanedType;
  }
  
  // Handle specific mappings
  switch (cleanedType) {
    case 'starter': return 'starter';
    case 'growth': return 'growth';
    case 'unlimited': return 'unlimited';
    default: return 'free';
  }
};

// Rate limiting
const checkRateLimit = (ip: string): boolean => {
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
  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }
  record.count += 1;
  return true;
};

// Process checkout session
const processCheckoutSession = async (supabase: any, session: any) => {
  const userId = session.metadata?.user_id;
  const productId = session.metadata?.product_id;
  const stripeSubscriptionId = session.subscription || session.id;

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

  let { credits } = productConfig;
  const metadataSubscriptionType = session.metadata?.subscription_type;
  
  // Convert the subscription type to a valid enum value
  let subscriptionType = productConfig.subscriptionType;
  if (metadataSubscriptionType) {
    // Log for debugging
    console.log(`Original subscription_type from metadata: "${metadataSubscriptionType}"`);
    
    // Map to valid enum value
    subscriptionType = mapSubscriptionType(metadataSubscriptionType);
    console.log(`Mapped to: "${subscriptionType}"`);
  }

  const { error: txError } = await supabase.rpc('handle_stripe_purchase', {
    p_user_id: userId,
    p_credit_amount: credits,
    p_transaction_type: 'purchase',
    p_description: session.id,
    p_subscription_type: subscriptionType,
    p_stripe_subscription_id: stripeSubscriptionId
  });

  if (txError) {
    throw new Error(`Transaction failed: ${txError.message}`);
  }

  return { userId, productId, credits, subscriptionType };
};

// Process invoice.paid for renewals
const processInvoicePaid = async (supabase: any, invoice: any) => {
  const subscriptionId = invoice.subscription;
  const subscription = await stripeClient.subscriptions.retrieve(subscriptionId);
  const userId = subscription.metadata.user_id;
  const productId = subscription.metadata.product_id;

  if (!userId || !productId) {
    throw new Error(`Missing metadata in subscription: user_id=${userId}, product_id=${productId}`);
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

  let { credits } = productConfig;
  const metadataSubscriptionType = subscription.metadata?.subscription_type;
  
  // Convert the subscription type to a valid enum value
  let subscriptionType = productConfig.subscriptionType;
  if (metadataSubscriptionType) {
    // Log for debugging
    console.log(`Original subscription_type from metadata: "${metadataSubscriptionType}"`);
    
    // Map to valid enum value
    subscriptionType = mapSubscriptionType(metadataSubscriptionType);
    console.log(`Mapped to: "${subscriptionType}"`);
  }

  const { error: txError } = await supabase.rpc('handle_stripe_purchase', {
    p_user_id: userId,
    p_credit_amount: credits,
    p_transaction_type: 'subscription_renewal',
    p_description: subscriptionId,
    p_subscription_type: subscriptionType,
    p_stripe_subscription_id: subscriptionId
  });

  if (txError) {
    throw new Error(`Renewal transaction failed: ${txError.message}`);
  }

  return { userId, productId, credits, subscriptionType };
};

// Main handler
const handler = async (req: Request): Promise<Response> => {
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
    if (!body) {
      throw new Error('Empty request body');
    }
    
    const sigHeader = req.headers.get('stripe-signature');
    if (!sigHeader) {
      throw new Error('Missing stripe-signature header');
    }
    
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }
    
    const components = sigHeader.split(',');
    const timestampComponent = components.find(part => part.startsWith('t='));
    const signatureComponent = components.find(part => part.startsWith('v1='));
    
    if (!timestampComponent || !signatureComponent) {
      throw new Error('Invalid signature format');
    }
    
    const timestamp = timestampComponent.replace('t=', '');
    const signature = signatureComponent.replace('v1=', '');
    
    if (!verifyWebhookSignature(body, signature, webhookSecret, timestamp)) {
      console.warn(`[${requestId}] Signature verification failed`);
      throw new Error('Invalid signature');
    }
    
    let event: StripeEvent;
    try {
      event = JSON.parse(body);
      if (!event.type || !event.data || !event.data.object) {
        throw new Error('Malformed event structure');
      }
    } catch (e) {
      throw new Error(`Invalid JSON: ${e.message}`);
    }
    
    console.log(`[${requestId}] Event verified: ${event.type}`);
    
    const supabase = getSupabaseClient();
    
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const result = await processCheckoutSession(supabase, session);
        console.log(`[${requestId}] Checkout completed for user ${result.userId}, added ${result.credits} credits`);
        break;
      }
      case 'invoice.paid': {
        const invoice = event.data.object;
        const result = await processInvoicePaid(supabase, invoice);
        console.log(`[${requestId}] Subscription renewed for user ${result.userId}, added ${result.credits} credits`);
        break;
      }
      case 'product.created':
      case 'product.updated': {
        const product = event.data.object;
        console.log(`[${requestId}] Product ${event.type}: ${product.id} (${product.name})`);
        const { error } = await supabase
          .from('stripe_products')
          .upsert({
            id: product.id,
            name: product.name,
            active: product.active,
            description: product.description,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        if (error) throw new Error(`Failed to sync product: ${error.message}`);
        break;
      }
      case 'price.created':
      case 'price.updated': {
        const price = event.data.object;
        const { error } = await supabase
          .from('stripe_prices')
          .upsert({
            id: price.id,
            product_id: price.product,
            active: price.active,
            currency: price.currency,
            unit_amount: price.unit_amount,
            type: price.type,
            recurring_interval: price.recurring?.interval || null,
            updated_at: new Date().toISOString(),
          }, { onConflict: 'id' });
        if (error) throw new Error(`Failed to sync price: ${error.message}`);
        console.log(`[${requestId}] Price ${event.type}: ${price.id}`);
        break;
      }
      default:
        console.log(`[${requestId}] Unhandled event type: ${event.type}`);
    }
    
    const processingTime = Date.now() - startTime;
    console.log(`[${requestId}] Request completed in ${processingTime}ms`);
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Webhook processed successfully',
      requestId 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    const errorMessage = (err as Error).message;
    const processingTime = Date.now() - startTime;
    console.error(`[${requestId}] Error (${processingTime}ms): ${errorMessage}`);
    const publicErrorMessage = errorMessage.includes('Invalid signature') || 
                               errorMessage.includes('Missing stripe-signature') ?
                               errorMessage : 'An error occurred processing the webhook';
    return new Response(JSON.stringify({ 
      error: publicErrorMessage,
      requestId 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Start the server
Deno.serve(handler);
