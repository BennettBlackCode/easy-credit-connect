
import { supabase } from "@/integrations/supabase/client";
import { config } from "@/lib/config";

interface AuthCredentials {
  email: string;
  password: string;
}

export const signInWithEmail = async ({ email, password }: AuthCredentials) => {
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
};

export const signUpWithEmail = async ({ email, password }: AuthCredentials) => {
  return await supabase.auth.signUp({
    email,
    password,
  });
};

export const signInWithGoogle = async () => {
  return await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${config.baseUrl}/auth/callback`,
      prompt: 'select_account',
    },
  });
};
