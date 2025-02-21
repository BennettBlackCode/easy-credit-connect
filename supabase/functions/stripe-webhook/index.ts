
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseClient = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

serve(async (req) => {
  const signature = req.headers.get('stripe-signature');
  const webhook_secret = Deno.env.get('STRIPE_WEBHOOK_SECRET');

  if (!signature || !webhook_secret) {
    return new Response('Missing signature or webhook secret', { status: 400 });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhook_secret);
    console.log('Stripe webhook event received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        // Handle one-time purchases
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);

        if (!session.customer) {
          throw new Error('No customer ID in session');
        }

        // Get product details from line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        if (!lineItems.data.length) {
          throw new Error('No line items found in session');
        }

        const priceId = lineItems.data[0].price?.id;
        if (!priceId) {
          throw new Error('No price ID found in line items');
        }

        // Get product name from stripe_products table
        const { data: productData } = await supabaseClient
          .from('stripe_products')
          .select('name')
          .eq('stripe_price_id', priceId)
          .single();

        if (!productData) {
          throw new Error('Product not found');
        }

        // For one-time purchases, use handle_stripe_purchase
        const { error: purchaseError } = await supabaseClient.rpc(
          'handle_stripe_purchase',
          {
            _user_id: session.client_reference_id,
            _customer_id: session.customer,
            _product_name: productData.name,
            _stripe_price_id: priceId,
            _payment_id: session.payment_intent,
          }
        );

        if (purchaseError) {
          console.error('Error handling purchase:', purchaseError);
          throw purchaseError;
        }

        console.log('Successfully processed one-time purchase');
        break;
      }

      case 'invoice.payment_succeeded': {
        // Handle subscription payments
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Invoice payment succeeded:', invoice.id);

        if (!invoice.customer || !invoice.subscription) {
          throw new Error('Missing customer or subscription ID');
        }

        // Get customer metadata
        const customer = await stripe.customers.retrieve(invoice.customer as string);
        const userId = (customer as any).metadata.supabase_id;

        if (!userId) {
          throw new Error('No Supabase user ID found in customer metadata');
        }

        // Get product details
        const priceId = invoice.lines.data[0].price?.id;
        if (!priceId) {
          throw new Error('No price ID found in invoice');
        }

        const { data: productData } = await supabaseClient
          .from('stripe_products')
          .select('name')
          .eq('stripe_price_id', priceId)
          .single();

        if (!productData) {
          throw new Error('Product not found');
        }

        // For subscriptions, use handle_subscription_purchase
        const { error: subscriptionError } = await supabaseClient.rpc(
          'handle_subscription_purchase',
          {
            user_id: userId,
            product_name: productData.name,
          }
        );

        if (subscriptionError) {
          console.error('Error handling subscription:', subscriptionError);
          throw subscriptionError;
        }

        console.log('Successfully processed subscription payment');
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }
});
