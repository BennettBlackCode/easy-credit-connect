
import { Card, CardContent } from "@/components/ui/card";

interface StatsCardsProps {
  remainingRuns: number;
  periodRuns: number;
}

const StatsCards = ({ remainingRuns, periodRuns }: StatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="text-sm text-gray-400 mb-2">Available Credits</div>
          <div className="text-3xl font-bold text-white">
            {remainingRuns || 0}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-white/5 border-white/10">
        <CardContent className="p-6">
          <div className="text-sm text-gray-400 mb-2">Runs Used This Month</div>
          <div className="text-3xl font-bold text-white">
            {periodRuns || 0}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatsCards;
