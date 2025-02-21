
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowUpRight } from "lucide-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const Billing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { session, isLoading: authLoading } = useAuth();
  const queryClient = useQueryClient();

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

  // Set up real-time subscription for credit updates
  useEffect(() => {
    if (!session?.user?.id) return;

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
        () => {
          // Invalidate queries to refresh data
          queryClient.invalidateQueries({ queryKey: ["user-calculated-credits"] });
          queryClient.invalidateQueries({ queryKey: ["credit_transactions"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [session?.user?.id, queryClient]);

  const { data: userCredits, isLoading: userLoading } = useQuery({
    queryKey: ["user-calculated-credits"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("users_with_calculated_credits")
        .select("remaining_credits, total_credits")
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
        .select("*")
        .eq("active", true)
        .order("price_amount", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const resetCredits = async () => {
    if (!session?.user?.id) return;
    
    try {
      const { error } = await supabase.rpc('reset_user_credits', {
        target_user_id: session.user.id
      });

      if (error) throw error;

      toast({
        title: "Credits reset",
        description: "Your credits have been reset to 0.",
      });

      // Invalidate queries to refresh data
      queryClient.invalidateQueries({ queryKey: ["user-calculated-credits"] });
      queryClient.invalidateQueries({ queryKey: ["credit_transactions"] });
    } catch (error) {
      console.error('Error resetting credits:', error);
      toast({
        title: "Error",
        description: "Failed to reset credits. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  if (authLoading || userLoading || transactionsLoading || productsLoading) {
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

        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCredits?.remaining_credits || 0} runs</div>
            <div className="text-sm text-muted-foreground space-y-1 mt-2">
              <p>Available Credits: {userCredits?.total_credits || 0}</p>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={resetCredits}
                className="mt-2"
              >
                Reset Credits
              </Button>
            </div>
          </CardContent>
        </Card>

        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {products && products.map((product) => (
            <Card key={product.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{product.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-sm text-muted-foreground mb-4">
                  {product.description}
                </p>
                <div className="text-2xl font-bold mb-4">
                  ${(product.price_amount / 100).toFixed(2)}
                </div>
                <div className="mt-auto">
                  <Button 
                    className="w-full"
                    onClick={() => handlePurchase(product.id)}
                  >
                    Purchase
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {/* Manually added Unlimited plan */}
          <Card className="flex flex-col">
            <CardHeader>
              <CardTitle>Unlimited</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1">
              <p className="text-sm text-muted-foreground mb-4">
                Unlimited runs, dedicated support, and custom integrations for enterprise needs
              </p>
              <div className="text-2xl font-bold mb-4">
                Contact Us
              </div>
              <div className="mt-auto">
                <Button asChild className="w-full">
                  <a
                    href="https://boldslate.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center"
                  >
                    Contact Us
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions && transactions.length > 0 ? (
                  transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.transaction_type}</TableCell>
                      <TableCell>{transaction.credit_amount}</TableCell>
                      <TableCell>{transaction.status}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No transactions yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Billing;

