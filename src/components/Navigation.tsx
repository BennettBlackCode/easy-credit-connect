
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
    { path: "/pricing", label: "Pricing" },
    { path: "/features", label: "Features" },
    { path: "/integrations", label: "Integrations" },
    ...(session
      ? [
          { path: "/dashboard", label: "Dashboard", icon: BarChart2 },
          { path: "/billing", label: "Billing", icon: CreditCard },
        ]
      : []),
  ];

  return (
    <nav className="fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link
              to="/"
              className="text-xl font-bold text-transparent bg-gradient-to-r from-white via-white to-primary/80 bg-clip-text hover:opacity-80 transition-opacity flex items-center gap-2"
            >
              <span className="text-2xl">1clickseo.io</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  isActive(item.path)
                    ? "text-primary bg-primary/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.label}</span>
              </Link>
            ))}
            {session ? (
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 px-5 py-2 rounded-full bg-gradient-to-r from-primary/90 to-primary text-white hover:opacity-90 transition-all duration-200 ml-4"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-1 px-5 py-2 rounded-full bg-gradient-to-r from-primary/90 to-primary text-white hover:opacity-90 transition-all duration-200 ml-4"
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
              className="inline-flex items-center justify-center p-2 rounded-full text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
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
      <div 
        className={`md:hidden transform transition-all duration-200 ease-in-out ${
          isOpen ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
        }`}
      >
        <div className="px-4 pt-4 pb-6 space-y-2 bg-black/95 backdrop-blur-xl border-b border-white/5">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-base font-medium transition-colors duration-200 ${
                isActive(item.path)
                  ? "text-primary bg-primary/5"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              <span>{item.label}</span>
            </Link>
          ))}
          {session ? (
            <button
              onClick={() => {
                handleLogout();
                setIsOpen(false);
              }}
              className="flex w-full items-center justify-center space-x-2 px-4 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-primary/90 to-primary hover:opacity-90 transition-all duration-200"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </button>
          ) : (
            <Link
              to="/auth"
              className="flex w-full items-center justify-center space-x-2 px-4 py-3 rounded-xl text-base font-medium text-white bg-gradient-to-r from-primary/90 to-primary hover:opacity-90 transition-all duration-200"
              onClick={() => setIsOpen(false)}
            >
              <LogIn className="w-5 h-5" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
