
import { Card, CardContent } from "@/components/ui/card";

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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Credits Balance Card */}
      <Card className="bg-black/40 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Available Credits</p>
            <p className="text-4xl font-bold text-white">{remainingCredits}</p>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Card */}
      <Card className="bg-black/40 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Current Plan</p>
            <p className="text-2xl font-bold bg-gradient-to-r from-[#2ed573] to-[#1ab759] bg-clip-text text-transparent">
              {status}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
