
import { supabase } from "@/integrations/supabase/client";

export const handleAuthRedirect = async () => {
  try {
    // Check if we have a hash in the URL
    if (window.location.hash) {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;
      
      // Clear the hash without triggering a reload
      window.history.replaceState(null, '', window.location.pathname);
      
      return data.session;
    }
    return null;
  } catch (error) {
    console.error('Error handling auth redirect:', error);
    return null;
  }
};
