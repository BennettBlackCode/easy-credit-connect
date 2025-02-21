
import { useState } from "react";
import { 
  startOfDay, 
  endOfDay, 
  format, 
  getWeek, 
  startOfMonth,
  getDaysInMonth,
  addDays,
} from "date-fns";
import TimeRangeSelector from "./TimeRangeSelector";
import UsageChart from "./UsageChart";

export type TimeRange = "day" | "week" | "month" | "year";

const UsageSection = () => {
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  });

  const handleDateChange = (start: Date, end: Date) => {
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

  const generateChartData = () => {
    switch (timeRange) {
      case "day":
        return Array.from({ length: 24 }, (_, i) => {
          const date = new Date(dateRange.start);
          date.setHours(i);
          return {
            date: date.toISOString(),
            runs: Math.floor(Math.random() * 5),
          };
        });
      case "week":
        return Array.from({ length: 7 }, (_, i) => {
          const date = new Date(dateRange.start);
          date.setDate(date.getDate() + i);
          return {
            date: date.toISOString(),
            runs: Math.floor(Math.random() * 10),
          };
        });
      case "month": {
        const monthStart = startOfMonth(dateRange.start);
        const daysInMonth = getDaysInMonth(monthStart);
        
        return Array.from({ length: daysInMonth }, (_, i) => {
          const date = addDays(monthStart, i);
          return {
            date: date.toISOString(),
            runs: Math.floor(Math.random() * 15),
          };
        });
      }
      case "year":
        return Array.from({ length: 12 }, (_, i) => {
          const date = new Date(dateRange.start);
          date.setMonth(i);
          return {
            date: date.toISOString(),
            runs: Math.floor(Math.random() * 50),
          };
        });
    }
  };

  const chartData = generateChartData();

  return (
    <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-lg sm:text-xl font-medium text-white/90">
          {formatDateDisplay()}
        </h2>
        <TimeRangeSelector
          selectedRange={timeRange}
          onRangeChange={setTimeRange}
          onDateChange={handleDateChange}
        />
      </div>
      <div className="h-[250px] sm:h-[300px] w-full">
        <UsageChart 
          data={chartData} 
          timeRange={timeRange}
        />
      </div>
    </div>
  );
};

export default UsageSection;
