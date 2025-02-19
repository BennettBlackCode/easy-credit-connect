
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { handleAuthRedirect } from "@/lib/auth-helpers";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

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
    queryKey: ["recent-automations", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automations")
        .select("*")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false })
        .limit(5);

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

  return (
    <div className="min-h-screen bg-[#030303] text-white pt-24">
      <div className="max-w-7xl mx-auto px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <Button asChild className="bg-primary hover:bg-primary/90">
            <Link to="/automation" className="flex items-center gap-2">
              Start Now <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Recent Automations</h3>
            {recentAutomations && recentAutomations.length > 0 ? (
              <div className="space-y-3">
                {recentAutomations.map((automation) => (
                  <div key={automation.id} className="text-sm text-gray-400">
                    <p className="text-white">{automation.company_name}</p>
                    <p className="text-xs">{new Date(automation.created_at).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400">No automations run yet</p>
            )}
          </div>
          
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Credits Available</h3>
            <p className="text-2xl font-bold text-primary">{totalCredits}</p>
            <div className="mt-2 space-y-1 text-sm text-gray-400">
              <p>Permanent: {userData?.permanent_credits || 0}</p>
              <p>Subscription: {userData?.subscription_credits || 0}</p>
            </div>
          </div>
          
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Account Status</h3>
            <p className="text-gray-400">{formatSubscriptionType(userData?.subscription_type)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
