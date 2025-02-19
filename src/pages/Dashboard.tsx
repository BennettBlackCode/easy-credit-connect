
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { handleAuthRedirect } from "@/lib/auth-helpers";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

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
            <p className="text-gray-400">No automations run yet</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Credits Available</h3>
            <p className="text-2xl font-bold text-primary">0</p>
          </div>
          
          <div className="p-6 rounded-xl bg-white/5 border border-white/10">
            <h3 className="text-lg font-semibold mb-2">Account Status</h3>
            <p className="text-gray-400">Free Plan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
