
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import RunsTable from "@/components/dashboard/RunsTable";
import UsageChart from "@/components/dashboard/UsageChart";
import TimeRangeSelector from "@/components/dashboard/TimeRangeSelector";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/auth");
    }
  }, [session, isLoading, navigate]);

  if (isLoading) {
    return <div className="container py-24">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    </div>;
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

        <TimeRangeSelector />
        <UsageChart />
        <RunsTable />
      </div>
    </div>
  );
};

export default Dashboard;
