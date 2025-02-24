
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useBillingData = () => {
  const { session } = useAuth();

  const { data: userCredits, isLoading: userLoading } = useQuery({
    queryKey: ["user-credit-summary"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("user_credit_summary")
        .select("available_credits, total_credits")
        .eq("user_id", session.user.id)
        .maybeSingle();

      if (error) throw error;
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
        .select("*, credits_included")
        .eq("is_active", true)
        .order("unit_amount", { ascending: true });

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
