
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
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('Payment successful for invoice:', invoice.id);

        if (!invoice.customer || !invoice.subscription) {
          throw new Error('Missing customer or subscription ID');
        }

        // Retrieve customer metadata from Stripe
        const customer = await stripe.customers.retrieve(invoice.customer as string);
        const userId = (customer as any).metadata.supabase_id;

        if (!userId) {
          throw new Error('No Supabase user ID found in customer metadata');
        }

        // Get the product details
        const priceId = invoice.lines.data[0].price?.id;
        if (!priceId) {
          throw new Error('No price ID found in invoice');
        }

        const { data: productData, error: productError } = await supabaseClient
          .from('stripe_products')
          .select('name, credits')
          .eq('stripe_price_id', priceId)
          .single();

        if (productError || !productData) {
          console.error('Error fetching product:', productError);
          throw new Error('Product not found for price ID: ' + priceId);
        }

        // Add credits to user in Supabase
        const { error: creditError } = await supabaseClient.rpc(
          'increment_credits',
          {
            uid: userId,
            amount: productData.credits,
          }
        );

        if (creditError) {
          console.error('Error adding credits:', creditError);
          throw creditError;
        }

        console.log(`Credits added to user ${userId}: ${productData.credits}`);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        console.log('Subscription event received:', event.type);
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
