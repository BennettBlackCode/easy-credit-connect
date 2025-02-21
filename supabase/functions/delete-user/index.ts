
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  try {
    // Get the authorization header
    const authorization = req.headers.get('Authorization')
    if (!authorization) {
      throw new Error('No authorization header')
    }

    // Create a Supabase client with the auth header
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authorization },
        },
      }
    )

    // Get the authenticated user
    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser()

    if (userError || !user) {
      throw new Error('Error getting user')
    }

    // Call the delete_user_completely function
    const { error: deleteError } = await supabaseClient
      .rpc('delete_user_completely', {
        _user_id: user.id
      })

    if (deleteError) {
      throw new Error(`Error deleting user data: ${deleteError.message}`)
    }

    // Delete the auth user
    const { error: authDeleteError } = await supabaseClient.auth.admin.deleteUser(
      user.id
    )

    if (authDeleteError) {
      throw new Error(`Error deleting auth user: ${authDeleteError.message}`)
    }

    return new Response(JSON.stringify({ message: 'User deleted successfully' }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
