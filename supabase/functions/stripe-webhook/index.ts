
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'
import { stripe } from './stripe'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature) {
      return new Response('No signature', { status: 400 })
    }

    const body = await req.text()
    const webhookSecret = Deno.env.get('STRIPE_WEBHOOK_SECRET')
    if (!webhookSecret) {
      return new Response('No webhook secret', { status: 400 })
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    )

    console.log('Processing webhook event:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const userId = session.client_reference_id
        const priceId = session.line_items?.data[0]?.price.id

        if (!userId || !priceId) {
          console.error('Missing userId or priceId in session:', session)
          return new Response('Missing data in session', { status: 400 })
        }

        // Get product details from stripe_products table
        const { data: productData, error: productError } = await supabaseAdmin
          .from('stripe_products')
          .select('*')
          .eq('price_id', priceId)
          .single()

        if (productError || !productData) {
          console.error('Error fetching product:', productError)
          return new Response('Product not found', { status: 404 })
        }

        // Create transaction record
        const { error: transactionError } = await supabaseAdmin
          .from('transactions')
          .insert({
            user_id: userId,
            amount: productData.credits,
            type: 'purchase',
            status: 'completed',
            stripe_payment_id: session.id,
            stripe_price_id: priceId,
            credit_type: 'permanent'
          })

        if (transactionError) {
          console.error('Error creating transaction:', transactionError)
          return new Response('Error creating transaction', { status: 500 })
        }

        // Update user credits using the increment_user_credits function
        const { error: creditError } = await supabaseAdmin.rpc(
          'increment_user_credits',
          {
            user_id: userId,
            amount: productData.credits,
            credit_type: 'permanent'
          }
        )

        if (creditError) {
          console.error('Error updating credits:', creditError)
          return new Response('Error updating credits', { status: 500 })
        }

        break
      }

      default:
        console.log('Unhandled event type:', event.type)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('Error processing webhook:', err)
    return new Response(
      JSON.stringify({ error: { message: err.message } }),
      { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
