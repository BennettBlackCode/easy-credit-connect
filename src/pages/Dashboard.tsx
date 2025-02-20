
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import RunsTable from "@/components/dashboard/RunsTable";
import UsageChart from "@/components/dashboard/UsageChart";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear } from "date-fns";

type TimeRange = "day" | "week" | "month" | "year";

interface Automation {
  id: string;
  created_at: string;
  company_name: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, isLoading: authLoading } = useAuth();
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [startDate, setStartDate] = useState<Date>(startOfWeek(new Date()));
  const [endDate, setEndDate] = useState<Date>(endOfWeek(new Date()));
  const [searchQuery, setSearchQuery] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !session) {
      navigate("/auth");
    }
  }, [session, authLoading, navigate]);

  // Fetch automation data
  const { data: automations = [], isLoading: runsLoading } = useQuery({
    queryKey: ['automations', startDate, endDate],
    queryFn: async () => {
      if (!session) return [];
      const { data, error } = await supabase
        .from('automations')
        .select('id, created_at, company_name')
        .gte('created_at', startDate.toISOString())
        .lte('created_at', endDate.toISOString())
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []) as Automation[];
    },
    enabled: !!session
  });

  // Handle time range changes
  const handleRangeChange = (range: TimeRange) => {
    setTimeRange(range);
    const now = new Date();
    
    switch (range) {
      case "day":
        setStartDate(startOfDay(now));
        setEndDate(endOfDay(now));
        break;
      case "week":
        setStartDate(startOfWeek(now));
        setEndDate(endOfWeek(now));
        break;
      case "month":
        setStartDate(startOfMonth(now));
        setEndDate(endOfMonth(now));
        break;
      case "year":
        setStartDate(startOfYear(now));
        setEndDate(endOfYear(now));
        break;
    }
  };

  const handleDateChange = (start: Date, end: Date) => {
    setStartDate(start);
    setEndDate(end);
  };

  // Prepare data for usage chart
  const chartData = automations.map(run => ({
    date: run.created_at,
    runs: 1,
  }));

  // Transform automations into runs format
  const runs = automations.map(automation => ({
    id: automation.id,
    created_at: automation.created_at,
    company_name: automation.company_name,
    credits_used: 1 // Default value since we don't have this in automations
  }));

  // Filter runs based on search query
  const filteredRuns = runs.filter(run => 
    run.company_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || runsLoading) {
    return (
      <div className="container py-24">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container py-24">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-gray-400">Monitor your automation usage and performance</p>
        </div>

        <TimeRangeSelector
          selectedRange={timeRange}
          onRangeChange={handleRangeChange}
          onDateChange={handleDateChange}
        />
        
        <UsageChart 
          data={chartData}
          timeRange={timeRange}
        />
        
        <RunsTable
          runs={filteredRuns}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>
    </div>
  );
};

export default Dashboard;
