
import { Link } from "react-router-dom";
import { ArrowUpRight, LogOut } from "lucide-react";
import { Session } from "@supabase/supabase-js";

interface MobileNavigationProps {
  session: Session | null;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleGetStarted: () => void;
  handleLogout: () => void;
  scrollToSection: (sectionId: string) => void;
  navigate: (path: string) => void;
}

const MobileNavigation = ({
  session,
  isOpen,
  setIsOpen,
  handleGetStarted,
  handleLogout,
  scrollToSection,
  navigate,
}: MobileNavigationProps) => {
  return (
    <div
      className={`md:hidden fixed inset-x-0 top-16 transition-all duration-300 ${
        isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      }`}
    >
      <div className="px-4 py-4 bg-black/95 backdrop-blur-xl border-t border-white/10">
        <div className="flex flex-col gap-4">
          {session ? (
            <>
              <Link
                to="/dashboard"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                to="/billing"
                className="text-gray-300 hover:text-white transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                Billing
              </Link>
              <div className="h-px w-full bg-gray-800" />
              <Link
                to="/automation"
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Run Automation
                <ArrowUpRight className="h-4 w-4" />
              </Link>
              <div className="h-px w-full bg-gray-800" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors py-2 group"
              >
                <LogOut className="h-4 w-4 transition-colors group-hover:text-red-400" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => {
                  navigate("/");
                  setIsOpen(false);
                }}
                className="text-left text-gray-300 hover:text-white transition-colors py-2"
              >
                Home
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-gray-300 hover:text-white transition-colors py-2"
              >
                Features
              </button>
              <button
                onClick={() => scrollToSection("pricing")}
                className="text-left text-gray-300 hover:text-white transition-colors py-2"
              >
                Pricing
              </button>
              <Link
                to="/auth"
                className="flex items-center justify-center gap-2 w-full px-6 py-2.5 rounded-full text-white bg-primary hover:bg-primary/90 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Log In
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MobileNavigation;
