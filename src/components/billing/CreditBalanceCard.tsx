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
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
      {/* Credits Balance Card */}
      <Card className="bg-black/40 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Available Credits</p>
            <p className="text-4xl font-bold text-white">{remainingCredits} runs left</p>
            <p className="text-sm text-gray-400">
              Total Credits Purchased: {totalCredits}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Current Plan Card */}
      <Card className="bg-black/40 backdrop-blur-sm border border-white/10">
        <CardContent className="p-6">
          <div className="space-y-1">
            <p className="text-gray-400 text-sm">Current Plan</p>
            <p className="text-4xl font-bold text-white my-[12px]">
              {status}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>;
};