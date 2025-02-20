
import { supabase } from "@/integrations/supabase/client";
import { config } from "@/lib/config";

interface AuthCredentials {
  email: string;
  password: string;
}

export const signInWithEmail = async ({ email, password }: AuthCredentials) => {
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
};

export const signUpWithEmail = async ({ email, password }: AuthCredentials) => {
  const { error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${config.baseUrl}/dashboard`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });
  
  if (error) throw error;
  return data;
};
