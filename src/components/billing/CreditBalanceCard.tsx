
import { CreditCard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface CreditBalanceCardProps {
  remainingCredits: number;
  totalCredits: number;
  onResetCredits: () => void;
}

export const CreditBalanceCard = ({
  remainingCredits,
  totalCredits,
  onResetCredits,
}: CreditBalanceCardProps) => {
  return (
    <Card className="mb-8">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Current Balance</CardTitle>
        <CreditCard className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{remainingCredits || 0} runs</div>
        <div className="text-sm text-muted-foreground space-y-1 mt-2">
          <p>Available Credits: {totalCredits || 0}</p>
          <Button 
            variant="destructive" 
            size="sm" 
            onClick={onResetCredits}
            className="mt-2"
          >
            Reset Credits
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
