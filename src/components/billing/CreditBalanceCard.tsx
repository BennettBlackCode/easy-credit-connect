
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CreditBalanceCardProps {
  remainingCredits: number;
  totalCredits: number;
  status?: string;
}

export const CreditBalanceCard = ({ 
  remainingCredits, 
  totalCredits,
  status = "Starter Pack"
}: CreditBalanceCardProps) => {
  return (
    <Card className="mb-8 bg-black/40 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-xl font-normal text-white/90">Credits Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Column - Credits Information */}
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-3xl font-bold text-white">{remainingCredits} runs left</p>
              <p className="text-sm text-gray-400">
                Total Credits Purchased: {totalCredits}
              </p>
            </div>
          </div>

          {/* Right Column - Plan Information */}
          <div className="space-y-2">
            <div className="space-y-1">
              <p className="text-sm text-gray-400">Current Plan</p>
              <p className="text-2xl font-bold bg-gradient-to-r from-[#2ed573] to-[#1ab759] bg-clip-text text-transparent">
                {status}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
