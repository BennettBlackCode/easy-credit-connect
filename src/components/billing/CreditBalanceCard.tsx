
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
        <CardTitle className="text-lg font-medium text-gray-400">Credits Balance</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">Available Credits</p>
              <p className="text-4xl font-bold">{remainingCredits} runs left</p>
              <p className="text-sm text-gray-400">
                Total Credits Purchased: {totalCredits}
              </p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-gray-400 text-sm">Current Plan</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                {status}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
