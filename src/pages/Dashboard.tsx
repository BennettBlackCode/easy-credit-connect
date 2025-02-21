
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
  subMonths 
} from "date-fns";
import { Card, CardContent } from "@/components/ui/card";

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

  // Query to get user data including remaining runs
  const { data: userData } = useQuery({
    queryKey: ["user-dashboard", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("permanent_credits, subscription_credits, subscription_type, user_name, remaining_runs")
        .eq("id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Query to get runs used this billing period
  const { data: periodRuns } = useQuery({
    queryKey: ["period-runs", session?.user?.id],
    queryFn: async () => {
      const startDate = startOfMonth(new Date()); // Using start of month as billing period
      const { count, error } = await supabase
        .from("automations")
        .select("*", { count: 'exact', head: true })
        .eq("user_id", session?.user?.id)
        .gte("created_at", startDate.toISOString());

      if (error) throw error;
      return count || 0;
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

  const totalCredits = (userData?.permanent_credits || 0) + (userData?.subscription_credits || 0);

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
    <div className="min-h-screen bg-[#030303] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {userData?.user_name && (
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white/90">
            Welcome back, {userData.user_name}
          </h1>
        )}
        <div className="space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="text-sm text-gray-400 mb-2">Remaining Runs</div>
                <div className="text-3xl font-bold text-white">
                  {userData?.remaining_runs || 0}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white/5 border-white/10">
              <CardContent className="p-6">
                <div className="text-sm text-gray-400 mb-2">Runs This Month</div>
                <div className="text-3xl font-bold text-white">
                  {periodRuns || 0}
                </div>
              </CardContent>
            </Card>
          </div>

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
