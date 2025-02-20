import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const {
    session
  } = useAuth();
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleGetStarted = () => {
    if (session) {
      navigate("/automation");
    } else {
      navigate("/auth");
    }
    setIsOpen(false);
  };
  const scrollToSection = (sectionId: string) => {
    if (location.pathname !== "/") {
      navigate("/?section=" + sectionId);
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
  const isLoggedIn = !!session;
  return <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-black/90 backdrop-blur-lg" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="text-2xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
            1clickseo.io
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-6">
              {isLoggedIn ? <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors">
                    Dashboard
                  </Link>
                  <Link to="/billing" className="text-gray-300 hover:text-white transition-colors">
                    Billing
                  </Link>
                  <Link to="/automation" className="px-6 py-2.5 rounded-full text-black bg-primary hover:bg-primary/90 transition-colors duration-600 font-bold">
                    Run Automation
                  </Link>
                </> : <>
                  <button onClick={() => navigate("/")} className="text-gray-300 hover:text-white transition-colors">
                    Home
                  </button>
                  <button onClick={() => scrollToSection("features")} className="text-gray-300 hover:text-white transition-colors">
                    Features
                  </button>
                  <button onClick={() => scrollToSection("pricing")} className="text-gray-300 hover:text-white transition-colors">
                    Pricing
                  </button>
                  <button onClick={handleGetStarted} className="px-6 py-2.5 rounded-full text-black bg-primary hover:bg-primary/90 transition-colors duration-200 font-medium">
                    Get Started
                  </button>
                </>}
            </div>
          </div>

          {/* Mobile menu button */}
          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden fixed inset-x-0 top-20 transition-all duration-300 ${isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"}`}>
          <div className="px-4 py-4 bg-black/95 backdrop-blur-xl border-t border-white/10">
            <div className="flex flex-col gap-4">
              {isLoggedIn ? <>
                  <Link to="/dashboard" className="text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/billing" className="text-gray-300 hover:text-white transition-colors py-2" onClick={() => setIsOpen(false)}>
                    Billing
                  </Link>
                  <Link to="/automation" className="w-full px-6 py-2.5 rounded-full text-black bg-primary hover:bg-primary/90 transition-colors duration-200 text-center font-medium" onClick={() => setIsOpen(false)}>
                    Run Automation
                  </Link>
                </> : <>
                  <button onClick={() => {
                navigate("/");
                setIsOpen(false);
              }} className="text-left text-gray-300 hover:text-white transition-colors py-2">
                    Home
                  </button>
                  <button onClick={() => scrollToSection("features")} className="text-left text-gray-300 hover:text-white transition-colors py-2">
                    Features
                  </button>
                  <button onClick={() => scrollToSection("pricing")} className="text-left text-gray-300 hover:text-white transition-colors py-2">
                    Pricing
                  </button>
                  <button onClick={handleGetStarted} className="w-full px-6 py-2.5 rounded-full text-black bg-primary hover:bg-primary/90 transition-colors duration-200 text-center font-medium">
                    Get Started
                  </button>
                </>}
            </div>
          </div>
        </div>
      </div>
    </nav>;
};
export default Navigation;