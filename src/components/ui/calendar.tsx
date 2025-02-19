
import * as React from "react";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { DayPicker, CaptionProps } from "react-day-picker";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  const [mode, setMode] = React.useState<'date' | 'month' | 'year' | 'decade' | 'century'>('date');
  const [viewDate, setViewDate] = React.useState<Date>(() => {
    return props.selected instanceof Date ? props.selected : new Date();
  });
  
  const CustomCaption = (props: CaptionProps) => {
    const { displayMonth } = props;
    
    const handleViewChange = () => {
      if (mode === 'date') setMode('month');
      else if (mode === 'month') setMode('year');
      else if (mode === 'year') setMode('decade');
      else if (mode === 'decade') setMode('century');
    };

    const getCaptionText = () => {
      const year = displayMonth.getFullYear();
      const month = displayMonth.toLocaleString('default', { month: 'long' });
      
      switch (mode) {
        case 'date':
          return `${month} ${year}`;
        case 'month':
          return year.toString();
        case 'year':
          const startDecade = Math.floor(year / 10) * 10;
          return `${startDecade}-${startDecade + 9}`;
        case 'decade':
          const startCentury = Math.floor(year / 100) * 100;
          return `${startCentury}-${startCentury + 99}`;
        default:
          return '';
      }
    };

    const handlePrevClick = () => {
      const newDate = new Date(displayMonth);
      switch (mode) {
        case 'date':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'month':
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
        case 'year':
          newDate.setFullYear(newDate.getFullYear() - 10);
          break;
        case 'decade':
          newDate.setFullYear(newDate.getFullYear() - 100);
          break;
        case 'century':
          newDate.setFullYear(newDate.getFullYear() - 100);
          break;
      }
      if (props.onMonthSelect) {
        props.onMonthSelect(newDate);
      }
      setViewDate(newDate);
    };

    const handleNextClick = () => {
      const newDate = new Date(displayMonth);
      switch (mode) {
        case 'date':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'month':
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
        case 'year':
          newDate.setFullYear(newDate.getFullYear() + 10);
          break;
        case 'decade':
          newDate.setFullYear(newDate.getFullYear() + 100);
          break;
        case 'century':
          newDate.setFullYear(newDate.getFullYear() + 100);
          break;
      }
      if (props.onMonthSelect) {
        props.onMonthSelect(newDate);
      }
      setViewDate(newDate);
    };

    const handleFastPrevClick = () => {
      const newDate = new Date(displayMonth);
      switch (mode) {
        case 'date':
          newDate.setFullYear(newDate.getFullYear() - 1);
          break;
        case 'month':
          newDate.setFullYear(newDate.getFullYear() - 10);
          break;
        case 'year':
          newDate.setFullYear(newDate.getFullYear() - 100);
          break;
      }
      if (props.onMonthSelect) {
        props.onMonthSelect(newDate);
      }
      setViewDate(newDate);
    };

    const handleFastNextClick = () => {
      const newDate = new Date(displayMonth);
      switch (mode) {
        case 'date':
          newDate.setFullYear(newDate.getFullYear() + 1);
          break;
        case 'month':
          newDate.setFullYear(newDate.getFullYear() + 10);
          break;
        case 'year':
          newDate.setFullYear(newDate.getFullYear() + 100);
          break;
      }
      if (props.onMonthSelect) {
        props.onMonthSelect(newDate);
      }
      setViewDate(newDate);
    };

    return (
      <div className="flex justify-between items-center w-full px-2">
        <div className="flex space-x-1">
          {mode !== 'century' && (
            <button
              onClick={handleFastPrevClick}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronsLeft className="h-4 w-4" />
            </button>
          )}
          <button
            onClick={handlePrevClick}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
        </div>
        <button
          onClick={handleViewChange}
          className="text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md px-2 py-1"
        >
          {getCaptionText()}
        </button>
        <div className="flex space-x-1">
          <button
            onClick={handleNextClick}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
            )}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          {mode !== 'century' && (
            <button
              onClick={handleFastNextClick}
              className={cn(
                buttonVariants({ variant: "outline" }),
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
              )}
            >
              <ChevronsRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 bg-card border border-border", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: cn(
          "relative p-0 text-center text-sm focus-within:relative focus-within:z-20",
          "first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md"
        ),
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
        CaptionLabel: CustomCaption,
      }}
      month={viewDate}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
