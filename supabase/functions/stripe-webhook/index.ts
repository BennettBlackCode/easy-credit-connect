
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4';

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY')!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
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
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing completed checkout session:', session.id);

        if (!session.client_reference_id) {
          throw new Error('No client_reference_id found in session');
        }

        // Get the product details from the line items
        const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
        if (!lineItems.data.length) {
          throw new Error('No line items found in session');
        }

        const priceId = lineItems.data[0].price?.id;
        if (!priceId) {
          throw new Error('No price ID found in line items');
        }

        // Get product name from stripe_products table
        const { data: productData, error: productError } = await supabaseClient
          .from('stripe_products')
          .select('name')
          .eq('stripe_price_id', priceId)
          .single();

        if (productError || !productData) {
          console.error('Error fetching product:', productError);
          throw new Error('Product not found for price ID: ' + priceId);
        }

        // Call the database function to handle the purchase
        const { error: purchaseError } = await supabaseClient.rpc(
          'handle_stripe_purchase',
          {
            _user_id: session.client_reference_id,
            _customer_id: session.customer as string,
            _product_name: productData.name,
            _stripe_price_id: priceId,
            _payment_id: session.payment_intent as string,
          }
        );

        if (purchaseError) {
          console.error('Error handling purchase:', purchaseError);
          throw purchaseError;
        }

        console.log('Successfully processed checkout session:', {
          userId: session.client_reference_id,
          productName: productData.name,
          priceId: priceId
        });
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('Processing subscription event:', subscription.id);

        // Get the product details
        const priceId = subscription.items.data[0].price.id;
        const { data: productData, error: productError } = await supabaseClient
          .from('stripe_products')
          .select('name')
          .eq('stripe_price_id', priceId)
          .single();

        if (productError || !productData) {
          console.error('Error fetching product:', productError);
          throw new Error('Product not found for price ID: ' + priceId);
        }

        // Get the user ID from the customer metadata
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        const userId = customer.metadata.supabase_id;

        if (!userId) {
          throw new Error('No Supabase user ID found in customer metadata');
        }

        // Call the database function to handle the subscription
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

        console.log('Successfully processed subscription:', {
          userId: userId,
          productName: productData.name,
          subscriptionId: subscription.id
        });
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
