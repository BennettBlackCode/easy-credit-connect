
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, CalendarClock } from "lucide-react";
import { cn } from "@/lib/utils";
import { 
  format, 
  startOfToday, 
  endOfToday, 
  startOfWeek, 
  endOfWeek, 
  startOfMonth, 
  endOfMonth, 
  startOfYear, 
  endOfYear,
  startOfDay,
  endOfDay,
  isToday
} from "date-fns";

type TimeRange = "day" | "week" | "month" | "year";

interface TimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
  onDateChange: (start: Date, end: Date) => void;
}

const TimeRangeSelector = ({
  selectedRange,
  onRangeChange,
  onDateChange,
}: TimeRangeSelectorProps) => {
  const ranges: TimeRange[] = ["day", "week", "month", "year"];
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [isCustomDate, setIsCustomDate] = useState(false);

  useEffect(() => {
    setIsCustomDate(!isToday(selectedDate));
  }, [selectedDate]);

  const handleRangeChange = (range: TimeRange) => {
    onRangeChange(range);
    updateDateRange(range, selectedDate);
  };

  const updateDateRange = (range: TimeRange, date: Date) => {
    switch (range) {
      case "day":
        onDateChange(startOfDay(date), endOfDay(date));
        break;
      case "week":
        onDateChange(startOfWeek(date), endOfWeek(date));
        break;
      case "month":
        onDateChange(startOfMonth(date), endOfMonth(date));
        break;
      case "year":
        onDateChange(startOfYear(date), endOfYear(date));
        break;
    }
  };

  const handleNavigate = (direction: "prev" | "next") => {
    const newDate = new Date(selectedDate);
    switch (selectedRange) {
      case "day":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 1 : -1));
        break;
      case "week":
        newDate.setDate(newDate.getDate() + (direction === "next" ? 7 : -7));
        break;
      case "month":
        newDate.setMonth(newDate.getMonth() + (direction === "next" ? 1 : -1));
        break;
      case "year":
        newDate.setFullYear(newDate.getFullYear() + (direction === "next" ? 1 : -1));
        break;
    }
    setSelectedDate(newDate);
    updateDateRange(selectedRange, newDate);
  };

  const handleCalendarSelect = (date: Date | undefined) => {
    if (date) {
      const newDate = new Date(date);
      setSelectedDate(newDate);
      updateDateRange(selectedRange, newDate);
    }
  };

  const handleReset = () => {
    const today = new Date();
    setSelectedDate(today);
    setIsCustomDate(false);
    updateDateRange(selectedRange, today);
  };

  return (
    <div className="flex justify-end items-center space-x-4">
      <div className="flex bg-white/5 rounded-lg p-1">
        {ranges.map((range) => (
          <Button
            key={range}
            onClick={() => handleRangeChange(range)}
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
          onClick={() => handleNavigate("prev")}
          className="h-9 w-9 text-primary hover:text-primary/80"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 text-primary hover:text-primary/80">
              <CalendarIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleCalendarSelect}
              initialFocus
              className="rounded-md border"
            />
          </PopoverContent>
        </Popover>
        {isCustomDate && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleReset}
            className="h-9 w-9 text-primary hover:text-primary/80"
            title="Reset to today"
          >
            <CalendarClock className="h-4 w-4" />
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleNavigate("next")}
          className="h-9 w-9 text-primary hover:text-primary/80"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default TimeRangeSelector;
