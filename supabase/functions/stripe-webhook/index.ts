
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@13.6.0?target=deno";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
  httpClient: Stripe.createFetchHttpClient(),
});

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const signature = req.headers.get("stripe-signature");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

  if (!signature || !webhookSecret) {
    return new Response('Missing signature or webhook secret', { 
      status: 400,
      headers: corsHeaders
    });
  }

  try {
    const body = await req.text();
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('Stripe webhook event received:', event.type);

    switch (event.type) {
      // Handle subscription payments
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment successful for invoice:', invoice.id);

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

        const { data: productData, error: productError } = await supabase
          .from('stripe_products')
          .select('name')
          .eq('stripe_price_id', priceId)
          .single();

        if (productError || !productData) {
          console.error('Error fetching product:', productError);
          throw new Error('Product not found for price ID: ' + priceId);
        }

        // Use handle_subscription_purchase for subscription payments
        const { error: subscriptionError } = await supabase.rpc(
          'handle_subscription_purchase',
          {
            user_id: userId,
            product_name: productData.name
          }
        );

        if (subscriptionError) {
          console.error('Error handling subscription:', subscriptionError);
          throw subscriptionError;
        }

        console.log(`Successfully processed subscription payment for user ${userId}`);
        break;
      }

      // Handle one-time purchases
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Checkout session completed:', session.id);

        // Only process if it's a one-time payment (not a subscription)
        if (!session.subscription) {
          if (!session.client_reference_id || !session.customer) {
            throw new Error('Missing client_reference_id or customer');
          }

          const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
          if (!lineItems.data.length) {
            throw new Error('No line items found');
          }

          const priceId = lineItems.data[0].price?.id;
          if (!priceId) {
            throw new Error('No price ID found');
          }

          const { data: productData } = await supabase
            .from('stripe_products')
            .select('name')
            .eq('stripe_price_id', priceId)
            .single();

          if (!productData) {
            throw new Error('Product not found');
          }

          // Handle one-time purchase using handle_stripe_purchase
          const { error: purchaseError } = await supabase.rpc(
            'handle_stripe_purchase',
            {
              _user_id: session.client_reference_id,
              _customer_id: session.customer,
              _product_name: productData.name,
              _stripe_price_id: priceId,
              _payment_id: session.payment_intent as string,
            }
          );

          if (purchaseError) {
            console.error('Error handling purchase:', purchaseError);
            throw purchaseError;
          }

          console.log(`Successfully processed one-time purchase for user ${session.client_reference_id}`);
        } else {
          console.log('Subscription created, waiting for invoice.payment_succeeded');
        }
        break;
      }
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
