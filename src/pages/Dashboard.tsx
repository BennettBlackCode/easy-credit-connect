
import { useState } from "react";
import { useDashboardData } from "@/hooks/useDashboardData";
import StatsCards from "@/components/dashboard/StatsCards";
import UsageSection from "@/components/dashboard/UsageSection";
import RunsTable from "@/components/dashboard/RunsTable";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { userData, periodRuns, recentAutomations } = useDashboardData();

  return (
    <div className="min-h-screen bg-[#030303] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24">
        {userData?.user_name && (
          <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-white/90">
            Welcome back, {userData.user_name}
          </h1>
        )}
        <div className="space-y-6">
          <StatsCards 
            remainingRuns={userData?.remaining_runs || 0}
            periodRuns={periodRuns || 0}
          />
          <UsageSection />
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
