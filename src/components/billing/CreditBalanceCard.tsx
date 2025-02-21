
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreditBalanceCardProps {
  remainingCredits: number;
  totalCredits: number;
}

export const CreditBalanceCard = ({
  remainingCredits,
  totalCredits,
}: CreditBalanceCardProps) => {
  const runsText = remainingCredits === 1 ? "run left" : "runs left";

  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Credits Balance</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{remainingCredits || 0} {runsText}</div>
        <div className="text-sm text-muted-foreground space-y-1 mt-2">
          <p>Total Credits Purchased: {totalCredits || 0}</p>
        </div>
      </CardContent>
    </Card>
  );
};
