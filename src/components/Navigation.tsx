
import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import DesktopNavigation from "./navigation/DesktopNavigation";
import MobileNavigation from "./navigation/MobileNavigation";

/**
 * @fileoverview Main navigation component that provides site-wide navigation functionality
 * This component:
 * - Renders the main navigation bar at the top of the application
 * - Handles responsive mobile/desktop navigation
 * - Manages user authentication state
 * - Provides access to key application features
 *
 * @component Navigation
 * @example
 * ```tsx
 * <Navigation />
 * ```
 */

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState("up");
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { toast } = useToast();

  const isAuthenticatedRoute = ["/dashboard", "/billing", "/automation"].includes(location.pathname);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setScrolled(currentScrollY > 20);

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

  const handleGetStarted = () => {
    if (location.pathname === '/auth') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('isLogin', 'true');
      window.history.replaceState(null, '', `${window.location.pathname}?${searchParams}`);
    } else {
      navigate('/auth');
      // Update auth state after navigation
      window.history.replaceState(null, '', '/auth');
      const searchParams = new URLSearchParams(window.location.search);
      searchParams.set('isLogin', 'true');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account",
      });
      navigate("/");
      setIsOpen(false);
    } catch (error) {
      console.error("Error logging out:", error);
      toast({
        title: "Error logging out",
        description: "There was a problem logging out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/?section=" + sectionId);
      return;
    }
    
    if (sectionId === "home") {
      scrollToTop();
      setIsOpen(false);
      return;
    }

    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
    setIsOpen(false);
  };

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (session) {
      navigate("/dashboard");
    } else {
      navigate("/");
      scrollToTop();
    }
  };

  return (
    <nav 
      className={`fixed top-0 w-full z-50 transition-all duration-300 nav-blur ${isAuthenticatedRoute ? 'bg-black/95 backdrop-blur-xl border-b border-white/10' : ''} ${scrollDirection === 'down' ? '-translate-y-full scale-95' : 'translate-y-0 scale-100'}`}
      style={{
        transform: `translateY(${scrollDirection === 'down' ? '-100%' : '0'}) scale(${scrollDirection === 'down' ? 0.95 : 1})`
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button
            onClick={handleLogoClick}
            className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
          >
            1clickseo.io
          </button>

          <DesktopNavigation
            session={session}
            handleGetStarted={handleGetStarted}
            handleLogout={handleLogout}
            scrollToSection={scrollToSection}
          />

          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        <MobileNavigation
          session={session}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          handleGetStarted={handleGetStarted}
          handleLogout={handleLogout}
          scrollToSection={scrollToSection}
          navigate={navigate}
        />
      </div>
    </nav>
  );
};

export default Navigation;
