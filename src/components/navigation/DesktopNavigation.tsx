
import { Link } from "react-router-dom";
import { ArrowUpRight, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface DesktopNavigationProps {
  session: Session | null;
  handleGetStarted: () => void;
  handleLogout: () => void;
  scrollToSection: (sectionId: string) => void;
}

const DesktopNavigation = ({
  session,
  handleGetStarted,
  handleLogout,
  scrollToSection,
}: DesktopNavigationProps) => {
  return (
    <div className="hidden md:flex items-center gap-8">
      <div className="flex items-center gap-6">
        {session ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/billing"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Billing
            </Link>
            <div className="h-5 w-px bg-gray-700" />
            <Link
              to="/automation"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              Run Automation
              <ArrowUpRight className="h-4 w-4" />
            </Link>
            <div className="h-5 w-px bg-gray-700" />
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors group"
            >
              <LogOut className="h-4 w-4 transition-colors group-hover:text-red-400" />
              <span>Logout</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-gray-300 hover:text-white transition-colors"
            >
              Pricing
            </button>
            <Link
              to="/auth"
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
            >
              Log In
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default DesktopNavigation;
