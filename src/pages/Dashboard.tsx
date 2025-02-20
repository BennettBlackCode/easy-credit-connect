
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import UsageChart from "@/components/dashboard/UsageChart";
import RunsTable from "@/components/dashboard/RunsTable";
import { 
  startOfDay, 
  endOfDay, 
  format, 
  getWeek, 
  startOfMonth,
  endOfMonth,
  getDaysInMonth,
  addDays,
  addHours,
  startOfWeek,
  endOfWeek,
  startOfYear,
  endOfYear,
  eachDayOfInterval,
  eachWeekOfInterval,
  eachMonthOfInterval,
  subDays
} from "date-fns";

type TimeRange = "day" | "week" | "month" | "year";

const Dashboard = () => {
  const { session } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  });
  const [searchQuery, setSearchQuery] = useState("");

  const handleDateChange = (start: Date, end: Date) => {
    setDateRange({ start, end });
  };

  const generateChartData = () => {
    const { data: automations } = useQuery({
      queryKey: ["automations", session?.user?.id, dateRange],
      queryFn: async () => {
        const { data, error } = await supabase
          .from("automations")
          .select("created_at")
          .eq("user_id", session?.user?.id)
          .gte("created_at", dateRange.start.toISOString())
          .lte("created_at", dateRange.end.toISOString())
          .order("created_at", { ascending: true });

        if (error) throw error;
        return data || [];
      },
      enabled: !!session?.user?.id,
    });

    let intervals: Date[];
    let format: string;

    switch (timeRange) {
      case "day":
        intervals = Array.from({ length: 24 }, (_, i) => 
          addHours(startOfDay(dateRange.start), i)
        );
        format = "HH:mm";
        break;
      case "week":
        intervals = eachDayOfInterval({
          start: startOfWeek(dateRange.start),
          end: endOfWeek(dateRange.start)
        });
        format = "EEE";
        break;
      case "month":
        intervals = eachDayOfInterval({
          start: startOfMonth(dateRange.start),
          end: endOfMonth(dateRange.start)
        });
        format = "MMM d";
        break;
      case "year":
        intervals = eachMonthOfInterval({
          start: startOfYear(dateRange.start),
          end: endOfYear(dateRange.start)
        });
        format = "MMM";
        break;
      default:
        intervals = [];
        format = "";
    }

    return intervals.map(date => {
      let periodStart: Date;
      let periodEnd: Date;

      switch (timeRange) {
        case "day":
          periodStart = date;
          periodEnd = addHours(date, 1);
          break;
        case "week":
        case "month":
          periodStart = startOfDay(date);
          periodEnd = endOfDay(date);
          break;
        case "year":
          periodStart = startOfMonth(date);
          periodEnd = endOfMonth(date);
          break;
        default:
          periodStart = date;
          periodEnd = date;
      }

      const runsInPeriod = automations?.filter(automation => {
        const automationDate = new Date(automation.created_at);
        return automationDate >= periodStart && automationDate < periodEnd;
      }).length || 0;

      return {
        date: date.toISOString(),
        runs: runsInPeriod
      };
    });
  };

  const { data: userData } = useQuery({
    queryKey: ["user-dashboard", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("permanent_credits, subscription_credits, subscription_type, user_name")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: recentAutomations } = useQuery({
    queryKey: ["recent-automations", session?.user?.id, searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("automations")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("company_name", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

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

  const chartData = generateChartData();

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 sm:pt-32">
        {userData?.user_name && (
          <h1 className="text-2xl sm:text-3xl font-bold mb-8 sm:mb-12 text-white/90">
            Welcome back, {userData.user_name}
          </h1>
        )}
        <div className="space-y-6 sm:space-y-8">
          <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10 overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h2 className="text-lg sm:text-xl font-medium text-white/90">
                {formatDateDisplay()}
              </h2>
              <TimeRangeSelector
                selectedRange={timeRange}
                onRangeChange={setTimeRange}
                onDateChange={handleDateChange}
              />
            </div>
            <div className="h-[200px] sm:h-[300px] md:h-[400px] w-full">
              <UsageChart 
                data={chartData} 
                timeRange={timeRange}
              />
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Recent Runs</h3>
            <RunsTable
              runs={recentAutomations?.map(run => ({
                id: run.id,
                created_at: run.created_at,
                company_name: run.company_name,
                credits_used: 1,
              })) || []}
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
