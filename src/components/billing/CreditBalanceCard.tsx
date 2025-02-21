
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreditBalanceCardProps {
  remainingCredits: number;
  totalCredits: number;
  status?: string;
}

export const CreditBalanceCard = ({ 
  remainingCredits, 
  totalCredits,
  status = "Free Tier"
}: CreditBalanceCardProps) => {
  return (
    <Card className="mb-8 bg-black/40 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Credits Balance</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <p className="text-4xl font-bold">{remainingCredits} runs left</p>
            <p className="text-sm text-gray-400">
              Total Credits Purchased: {totalCredits}
            </p>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-400">Current Plan</p>
            <p className="text-lg font-medium">{status}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
