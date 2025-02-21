
import { useState } from "react";
import { 
  startOfDay, 
  endOfDay,
  startOfWeek,
  endOfWeek,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
  format, 
  getWeek,
} from "date-fns";
import TimeRangeSelector from "./TimeRangeSelector";
import UsageChart from "./UsageChart";
import { useUsageData } from "@/hooks/useUsageData";

export type TimeRange = "day" | "week" | "month" | "year";

const UsageSection = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>(() => {
    const now = new Date();
    return {
      start: startOfDay(now),
      end: endOfDay(now),
    };
  });

  const handleDateChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  const handleTimeRangeChange = (newRange: TimeRange) => {
    const now = new Date();
    let start: Date;
    let end: Date;

    switch (newRange) {
      case "day":
        start = startOfDay(now);
        end = endOfDay(now);
        break;
      case "week":
        start = startOfWeek(now, { weekStartsOn: 1 });
        end = endOfWeek(now, { weekStartsOn: 1 });
        break;
      case "month":
        start = startOfMonth(now);
        end = endOfMonth(now);
        break;
      case "year":
        start = startOfYear(now);
        end = endOfYear(now);
        break;
      default:
        start = startOfDay(now);
        end = endOfDay(now);
    }

    setTimeRange(newRange);
    setDateRange({ start, end });
  };

  const formatDateDisplay = () => {
    const date = dateRange.start;
    switch (timeRange) {
      case "day":
        return format(date, "EEEE, MMMM d, yyyy");
      case "week":
        return `Week ${getWeek(date)} - ${format(date, "MMMM d, yyyy")}`;
      case "month":
        return format(date, "MMMM yyyy");
      case "year":
        return format(date, "yyyy");
      default:
        return "";
    }
  };

  const { data: usageData, isLoading } = useUsageData(timeRange, dateRange);

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-white/90">
          {formatDateDisplay()}
        </h2>
        <TimeRangeSelector
          selectedRange={timeRange}
          onRangeChange={handleTimeRangeChange}
          onDateChange={handleDateChange}
        />
      </div>
      <div className="h-[250px] sm:h-[300px] w-full">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <UsageChart 
            data={usageData || []} 
            timeRange={timeRange}
          />
        )}
      </div>
    </div>
  );
};

export default UsageSection;
