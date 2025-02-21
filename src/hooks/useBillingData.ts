
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useBillingData = () => {
  const { session } = useAuth();

  const { data: userCredits, isLoading: userLoading } = useQuery({
    queryKey: ["user-calculated-credits"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      console.log("Fetching credits for user:", session.user.id); // Debug log
      
      const { data, error } = await supabase
        .from("users_with_calculated_credits")
        .select("*")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) {
        console.error("Error fetching credits:", error); // Debug log
        throw error;
      }
      
      console.log("Fetched credits data:", data); // Debug log
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["credit_transactions", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("stripe_products")
        .select("*, credits_amount")
        .eq("active", true)
        .order("price_amount", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  return {
    userCredits,
    transactions,
    products,
    isLoading: userLoading || transactionsLoading || productsLoading,
  };
};
