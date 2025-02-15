
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowDown, Plus } from "lucide-react";
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
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import AutomationDialog from "@/components/AutomationDialog";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();

  // Redirect to auth page if not logged in
  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/auth");
    }
  }, [session, authLoading, navigate]);

  // Fetch user data including credits
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

  // Fetch transactions for this month
  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["transactions", session?.user?.id],
    queryFn: async () => {
      const now = new Date();
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
      const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString();

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", session?.user?.id)
        .gte("created_at", firstDayOfMonth)
        .lte("created_at", lastDayOfMonth)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  if (authLoading || userLoading || transactionsLoading) {
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

  // Calculate credits used this month
  const creditsUsedThisMonth = transactions?.reduce((acc, t) => acc + (t.amount || 0), 0) || 0;

  return (
    <div className="container py-24">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 mb-8">
          <div className="space-y-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Available Credits
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{userData?.credits || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Use credits to run workflows
                </p>
              </CardContent>
            </Card>
            <Button 
              variant="outline" 
              className="w-full group border-violet-200 hover:border-violet-300 hover:bg-violet-50"
              asChild
            >
              <Link to="/billing">
                <Plus className="mr-2 h-4 w-4 text-violet-600" />
                Buy More Credits
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Credits Used This Month</CardTitle>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {creditsUsedThisMonth}
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <ArrowDown className="h-3 w-3 mr-1" />
                Total credits consumed this month
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Automation Dialog */}
        <div className="mb-8">
          <AutomationDialog />
        </div>

        {/* Recent Transactions Table */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
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
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center">
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

export default Dashboard;
