
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { TimeRange } from "@/components/dashboard/UsageSection";
import {
  startOfHour,
  endOfHour,
  eachHourOfInterval,
  eachDayOfInterval,
  eachMonthOfInterval,
} from "date-fns";

export const useUsageData = (
  timeRange: TimeRange,
  dateRange: { start: Date; end: Date }
) => {
  const { session } = useAuth();

  return useQuery({
    queryKey: ["usage-data", session?.user?.id, timeRange, dateRange.start, dateRange.end],
    queryFn: async () => {
      if (!session?.user?.id) return [];

      const { data: runs, error } = await supabase
        .from("automation_logs")
        .select("created_at")
        .eq("user_id", session.user.id)
        .gte("created_at", dateRange.start.toISOString())
        .lte("created_at", dateRange.end.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      let intervals: Date[];
      switch (timeRange) {
        case "day":
          intervals = eachHourOfInterval({
            start: startOfHour(dateRange.start),
            end: endOfHour(dateRange.end),
          });
          break;
        case "week":
        case "month":
          intervals = eachDayOfInterval({
            start: dateRange.start,
            end: dateRange.end,
          });
          break;
        case "year":
          intervals = eachMonthOfInterval({
            start: dateRange.start,
            end: dateRange.end,
          });
          break;
        default:
          intervals = [];
      }

      return intervals.map(interval => {
        const nextInterval = new Date(interval);
        switch (timeRange) {
          case "day":
            nextInterval.setHours(interval.getHours() + 1);
            break;
          case "week":
          case "month":
            nextInterval.setDate(interval.getDate() + 1);
            break;
          case "year":
            nextInterval.setMonth(interval.getMonth() + 1);
            break;
        }

        const runsInInterval = runs?.filter(run => {
          const runDate = new Date(run.created_at);
          return runDate >= interval && runDate < nextInterval;
        });

        return {
          date: interval.toISOString(),
          runs: runsInInterval?.length || 0,
        };
      });
    },
    enabled: !!session?.user?.id,
  });
};
