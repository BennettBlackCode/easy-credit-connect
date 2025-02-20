
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, CreditCard, BarChart2, ArrowUpRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setScrollDirection("down");
      } else {
        setScrollDirection("up");
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    ...(session
      ? [
          { path: "/dashboard", label: "Dashboard", icon: BarChart2 },
          { path: "/billing", label: "Billing", icon: CreditCard },
        ]
      : [
          { path: "/pricing", label: "Pricing" }
        ]),
  ];

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrollDirection === "down" 
          ? "transform -translate-y-2 opacity-95 scale-95" 
          : "transform translate-y-0 opacity-100 scale-100"
      }`}
    >
      <div className="backdrop-blur-xl bg-black/40 border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center">
              <Link
                to="/"
                className="text-xl md:text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent transition-all duration-200 hover:scale-105"
              >
                1clickseo.io
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              <div className="flex items-center gap-1 bg-white/5 rounded-full p-1 backdrop-blur-sm">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`px-4 py-2 rounded-full text-sm transition-all duration-200 ${
                      isActive(item.path)
                        ? "text-white bg-white/10 scale-105"
                        : "text-gray-300 hover:text-white hover:scale-105"
                    }`}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
              {session ? (
                <Link
                  to="/automation"
                  className="ml-4 px-5 py-2.5 rounded-full text-black bg-primary hover:bg-primary/90 transition-all duration-200 text-sm font-medium shadow-[0_0_20px_rgba(46,213,115,0.3)] flex items-center gap-2 hover:scale-105"
                >
                  Run Automation <ArrowUpRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  to="/auth"
                  className="ml-4 px-5 py-2.5 rounded-full text-black bg-primary hover:bg-primary/90 transition-all duration-200 text-sm font-medium shadow-[0_0_20px_rgba(46,213,115,0.3)] hover:scale-105"
                >
                  Sign In
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 rounded-lg text-gray-400 hover:text-white transition-colors duration-200"
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
          {isOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`block px-4 py-3 rounded-xl text-base transition-all duration-200 ${
                      isActive(item.path)
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                {session ? (
                  <Link
                    to="/automation"
                    className="block w-full px-4 py-3 rounded-xl text-black bg-primary hover:bg-primary/90 transition-all duration-200 flex items-center justify-center gap-2"
                    onClick={() => setIsOpen(false)}
                  >
                    Run Automation <ArrowUpRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <Link
                    to="/auth"
                    className="block w-full px-4 py-3 rounded-xl text-black bg-primary hover:bg-primary/90 transition-all duration-200 text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
