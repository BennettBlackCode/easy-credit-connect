
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

const stripe = await import("https://esm.sh/stripe@13.6.0?target=deno");
const Stripe = stripe.default;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { 
      headers: {
        ...corsHeaders,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Max-Age': '86400',
      } 
    });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    );

    const signature = req.headers.get("stripe-signature");
    const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

    if (!signature || !webhookSecret) {
      console.error('Missing signature or webhook secret');
      return new Response(
        JSON.stringify({ error: 'Missing required Stripe signature' }), 
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the raw body
    const body = await req.text();
    
    console.log('Received webhook body:', body);
    console.log('Stripe signature:', signature);
    
    const stripeClient = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
      apiVersion: '2023-10-16',
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Verify the webhook signature
    const event = stripeClient.webhooks.constructEvent(body, signature, webhookSecret);
    console.log('Received Stripe webhook event:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('Processing completed checkout session:', session.id);

        // Get line items
        const lineItems = await stripeClient.checkout.sessions.listLineItems(session.id);
        console.log('Line items:', lineItems);

        // Get promotion code if present
        const promotionCode = session.total_details?.breakdown?.discounts?.[0]?.discount?.promotion_code;
        console.log('Promotion code:', promotionCode);

        // Call the handle_stripe_event database function
        const { data, error: dbError } = await supabase.rpc('handle_stripe_event', {
          event: {
            id: event.id,
            type: event.type,
            client_reference_id: session.client_reference_id,
            data: {
              object: {
                ...session,
                line_items: lineItems,
                promotion_code: promotionCode
              }
            }
          }
        });

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }

        console.log('Successfully processed checkout session:', data);
        break;
      }

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log(`Processing subscription ${event.type}:`, subscription.id);

        // Get the customer ID and lookup the user
        const customerId = subscription.customer as string;
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('id')
          .eq('stripe_customer_id', customerId)
          .single();

        if (userError || !userData) {
          console.error('Error finding user:', userError);
          throw new Error(`No user found for customer ${customerId}`);
        }

        // Handle the subscription event
        const { error: dbError } = await supabase.rpc('handle_stripe_event', {
          event: {
            id: event.id,
            type: event.type,
            client_reference_id: userData.id,
            data: {
              object: subscription
            }
          }
        });

        if (dbError) {
          console.error('Database error:', dbError);
          throw dbError;
        }

        console.log('Successfully processed subscription event');
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (err) {
    console.error('Error processing webhook:', err);
    return new Response(
      JSON.stringify({ error: err.message }), 
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: err.statusCode || 400,
      }
    );
  }
});
