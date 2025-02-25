
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Footer = () => {
  const { session } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Don't render footer if user is logged in
  if (session) return null;

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
    
    const element = document.getElementById(sectionId);
    if (element) {
      const navHeight = 80;
      const elementPosition = element.offsetTop - navHeight;
      window.scrollTo({
        top: elementPosition,
        behavior: "smooth"
      });
    }
  };

  const navigation = [
    { name: "Features", href: "/#features", onClick: () => scrollToSection("features") },
    { name: "Pricing", href: "/#pricing", onClick: () => scrollToSection("pricing") },
    { name: "FAQ", href: "/faq", onClick: () => navigate("/faq") },
    { name: "Log In", href: "/auth", onClick: () => navigate("/auth") }
  ];

  return (
    <footer className="border-t border-white/5 bg-black/40 backdrop-blur-xl mt-auto">
      <div className="container max-w-5xl mx-auto px-4">
        <div className="py-8">
          <div className="flex flex-col items-center space-y-6">
            <button
              onClick={scrollToTop}
              className="text-xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
            >
              1clickseo.io
            </button>
            <nav className="flex flex-wrap justify-center gap-x-8 gap-y-4">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={item.onClick || (() => navigate(item.href))}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </nav>
            <p className="text-sm text-gray-500">
              © {new Date().getFullYear()} 1clickseo.io. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
