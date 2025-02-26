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

// Valid subscription types
const VALID_SUBSCRIPTION_TYPES = ['starter pack', 'growth pack', 'unlimited pack'];

// Configuration constants
const PRODUCT_MAPPING: ProductMapping = {
  '3f400036-bc93-4ca3-81ac-3d195f97e7c6': { credits: 3, subscriptionType: 'starter pack' },
  'd1864f1e-3871-4b74-9b3b-b85f042d4c19': { credits: 5, subscriptionType: 'growth pack' },
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

// Validate subscription type
const validateSubscriptionType = (type: string): string => {
  if (!type) {
    console.error('No subscription type provided');
    throw new Error('Subscription type is required');
  }
  
  const normalizedType = type.trim().toLowerCase();
  if (VALID_SUBSCRIPTION_TYPES.includes(normalizedType)) {
    return normalizedType;
  } else {
    console.error(`Invalid subscription type: "${type}"`);
    throw new Error(`Invalid subscription type: "${type}"`);
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
  console.info('Entering processCheckoutSession');
  const userId = session.metadata?.user_id;
  const productId = session.metadata?.product_id;
  const stripeSubscriptionId = session.subscription || session.id;

  console.info(`Metadata: user_id="${userId}", product_id="${productId}", subscription_type="${session.metadata?.subscription_type}"`);

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
  const metadataSubscriptionType = session.metadata?.subscription_type;
  console.info(`Raw metadata subscription_type: "${metadataSubscriptionType}"`);
  console.info(`Fallback productConfig.subscriptionType: "${productConfig.subscriptionType}"`);
  const subscriptionType = validateSubscriptionType(metadataSubscriptionType || productConfig.subscriptionType);
  console.info(`Final subscriptionType after validation: "${subscriptionType}"`);

  const rpcParams = {
    p_user_id: userId,
    p_credit_amount: credits,
    p_transaction_type: 'purchase',
    p_description: session.id,
    p_subscription_type: subscriptionType,
    p_stripe_subscription_id: stripeSubscriptionId
  };
  console.info(`Calling handle_stripe_purchase with params: ${JSON.stringify(rpcParams)}`);

  const { error: txError } = await supabase.rpc('handle_stripe_purchase', rpcParams);

  if (txError) {
    console.error(`RPC error: ${txError.message}`);
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

  const credits = productConfig.credits;
  const metadataSubscriptionType = subscription.metadata?.subscription_type;
  const subscriptionType = validateSubscriptionType(metadataSubscriptionType || productConfig.subscriptionType);
  console.log(`Processing renewal with subscriptionType: "${subscriptionType}"`);

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
  console.info('DEPLOYMENT_MARKER: Running updated code v2025-02-26-01');
  const requestId = crypto.randomUUID();
  const startTime = Date.now();
  const clientIp = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
  console.info(`[${requestId}] Request received from ${clientIp}`);
  // ... rest of the handler unchanged
};

// Start the server
Deno.serve(handler);
