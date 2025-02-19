
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

type TimeRange = "day" | "week" | "month" | "year";

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  onNavigate: (direction: "prev" | "next") => void;
}

const TimeRangeSelector = ({
  selectedRange,
  onRangeChange,
  onNavigate,
}: TimeRangeSelectorProps) => {
  const ranges: TimeRange[] = ["day", "week", "month", "year"];

  return (
    <div className="flex items-center space-x-4">
      <div className="flex bg-white/5 rounded-lg p-1">
        {ranges.map((range) => (
          <Button
            key={range}
            onClick={() => onRangeChange(range)}
            variant="ghost"
            className={cn(
              "px-4 py-2 text-sm capitalize",
              selectedRange === range && "bg-white/10"
            )}
          >
            {range}
          </Button>
        ))}
      </div>
      <div className="flex items-center space-x-2 bg-white/5 rounded-lg p-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("prev")}
          className="h-9 w-9"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
          <Calendar className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onNavigate("next")}
          className="h-9 w-9"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimeRangeSelector;
