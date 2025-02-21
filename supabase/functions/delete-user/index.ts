
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4'

serve(async (req) => {
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Call the RPC function to delete user data
    const { error: rpcError } = await supabaseClient.rpc(
      'delete_user_and_allow_email_reuse',
      { _user_id: userId }
    )

    if (rpcError) {
      console.error('Error in delete_user_and_allow_email_reuse:', rpcError)
      throw rpcError
    }

    return new Response(
      JSON.stringify({ message: 'User deleted successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in delete-user function:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to delete user' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
})
