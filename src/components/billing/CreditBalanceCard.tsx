
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface CreditBalanceCardProps {
  remainingCredits: number;
  totalCredits: number;
}

export const CreditBalanceCard = ({
  remainingCredits,
  totalCredits,
}: CreditBalanceCardProps) => {
  const { session } = useAuth();
  const runsText = remainingCredits === 1 ? "run left" : "runs left";

  const { data: totalPurchasedCredits } = useQuery({
    queryKey: ["total-purchased-credits", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return 0;
      const { data, error } = await supabase
        .from("credit_transactions")
        .select("credit_amount")
        .eq("user_id", session.user.id)
        .gt("credit_amount", 0); // Only get positive transactions (purchases)

      if (error) throw error;
      return data.reduce((sum, transaction) => sum + transaction.credit_amount, 0);
    },
    enabled: !!session?.user?.id,
  });

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Credits Balance</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{remainingCredits || 0} {runsText}</div>
        <div className="text-sm text-muted-foreground space-y-1 mt-2">
          <p>Total Credits Purchased: {totalPurchasedCredits || 0}</p>
        </div>
      </CardContent>
    </Card>
  );
};
