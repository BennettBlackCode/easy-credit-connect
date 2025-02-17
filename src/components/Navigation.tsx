
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, CreditCard, BarChart2, LogIn, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message,
      });
    }
  };

  const navItems = [
    { path: "/features", label: "Features" },
    { path: "/pricing", label: "Pricing" },
    { path: "/docs", label: "Docs" },
    ...(session
      ? [
          { path: "/dashboard", label: "Dashboard", icon: BarChart2 },
          { path: "/billing", label: "Billing", icon: CreditCard },
        ]
      : []),
  ];

  return (
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              1clickseo.io
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 rounded-full text-sm transition-colors duration-200 ${
                    isActive(item.path)
                      ? "text-black bg-primary"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
            {session ? (
              <button
                onClick={handleLogout}
                className="ml-4 px-5 py-2.5 rounded-full text-black bg-primary hover:bg-primary/90 transition-colors duration-200 text-sm font-medium shadow-[0_0_20px_rgba(46,213,115,0.3)]"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="ml-4 px-5 py-2.5 rounded-full text-black bg-primary hover:bg-primary/90 transition-colors duration-200 text-sm font-medium shadow-[0_0_20px_rgba(46,213,115,0.3)]"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg text-gray-400 hover:text-white"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden transition-all duration-200 ease-in-out ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/5 mt-2">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-4 py-3 rounded-xl text-base transition-colors duration-200 ${
                  isActive(item.path)
                    ? "text-black bg-primary"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            {session ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full px-4 py-3 rounded-xl text-black bg-primary hover:bg-primary/90 transition-colors duration-200"
              >
                Sign Out
              </button>
            ) : (
              <Link
                to="/auth"
                className="block w-full px-4 py-3 rounded-xl text-black bg-primary hover:bg-primary/90 transition-colors duration-200"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
