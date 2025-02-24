
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CreditBalanceCardProps {
  remainingCredits: number;
  totalCredits: number;
  status: string;
}

export const CreditBalanceCard = ({ remainingCredits, totalCredits, status }: CreditBalanceCardProps) => {
  const progressValue = totalCredits > 0 ? (remainingCredits / totalCredits) * 100 : 0;
  const usedCredits = totalCredits - remainingCredits;

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle>Credit Balance</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-2xl font-bold">{remainingCredits.toLocaleString()} credits</span>
            <span className="text-sm text-muted-foreground">Current Plan: {status}</span>
          </div>
          <Progress value={progressValue} className="h-2" />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Used: {usedCredits.toLocaleString()} credits</span>
            <span>Total: {totalCredits.toLocaleString()} credits</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
