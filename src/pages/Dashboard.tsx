
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard, ArrowDown, Plus, Activity } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
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
      <div className="min-h-screen bg-[#030303] pt-24">
        <div className="container max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  // Calculate total available credits
  const totalCredits = (userData?.credits || 0);

  return (
    <div className="min-h-screen bg-[#030303] pt-24">
      <div className="container max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent mb-2">
              Dashboard
            </h1>
            <p className="text-gray-400">
              Monitor your automation performance and credit usage
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <Card className="bg-black/40 backdrop-blur-xl border-white/5">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-400">
                      Available Credits
                    </h3>
                    <CreditCard className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                      {totalCredits}
                    </div>
                    <p className="text-sm text-gray-500">
                      Use credits to run workflows
                    </p>
                  </div>
                </div>
              </Card>

              <Button 
                variant="outline" 
                className="w-full group border-primary/20 hover:border-primary/30 hover:bg-primary/5 text-primary"
                asChild
              >
                <Link to="/billing">
                  <Plus className="mr-2 h-4 w-4" />
                  Buy More Credits
                </Link>
              </Button>
            </div>

            <Card className="bg-black/40 backdrop-blur-xl border-white/5">
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-400">
                    Credits Used This Month
                  </h3>
                  <Activity className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <div className="text-3xl font-bold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">
                    {0}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <ArrowDown className="h-3 w-3 mr-1" />
                    Total credits consumed this month
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Automation Dialog */}
          <div className="mb-8">
            <AutomationDialog />
          </div>

          {/* Recent Transactions Table */}
          <Card className="bg-black/40 backdrop-blur-xl border-white/5">
            <div className="p-6">
              <h3 className="text-lg font-semibold bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent mb-4">
                Recent Transactions
              </h3>
              <div className="rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/5 hover:bg-white/5">
                      <TableHead className="text-gray-400">Date</TableHead>
                      <TableHead className="text-gray-400">Type</TableHead>
                      <TableHead className="text-gray-400">Amount</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {transactions && transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <TableRow 
                          key={transaction.id}
                          className="border-white/5 hover:bg-white/5"
                        >
                          <TableCell className="text-gray-300">
                            {new Date(transaction.created_at).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {transaction.type}
                          </TableCell>
                          <TableCell className="text-gray-300">
                            {transaction.amount}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow className="border-white/5">
                        <TableCell 
                          colSpan={3} 
                          className="text-center text-gray-500 py-8"
                        >
                          No transactions yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
