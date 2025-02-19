
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { handleAuthRedirect } from "@/lib/auth-helpers";

const Dashboard = () => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        // Handle potential OAuth redirect
        const redirectSession = await handleAuthRedirect();
        
        // If no session and no redirect session, redirect to auth
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
    <div className="min-h-screen bg-[#030303] text-white p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        {/* Add your dashboard content here */}
      </div>
    </div>
  );
};

export default Dashboard;
