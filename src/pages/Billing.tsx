
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useBillingData } from "@/hooks/useBillingData";
import { CreditBalanceCard } from "@/components/billing/CreditBalanceCard";
import { PricingCards } from "@/components/billing/PricingCards";
import { TransactionHistory } from "@/components/billing/TransactionHistory";

const Billing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();
  const { userCredits, transactions, products, isLoading } = useBillingData();

  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/auth");
    }
  }, [session, authLoading, navigate]);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const success = query.get('success');
    const canceled = query.get('canceled');

    if (success) {
      toast({
        title: "Payment successful",
        description: "Your credits have been added to your account.",
      });
      window.history.replaceState({}, '', window.location.pathname);
    } else if (canceled) {
      toast({
        title: "Payment canceled",
        description: "Your payment was canceled.",
        variant: "destructive",
      });
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

  useEffect(() => {
    if (!session?.user?.id) return;

    // Create a real-time subscription for credit transaction changes
    const channel = supabase
      .channel('credit-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'credit_transactions',
          filter: `user_id=eq.${session.user.id}`,
        },
        (payload) => {
          console.log('Credit transaction update:', payload);
          // Invalidate both queries to refresh the data
          queryClient.invalidateQueries({ queryKey: ["user-calculated-credits"] });
          queryClient.invalidateQueries({ queryKey: ["credit_transactions"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient]);

  const handlePurchase = async (productId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { productId, userId: session?.user?.id },
      });

      if (error) {
        console.error('Function error:', error);
        throw error;
      }

      if (data?.url) {
        window.location.href = data.url;
      } else {
        console.error('No URL in response:', data);
        throw new Error('No checkout URL received');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      toast({
        title: "Error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="container py-24">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Billing & Credits</h1>

        <CreditBalanceCard
          remainingCredits={userCredits?.remaining_credits || 0}
          totalCredits={userCredits?.total_credits || 0}
          status={userCredits?.status || "Free Tier"}
        />

        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <PricingCards
          products={products || []}
          onPurchase={handlePurchase}
          currentPlan={userCredits?.status || "Free Tier"}
        />

        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <TransactionHistory transactions={transactions || []} />
      </div>
    </div>
  );
};

export default Billing;
