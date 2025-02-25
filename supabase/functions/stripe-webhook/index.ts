
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';
import { createHmac } from 'https://deno.land/std@0.177.0/node/crypto.ts';

// Supabase client factory
const getSupabaseClient = () => {
  return createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  );
};

// Function to verify webhook signature
const verifyWebhookSignature = (payload: string, signature: string, secret: string, timestamp: string) => {
  const signedPayload = `${timestamp}.${payload}`;
  const expectedSig = createHmac('sha256', secret)
    .update(signedPayload)
    .digest('hex');
  return signature === expectedSig;
};

// Handler function
const handler = async (req: Request): Promise<Response> => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Read request body and signature
    const body = await req.text();
    const sigHeader = req.headers.get('stripe-signature');
    console.log('Webhook received', {
      bodyLength: body.length,
      signature: sigHeader ? 'present' : 'missing',
    });

    if (!sigHeader) {
      throw new Error('Missing stripe-signature header');
    }

    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET');
    if (!webhookSecret) {
      throw new Error('STRIPE_WEBHOOK_SECRET not configured');
    }

    // Parse signature header (assuming single signature for simplicity)
    const [tsPart, sigPart] = sigHeader.split(',');
    const timestamp = tsPart.replace('t=', '');
    const signature = sigPart.replace('v1=', '');

    // Verify signature
    if (!verifyWebhookSignature(body, signature, webhookSecret, timestamp)) {
      throw new Error('Invalid signature');
    }

    // Parse event
    const event = JSON.parse(body);
    console.log('Event verified:', event.type);

    const supabase = getSupabaseClient();

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata?.user_id;
        const productId = session.metadata?.product_id;
        if (!userId || !productId) {
          console.error('Missing metadata:', { userId, productId });
          throw new Error('Missing user_id or product_id in session metadata');
        }

        const { data: product, error: productError } = await supabase
          .from('stripe_products')
          .select('name')
          .eq('id', productId)
          .single();

        if (productError || !product) {
          console.error('Product fetch error:', productError?.message);
          throw new Error(`Product not found: ${productError?.message || 'No data'}`);
        }

        const creditsToAdd = product.name === 'Growth Pack' ? 100 : product.name === 'Starter Pack' ? 50 : 0;
        console.log('Processing checkout.session.completed:', { userId, productId, creditsToAdd });

        const { error: txError } = await supabase
          .from('credit_transactions')
          .insert({
            user_id: userId,
            credit_amount: creditsToAdd,
            transaction_type: 'purchase',
            description: `Bought ${product.name}`,
            created_at: new Date().toISOString(),
          });

        if (txError) {
          console.error('Credit transaction error:', txError.message);
          throw new Error(`Failed to add credits: ${txError.message}`);
        }

        const { error: updateError } = await supabase
          .from('users')
          .update({ subscription_type: product.name.toLowerCase() })
          .eq('id', userId);

        if (updateError) {
          console.error('User update error:', updateError.message);
          throw new Error(`Failed to update subscription: ${updateError.message}`);
        }

        console.log('Checkout session completed successfully for user:', userId);
        break;
      }
      case 'product.created':
      case 'product.updated': {
        const product = event.data.object;
        const { error } = await supabase
          .from('stripe_products')
          .upsert({
            id: product.id,
            name: product.name,
            active: product.active,
            description: product.description,
            updated_at: new Date().toISOString(),
          });
        if (error) {
          console.error(`Product sync error (${event.type}):`, error.message);
          throw new Error(`Failed to sync product: ${error.message}`);
        }
        console.log(`Product ${event.type}:`, product.id);
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
          });
        if (error) {
          console.error(`Price sync error (${event.type}):`, error.message);
          throw new Error(`Failed to sync price: ${error.message}`);
        }
        console.log(`Price ${event.type}:`, price.id);
        break;
      }
      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ message: 'Webhook processed successfully' }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Webhook handler error:', (err as Error).message);
    return new Response(JSON.stringify({ error: (err as Error).message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};

// Serve with Deno.serve
Deno.serve(handler);
