
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
  selected,
  onSelect,
  ...props
}: CalendarProps) {
  const [mode, setMode] = React.useState<'date' | 'month' | 'year' | 'decade' | 'century'>('date');
  const [viewDate, setViewDate] = React.useState<Date>(() => {
    return selected instanceof Date ? selected : new Date();
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

  const handleMonthSelect = (month: number) => {
    const newDate = new Date(viewDate);
    newDate.setMonth(month);
    setViewDate(newDate);
    setMode('date');
    if (onSelect) {
      onSelect(newDate);
    }
  };

  const handleYearSelect = (year: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(year);
    setViewDate(newDate);
    setMode('month');
  };

  const handleDecadeSelect = (decade: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(decade);
    setViewDate(newDate);
    setMode('year');
  };

  const handleCenturySelect = (century: number) => {
    const newDate = new Date(viewDate);
    newDate.setFullYear(century);
    setViewDate(newDate);
    setMode('decade');
  };

  const renderMonthView = () => {
    const months = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(viewDate);
      date.setMonth(i);
      return date.toLocaleString('default', { month: 'long' });
    });

    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {months.map((month, i) => (
          <button
            key={month}
            onClick={() => handleMonthSelect(i)}
            className="p-2 text-sm rounded hover:bg-accent"
          >
            {month}
          </button>
        ))}
      </div>
    );
  };

  const renderYearView = () => {
    const currentYear = viewDate.getFullYear();
    const startYear = Math.floor(currentYear / 10) * 10;
    const years = Array.from({ length: 10 }, (_, i) => startYear + i);

    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {years.map((year) => (
          <button
            key={year}
            onClick={() => handleYearSelect(year)}
            className="p-2 text-sm rounded hover:bg-accent"
          >
            {year}
          </button>
        ))}
      </div>
    );
  };

  const renderDecadeView = () => {
    const currentYear = viewDate.getFullYear();
    const startDecade = Math.floor(currentYear / 100) * 100;
    const decades = Array.from({ length: 10 }, (_, i) => ({
      start: startDecade + (i * 10),
      end: startDecade + (i * 10) + 9
    }));

    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {decades.map((decade) => (
          <button
            key={decade.start}
            onClick={() => handleDecadeSelect(decade.start)}
            className="p-2 text-sm rounded hover:bg-accent"
          >
            {`${decade.start}-${decade.end}`}
          </button>
        ))}
      </div>
    );
  };

  const renderCenturyView = () => {
    const currentYear = viewDate.getFullYear();
    const startCentury = Math.floor(currentYear / 1000) * 1000;
    const centuries = Array.from({ length: 10 }, (_, i) => ({
      start: startCentury + (i * 100),
      end: startCentury + (i * 100) + 99
    }));

    return (
      <div className="grid grid-cols-3 gap-2 p-2">
        {centuries.map((century) => (
          <button
            key={century.start}
            onClick={() => handleCenturySelect(century.start)}
            className="p-2 text-sm rounded hover:bg-accent"
          >
            {`${century.start}-${century.end}`}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div className={cn("p-3 bg-card border border-border", className)}>
      {mode === 'date' ? (
        <DayPicker
          showOutsideDays={showOutsideDays}
          className="w-full"
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
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
            day_today: "bg-accent text-accent-foreground",
            day_outside:
              "text-muted-foreground opacity-50",
            day_disabled: "text-muted-foreground opacity-50",
            day_range_middle:
              "aria-selected:bg-accent aria-selected:text-accent-foreground",
            day_hidden: "invisible",
            ...classNames,
          }}
          components={{
            Caption: CustomCaption,
          }}
          selected={selected}
          onSelect={onSelect}
          month={viewDate}
          {...props}
        />
      ) : mode === 'month' ? (
        <div>
          <CustomCaption displayMonth={viewDate} />
          {renderMonthView()}
        </div>
      ) : mode === 'year' ? (
        <div>
          <CustomCaption displayMonth={viewDate} />
          {renderYearView()}
        </div>
      ) : mode === 'decade' ? (
        <div>
          <CustomCaption displayMonth={viewDate} />
          {renderDecadeView()}
        </div>
      ) : (
        <div>
          <CustomCaption displayMonth={viewDate} />
          {renderCenturyView()}
        </div>
      )}
    </div>
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
