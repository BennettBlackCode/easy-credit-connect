
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
    { path: "/", label: "Home" },
    { path: "/pricing", label: "Pricing" },
    ...(session
      ? [
          { path: "/dashboard", label: "Dashboard", icon: BarChart2 },
          { path: "/billing", label: "Billing", icon: CreditCard },
        ]
      : []),
  ];

  return (
    <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-lg border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-primary hover:text-primary-hover transition-colors"
            >
              CreditFlow
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-primary hover:bg-primary/5"
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ))}
            {session ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-1 px-4 py-2 rounded-md bg-primary text-white hover:bg-primary-hover transition-colors"
              >
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
            >
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`md:hidden ${isOpen ? "block" : "hidden"}`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium ${
                isActive(item.path)
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:text-primary hover:bg-primary/5"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon && <item.icon className="w-4 h-4" />}
              <span>{item.label}</span>
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex w-full items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-hover"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="flex items-center space-x-2 px-3 py-2 rounded-md text-base font-medium text-white bg-primary hover:bg-primary-hover"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
