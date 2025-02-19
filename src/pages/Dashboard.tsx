
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { handleAuthRedirect } from "@/lib/auth-helpers";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";
import UsageChart from "@/components/dashboard/UsageChart";
import RunsTable from "@/components/dashboard/RunsTable";

type TimeRange = "day" | "week" | "month" | "year";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("week");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: userData } = useQuery({
    queryKey: ["user-dashboard", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("permanent_credits, subscription_credits, subscription_type")
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

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        const redirectSession = await handleAuthRedirect();
        if (!session && !redirectSession) {
          navigate("/auth");
          return;
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Dashboard initialization error:", error);
        navigate("/auth");
      }
    };

    initializeDashboard();
  }, [session, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#030303]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  const totalCredits = (userData?.permanent_credits || 0) + (userData?.subscription_credits || 0);

  const formatSubscriptionType = (type: string | null | undefined) => {
    if (!type) return "Free Plan";
    return type.toLowerCase().endsWith('plan') ? type : `${type} Plan`;
  };

  // Mock data for the chart - replace with real data
  const mockChartData = Array.from({ length: 7 }, (_, i) => ({
    date: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString(),
    usage: Math.floor(Math.random() * 10),
  })).reverse();

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-8">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                <span className="text-gray-400">Status:</span>
                <span className="text-primary font-medium">
                  {formatSubscriptionType(userData?.subscription_type)}
                </span>
              </div>
              <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                <span className="text-gray-400">Credits:</span>
                <span className="text-primary font-medium">{totalCredits}</span>
              </div>
            </div>
          </div>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/automation" className="flex items-center gap-2">
              Start Now <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="space-y-8">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <TimeRangeSelector
              selectedRange={timeRange}
              onRangeChange={setTimeRange}
              onNavigate={(direction) => {
                console.log("Navigate:", direction);
                // Implement date navigation
              }}
            />
            <UsageChart data={mockChartData} />
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
