
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { startOfMonth } from "date-fns";

export const useDashboardData = () => {
  const { session } = useAuth();

  const { data: userData } = useQuery({
    queryKey: ["user-calculated-credits", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users_with_calculated_credits")
        .select("remaining_credits, total_credits, user_name")
        .eq("user_id", session?.user?.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const { data: periodRuns } = useQuery({
    queryKey: ["period-runs", session?.user?.id],
    queryFn: async () => {
      const startDate = startOfMonth(new Date());
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
    queryKey: ["recent-automations", session?.user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("automations")
        .select("id, created_at, company_name, google_drive")
        .eq("user_id", session?.user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  return {
    userData,
    periodRuns,
    recentAutomations
  };
};
