
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
import { startOfDay, endOfDay, format, getWeek } from "date-fns";

type TimeRange = "day" | "week" | "month" | "year";

const Dashboard = () => {
  const { session } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("day");
  const [dateRange, setDateRange] = useState<{ start: Date; end: Date }>({
    start: startOfDay(new Date()),
    end: endOfDay(new Date()),
  });
  const [searchQuery, setSearchQuery] = useState("");

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
      case "month":
        return Array.from({ length: 30 }, (_, i) => {
          const date = new Date(dateRange.start);
          date.setDate(date.getDate() + i);
          return {
            date: date.toISOString(),
            runs: Math.floor(Math.random() * 15),
          };
        });
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

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div className="max-w-7xl mx-auto px-8 pt-24">
        {userData?.user_name && (
          <h1 className="text-3xl font-bold mb-8 text-white/90">
            Welcome back, {userData.user_name}
          </h1>
        )}
        <div className="space-y-8">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-medium text-white/90">
                {formatDateDisplay()}
              </h2>
              <TimeRangeSelector
                selectedRange={timeRange}
                onRangeChange={setTimeRange}
                onDateChange={(start, end) => setDateRange({ start, end })}
              />
            </div>
            <UsageChart 
              data={generateChartData()} 
              timeRange={timeRange}
            />
          </div>

          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-4">Recent Runs</h3>
            <RunsTable
              runs={recentAutomations?.map(run => ({
                id: run.id,
                created_at: run.created_at,
                company_name: run.company_name,
                credits_used: 1, // Replace with actual credits used
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
