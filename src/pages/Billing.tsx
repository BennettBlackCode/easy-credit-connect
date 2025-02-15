
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
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

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/auth");
    }
  }, [session, authLoading, navigate]);

  // Check URL parameters for Stripe status
  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const success = query.get('success');
    const canceled = query.get('canceled');

    if (success) {
      toast({
        title: "Payment successful",
        description: "Your credits have been added to your account.",
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (canceled) {
      toast({
        title: "Payment canceled",
        description: "Your payment was canceled.",
        variant: "destructive",
      });
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

  // Fetch user data including credits and stripe customer id
  const { data: userData, isLoading: userLoading } = useQuery({
    queryKey: ["user", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch recent transactions
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Fetch available products/plans
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

  const handlePurchase = async (productId: string) => {
    try {
      const { data, error } = await supabase.functions.invoke('create-checkout', {
        body: { productId, userId: session?.user?.id },
      });

      if (error) throw error;
      if (data.url) {
        window.location.href = data.url;
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

        {/* Current Balance */}
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userData?.credits || 0} runs</div>
          </CardContent>
        </Card>

        {/* Available Plans */}
        <h2 className="text-xl font-semibold mb-4">Available Plans</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mb-8">
          {products?.map((product) => {
            // Skip annual plans
            if (product.name.toLowerCase().includes('annual')) {
              return null;
            }

            // Define the display order
            const displayOrder = {
              'starter': 1,
              'growth': 2,
              'professional': 3
            };

            // Sort products based on the display order
            const sortedProducts = [...(products || [])].sort((a, b) => {
              const aOrder = displayOrder[a.name.toLowerCase().split(' ')[0]] || 999;
              const bOrder = displayOrder[b.name.toLowerCase().split(' ')[0]] || 999;
              return aOrder - bOrder;
            });

            // Adjust display for the unlimited plan
            const isUnlimited = product.name.toLowerCase().includes('professional');
            const displayName = isUnlimited ? "Unlimited" : product.name;
            const displayPrice = isUnlimited ? "Custom" : `$${(product.price_amount / 100).toFixed(2)}`;
            const displayButton = isUnlimited ? "Contact Us" : "Purchase";

            return (
              <Card key={product.id}>
                <CardHeader>
                  <CardTitle>{displayName}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {product.description}
                  </p>
                  <div className="text-2xl font-bold mb-4">
                    {displayPrice}
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">
                    {isUnlimited ? "Unlimited runs" : `${product.credits} ${product.credits === 1 ? 'run' : 'runs'}`}
                  </p>
                  {isUnlimited ? (
                    <Button asChild className="w-full">
                      <a
                        href="https://boldslate.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center"
                      >
                        {displayButton}
                        <ArrowUpRight className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  ) : (
                    <Button 
                      className="w-full"
                      onClick={() => handlePurchase(product.id)}
                    >
                      {displayButton}
                      <ArrowUpRight className="ml-2 h-4 w-4" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Transaction History */}
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
                      <TableCell>{transaction.type}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
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
